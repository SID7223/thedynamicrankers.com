// api/contact.ts
// Vercel Serverless Function: receives form submissions and emails them via Resend.
// Works with:
// - application/json (fetch)
// - application/x-www-form-urlencoded (plain HTML form)
// No DB/storage. Includes honeypot spam protection.

type AnyObj = Record<string, any>;

function escapeHtml(str: string) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toStringValue(v: any) {
  if (v == null) return "";
  if (Array.isArray(v)) return String(v[0] ?? "");
  return String(v);
}

function getHeader(req: any, name: string) {
  const h = req.headers || {};
  const lower = name.toLowerCase();
  return toStringValue(h[lower] ?? h[name] ?? "");
}

async function readBody(req: any): Promise<{ contentType: string; payload: AnyObj }> {
  const contentType = getHeader(req, "content-type").toLowerCase();
  const rawText: string = typeof req.text === "function" ? await req.text() : "";

  // JSON
  if (contentType.includes("application/json")) {
    try {
      return { contentType, payload: JSON.parse(rawText || "{}") };
    } catch {
      return { contentType, payload: {} };
    }
  }

  // HTML form (urlencoded)
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(rawText);
    const obj: AnyObj = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });
    return { contentType, payload: obj };
  }

  // fallback: try JSON, else urlencoded-like
  try {
    return { contentType, payload: JSON.parse(rawText || "{}") };
  } catch {
    const params = new URLSearchParams(rawText);
    const obj: AnyObj = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });
    return { contentType, payload: obj };
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const { contentType, payload } = await readBody(req);

  // Honeypot (spam)
  const honeypot =
    toStringValue(payload["bot-field"]) ||
    toStringValue(payload["bot_field"]) ||
    toStringValue(payload["hp"]);

  const redirectTo = toStringValue(payload.redirect) || "/thank-you";

  if (honeypot) {
    // Pretend success for bots
    if (contentType.includes("application/x-www-form-urlencoded")) {
      res.writeHead(303, { Location: redirectTo });
      res.end();
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const name = toStringValue(payload.name).trim();
  const email = toStringValue(payload.email).trim();
  const message = toStringValue(payload.message).trim();
  const phone = toStringValue(payload.phone).trim();
  const service = toStringValue(payload.service || payload.serviceOfInterest).trim();
  const company = toStringValue(payload.company).trim();
  const industry = toStringValue(payload.industry).trim();
  const timeline = toStringValue(payload.timeline).trim();

  if (!name || !email || !message) {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      // For plain forms, still redirect (keeps UX simple)
      res.writeHead(303, { Location: redirectTo });
      res.end();
      return;
    }
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing required fields: name, email, message" }));
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FORMS_TO_EMAIL = process.env.FORMS_TO_EMAIL;

  if (!RESEND_API_KEY || !FORMS_TO_EMAIL) {
    console.error("Missing RESEND_API_KEY or FORMS_TO_EMAIL env vars");
    res.statusCode = 500;
    res.end("Server misconfigured");
    return;
  }

  const subject = `New form submission from ${name}`;
  const html = `
    <h2>New form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ""}
    ${industry ? `<p><strong>Industry:</strong> ${escapeHtml(industry)}</p>` : ""}
    ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Use Resend default verified sender for now:
        // Later you can change to no-reply@thedynamicrankers.com after verifying domain in Resend.
        from: "onboarding@resend.dev",
        to: [FORMS_TO_EMAIL],
        subject,
        html,
      }),
    });

    if (!resendResp.ok) {
      const text = await resendResp.text();
      console.error("Resend API error:", resendResp.status, text);

      if (contentType.includes("application/x-www-form-urlencoded")) {
        // Keep UX: redirect anyway
        res.writeHead(303, { Location: redirectTo });
        res.end();
        return;
      }

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to send email" }));
      return;
    }

    // Success
    if (contentType.includes("application/x-www-form-urlencoded")) {
      res.writeHead(303, { Location: redirectTo });
      res.end();
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    if (contentType.includes("application/x-www-form-urlencoded")) {
      res.writeHead(303, { Location: redirectTo });
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end("Server error");
  }
}

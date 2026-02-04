// api/contact.ts
// Vercel serverless function that accepts POST requests from HTML forms (urlencoded)
// and from JS (JSON). Sends email via Resend. Uses RESEND_API_KEY and FORMS_TO_EMAIL env vars.

import { parse as parseQS } from "querystring";

async function getRawBody(req: any) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const contentType = (req.headers["content-type"] || "").toLowerCase();
  let payload: any = {};

  try {
    if (contentType.includes("application/json")) {
      // Most JS fetch calls
      payload = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk: any) => (data += chunk));
        req.on("end", () => {
          try {
            resolve(JSON.parse(data || "{}"));
          } catch (err) {
            // fallback: empty
            resolve({});
          }
        });
        req.on("error", reject);
      });
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Plain HTML form POST
      const raw = await getRawBody(req);
      payload = parseQS(raw.toString());
    } else {
      // Unknown content-type: try to parse body as text then JSON
      const raw = await getRawBody(req);
      const txt = raw.toString();
      try {
        payload = JSON.parse(txt || "{}");
      } catch {
        payload = parseQS(txt);
      }
    }
  } catch (err) {
    console.error("Failed to parse request body:", err);
    res.statusCode = 400;
    res.end("Bad Request");
    return;
  }

  const honeypot = payload["bot-field"] || payload["bot_field"] || payload.hp || "";
  if (honeypot) {
    // Likely spam - pretend success for forms
    if (payload.redirect && typeof payload.redirect === "string") {
      res.writeHead(303, { Location: payload.redirect });
      res.end();
      return;
    }
    res.statusCode = 200;
    res.end("OK");
    return;
  }

  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const message = (payload.message || "").trim();
  const phone = (payload.phone || "").trim();
  const service = (payload.service || payload.serviceOfInterest || "").trim();

  if (!name || !email || !message) {
    // For HTML forms, redirect back or to /thank-you? We'll return 400 for API JSON use.
    if (contentType.includes("application/x-www-form-urlencoded") && payload.redirect) {
      // Non-ideal: redirect to same page without success. We return a 303 to redirect back.
      res.writeHead(303, { Location: payload.redirect });
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

  const subject = `New contact form submission from ${name}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    <hr/>
    <p>IP: ${req.headers["x-forwarded-for"] || req.socket.remoteAddress || "n/a"}</p>
    <p>User-Agent: ${escapeHtml(req.headers["user-agent"] || "")}</p>
  `;

  try {
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [FORMS_TO_EMAIL],
        subject,
        html,
      }),
    });

    if (!resendResp.ok) {
      const text = await resendResp.text();
      console.error("Resend API error:", resendResp.status, text);
      // For HTML form submits, redirect to an error page if desired, else respond 500
      if (contentType.includes("application/x-www-form-urlencoded") && payload.redirect) {
        // redirect to the redirect target even on failure (to avoid revealing internals).
        res.writeHead(303, { Location: payload.redirect });
        res.end();
        return;
      }
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to send email" }));
      return;
    }

    // Success
    if (contentType.includes("application/x-www-form-urlencoded") && payload.redirect) {
      const redirectTo = payload.redirect || "/thank-you";
      res.writeHead(303, { Location: redirectTo });
      res.end();
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
    return;
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    res.statusCode = 500;
    res.end("Server error");
    return;
  }
}

function escapeHtml(str: string) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}

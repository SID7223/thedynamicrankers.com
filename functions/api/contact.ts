import { Resend } from "resend";

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function ContactEmailTemplate({
  name,
  email,
  phone,
  message,
}: { name: string; email: string; phone?: string; message: string }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "";
  const safeMessage = message ? escapeHtml(message) : "";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.4;">
      <h1>New call booking from ${safeName}</h1>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ""}
      ${
        safeMessage
          ? `<div><p><strong>Message:</strong></p><p>${safeMessage}</p></div>`
          : ""
      }
    </div>
  `;
}

export const onRequestPost = async (context: {
  env: {
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL: string;
    RESEND_TARGET_EMAIL: string;
    CONTACT_FROM_EMAIL?: string;
    CONTACT_TO_EMAIL?: string;
  };
  request: Request;
}) => {
  const { env, request } = context;

  try {
    const resendApiKey = env.RESEND_API_KEY;
    const resendFromEmail = env.RESEND_FROM_EMAIL || env.CONTACT_FROM_EMAIL;
    const resendTargetEmail = env.RESEND_TARGET_EMAIL || env.CONTACT_TO_EMAIL;

    if (!resendApiKey || !resendFromEmail || !resendTargetEmail) {
      return new Response(JSON.stringify({
        error: "Email service is not configured",
        details: "Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or RESEND_TARGET_EMAIL in environment variables."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let body: ContactRequestBody;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: resendFromEmail,
      to: [resendTargetEmail],
      subject: `New Contact Form Submission – ${name}`,
      html: ContactEmailTemplate({ name, email, phone, message }),
    });

    if (result.error) {
      return new Response(JSON.stringify({
        error: "Resend error",
        details: result.error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      id: result.data?.id,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: "Failed to send message",
      details: error.message || String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

import { Resend } from "resend";

interface EmailTemplateProps {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

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
}: EmailTemplateProps) {
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

  const resendApiKey = env.RESEND_API_KEY;
  const resendFromEmail = env.RESEND_FROM_EMAIL || env.CONTACT_FROM_EMAIL;
  const resendTargetEmail = env.RESEND_TARGET_EMAIL || env.CONTACT_TO_EMAIL;

  try {
    if (!resendApiKey || !resendFromEmail || !resendTargetEmail) {
      console.error("Missing Resend configuration.");
      return new Response(JSON.stringify({ error: "Email service is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json() as ContactRequestBody;
    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendApiKey);

    // Send email via Resend
    const result = await resend.emails.send({
      from: resendFromEmail,
      to: [resendTargetEmail],
      subject: `New Contact Form Submission – ${name}`,
      html: ContactEmailTemplate({
        name,
        email,
        phone,
        message,
      }),
    });

    return new Response(JSON.stringify({
      success: true,
      id: result.data?.id,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

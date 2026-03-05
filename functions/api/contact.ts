import { Resend } from "resend";

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
  subject?: string;
  type?: 'support' | 'general' | 'business';
}

function escapeHtml(value: string | number | boolean | null | undefined): string {
  if (typeof value !== 'string') return String(value || '');
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function ContactEmailTemplate(data: ContactRequestBody) {
  const typeLabel = data.type ? data.type.toUpperCase() : 'GENERAL';

  return `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0a0d36; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">New Contact Request</h1>
      </div>
      <div style="padding: 30px;">
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Request Details</p>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 100px;">Type:</td>
              <td style="padding: 5px 0;">${escapeHtml(typeLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Name:</td>
              <td style="padding: 5px 0;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Email:</td>
              <td style="padding: 5px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
            </tr>
          </table>
        </div>
        <div>
          <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        Sent via the Dynamic Rankers website
      </div>
    </div>
  `;
}

interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TARGET_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_TO_EMAIL: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const resendApiKey = env.RESEND_API_KEY;
    const resendFromEmail = env.RESEND_FROM_EMAIL || env.CONTACT_FROM_EMAIL;
    const resendTargetEmail = env.RESEND_TARGET_EMAIL || env.CONTACT_TO_EMAIL;

    if (!resendApiKey || !resendFromEmail || !resendTargetEmail) {
      console.error("Missing Resend configuration.");
      return new Response(JSON.stringify({
        error: "Email service is not configured",
      }), { status: 500 });
    }

    const data: ContactRequestBody = await request.json();

    if (!data.email || !data.name || !data.message) {
      return new Response(JSON.stringify({
        error: "Name, email, and message are required",
      }), { status: 400 });
    }

    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: resendFromEmail,
      to: [resendTargetEmail],
      subject: `[${data.type || 'General'}] Website Contact: ${data.name}`,
      html: ContactEmailTemplate(data),
      replyTo: data.email
    });

    if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      id: result.data?.id,
    }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Contact API error:", message);
    return new Response(JSON.stringify({
      error: "Failed to process contact request",
      details: message
    }), { status: 500 });
  }
};

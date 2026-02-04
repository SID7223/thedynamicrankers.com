import { Resend } from "resend";

interface EmailTemplateProps {
  name: string;
  email: string;
  phone?: string;
  message?: string;
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

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendTargetEmail = process.env.RESEND_TARGET_EMAIL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  // Allow only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!resendApiKey || !resendFromEmail || !resendTargetEmail) {
      console.error("Missing Resend configuration.");
      return res.status(500).json({
        error: "Email service is not configured",
      });
    }

    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email, and message are required",
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

    return res.status(200).json({
      success: true,
      id: result.data?.id,
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return res.status(500).json({
      error: "Failed to send message",
    });
  }
}




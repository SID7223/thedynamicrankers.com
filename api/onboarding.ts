import { Resend } from "resend";

interface OnboardingData {
  orgName: string;
  industry: string;
  location: string;
  role: string;
  email: string;
  phone: string;
  primaryIntent: string;
  refinement: string;
  closing: string;
}

function escapeHtml(value: string) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function OnboardingEmailTemplate(data: OnboardingData) {
  const fields = Object.entries(data).map(([key, value]) => {
    return `<p><strong>${key}:</strong> ${escapeHtml(value)}</p>`;
  }).join('');

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.4; color: #333;">
      <h1 style="color: #2563eb;">New Onboarding Submission</h1>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
        ${fields}
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        This is an automated notification from the Dynamic Rankers Onboarding Engine.
      </p>
    </div>
  `;
}

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL;
const resendTargetEmail =
  process.env.RESEND_TARGET_EMAIL || process.env.CONTACT_TO_EMAIL;

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

    const data: OnboardingData = req.body;

    // Basic validation
    if (!data.email || !data.orgName) {
      return res.status(400).json({
        error: "Email and Organization Name are required",
      });
    }

    const resend = new Resend(resendApiKey);

    // Send email via Resend
    const result = await resend.emails.send({
      from: resendFromEmail,
      to: [resendTargetEmail],
      subject: `New Onboarding – ${data.orgName}`,
      html: OnboardingEmailTemplate(data),
    });

    if (result.error) {
        return res.status(500).json({ error: result.error.message });
    }

    return res.status(200).json({
      success: true,
      id: result.data?.id,
    });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return res.status(500).json({
      error: "Failed to process onboarding data",
    });
  }
}

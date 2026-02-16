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
  communicationChannel: string;
  appointmentType?: string;
}

function escapeHtml(value: string | number | null | undefined) {
  const str = typeof value !== 'string' ? String(value || '') : value;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function OnboardingEmailTemplate(data: OnboardingData) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Onboarding Submission</h1>
      </div>

      <div style="padding: 32px; background-color: #ffffff;">

        <!-- Section: Appointment -->
        <div style="margin-bottom: 32px; padding: 16px; background-color: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 4px;">
          <h2 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6d28d9;">Confirmed Appointment</h2>
          <p style="margin: 8px 0 0; font-size: 18px; font-weight: bold; color: #1e1b4b;">
            ${escapeHtml(data.appointmentType || 'ERIC WILLIAM | 30-Minute Strategy')}
          </p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #5b21b6;">Booked via Google Calendar Appointment Scheduling</p>
        </div>

        <!-- Section: Client Info -->
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; color: #374151;">Client Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Organization</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.orgName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Industry</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.industry)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Location</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.location)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Contact Person</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.role)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email</td>
              <td style="padding: 8px 0; font-weight: 500;"><a href="mailto:${escapeHtml(data.email)}" style="color: #4f46e5; text-decoration: none;">${escapeHtml(data.email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Phone / WhatsApp</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.phone)}</td>
            </tr>
          </table>
        </div>

        <!-- Section: Strategic Intent -->
        <div style="margin-bottom: 8px;">
          <h2 style="font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; color: #374151;">Strategic Intent</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Primary Objective</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.primaryIntent)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Refinement</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.refinement)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Preferred Channel</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.communicationChannel)}</td>
            </tr>
          </table>
        </div>

      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This is an automated notification from the Dynamic Rankers Onboarding Engine.
        </p>
      </div>
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

    const data = await request.json() as OnboardingData;

    if (!data.email || !data.orgName) {
      return new Response(JSON.stringify({ error: "Email and Organization Name are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: resendFromEmail,
      to: [resendTargetEmail],
      subject: `Onboarding & Strategy Call: ${data.orgName}`,
      html: OnboardingEmailTemplate(data),
    });

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error.message }), {
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
  } catch (error) {
    console.error("Onboarding API error:", error);
    return new Response(JSON.stringify({ error: "Failed to process onboarding data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { ContactEmailTemplate } from "../../src/components/ContactEmailTemplate";

// Safety: ensure API key exists
const resend = new Resend(process.env.RESEND_API_KEY || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email, and message are required",
      });
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      to: [process.env.RESEND_TARGET_EMAIL as string],
      subject: `New Contact Form Submission – ${name}`,
      react: ContactEmailTemplate({
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

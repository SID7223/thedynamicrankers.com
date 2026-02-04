import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { ContactEmailTemplate } from '../../components/ContactEmailTemplate';

// Initialise the Resend client using the API key from environment variables.
const resend = new Resend(process.env.RESEND_API_KEY || '');

/**
 * API route handler for processing contact form submissions.
 *
 * This endpoint expects a POST request with JSON or form‑encoded data
 * containing `name`, `email`, `phone`, and `message` fields.  It
 * constructs an email using a React template and sends it via Resend.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract form data from the request body.  Next.js automatically
  // parses JSON and urlencoded bodies for API routes.  If you’re
  // expecting multipart/form-data, you’ll need additional parsing.
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    // Use the React email template to build the email body.
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || '',
      to: process.env.RESEND_TARGET_EMAIL
        ? [process.env.RESEND_TARGET_EMAIL]
        : [],
      subject: `New call booking from ${name}`,
      react: ContactEmailTemplate({ name, email, phone, message }),
    });

    if (error) {
      // Forward the error to the client.  In production you might want
      // to log this error instead of exposing it directly.
      return res.status(500).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unexpected error' });
  }
}

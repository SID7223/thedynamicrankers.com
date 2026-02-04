import * as React from 'react';

/**
 * A simple React-based email template for contact form submissions.
 *
 * This template renders the details provided in the contact form
 * and can be passed directly to Resend’s `react` option when
 * sending an email.  You can adjust the markup or styling
 * (e.g., inline CSS) as needed to match your brand.
 */
interface EmailTemplateProps {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export function ContactEmailTemplate({
  name,
  email,
  phone,
  message,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.4' }}>
      <h1>New call booking from {name}</h1>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      {phone ? (
        <p>
          <strong>Phone:</strong> {phone}
        </p>
      ) : null}
      {message ? (
        <div>
          <p>
            <strong>Message:</strong>
          </p>
          <p>{message}</p>
        </div>
      ) : null}
    </div>
  );
}

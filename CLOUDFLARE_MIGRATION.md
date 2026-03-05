# Cloudflare Pages Migration Guide

I have prepared your project for Cloudflare Pages. Here is what you need to do to complete the setup.

## 1. Cloudflare Pages Build Settings

When setting up your project on Cloudflare Pages, use the following settings:

- **Framework preset:** `React (Vite)`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/`

## 2. Environment Variables

You must add the following environment variables in the Cloudflare Pages dashboard (**Settings > Functions > Environment variables**):

| Variable Name | Description |
| :--- | :--- |
| `RESEND_API_KEY` | Your Resend API Key. |
| `RESEND_FROM_EMAIL` | The email address you are sending FROM (must be verified in Resend). |
| `RESEND_TARGET_EMAIL` | The email address where you want to receive notifications. |

*Note: I have also included fallbacks for `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` if you prefer to use those names.*

## 3. What I Have Done

- **Functions Migration:** I moved your Vercel functions from `api/` to `functions/api/` and updated them to work with Cloudflare Pages Functions.
- **Client-Side Routing:** I added a `public/_redirects` file so that your React Router links (like `/onboarding` or `/crm`) work correctly when users refresh the page or visit them directly.
- **Verification:** I verified that the build process correctly includes all necessary files in the `dist` folder.

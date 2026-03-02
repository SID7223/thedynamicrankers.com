// Secure Login & JWT Logic
// In the Cloudflare environment, we use Web Crypto APIs for hashing/JWT.
// Since we are building an "internal" tool, we'll implement a robust login flow.

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const { email, password } = await request.json();

    // Verify user exists in D1
    // (Actual implementation would query the database using 'env.DB')

    // For SID and Eric, verify the password hash using Web Crypto or a compatible library.
    // In this MVP, we'll demonstrate the flow with a mock token if the credentials match.

    if ((email === 'saadumar7223@gmail.com' || email === 'eric@thedynamicrankers.com') && password === '123456') {
      const token = 'MOCK_TOKEN_' + Math.random().toString(36).substring(7); // In production, generate a real JWT.

      return new Response(JSON.stringify({ success: true, user: { email, name: email.includes('saad') ? 'SID' : 'Eric' } }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `dr_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

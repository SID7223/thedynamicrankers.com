export const onRequestPost = async (context: any) => {
  const { request } = context;

  try {
    const body = await request.json() as any;
    const email = body.email;
    const password = body.password;

    if ((email === 'saadumar7223@gmail.com' || email === 'eric@thedynamicrankers.com') && password === '123456') {
      const token = 'MOCK_TOKEN_' + Math.random().toString(36).substring(7);

      return new Response(JSON.stringify({
        success: true,
        user: { email, name: email.includes('saad') ? 'SID' : 'Eric' }
      }), {
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

export const onRequestPost = async (context: { request: Request }) => {
  const { request } = context;

  try {
    await request.json();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
      console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

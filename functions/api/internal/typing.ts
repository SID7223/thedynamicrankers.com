export const onRequestPost = async (context: { request: Request }) => {
  const { request } = context;

  try {
    await request.json();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    // If typing indicator fails (e.g. malformed body), don't crash the dashboard
    console.error('Typing API error:', err);
    return new Response(JSON.stringify({ success: false, error: 'SILENT_FAIL' }), {
      status: 200, // Return 200 to keep the client happy
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Simple endpoint to broadcast typing events via SSE
export const onRequestPost = async (context: any) => {
  // Broadcaster for typing status - usually piped to SSE
  return new Response(JSON.stringify({ success: true }));
};

export const onRequestPost = async () => {
  return new Response(JSON.stringify({ status: 'online' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

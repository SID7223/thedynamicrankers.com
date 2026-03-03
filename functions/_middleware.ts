export const onRequest = async (context: { request: Request; next: () => Promise<Response> }) => {
  const { request, next } = context;
  const url = new URL(request.url);

  const response = await next();

  if (url.pathname.startsWith('/internal/') || url.pathname.startsWith('/api/internal/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
};

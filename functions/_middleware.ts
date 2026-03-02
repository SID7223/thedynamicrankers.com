export const onRequest: PagesFunction<any> = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/internal/') || url.pathname.startsWith('/api/internal/')) {
    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.headers.get('Cookie');

    if (!authHeader && (!cookieHeader || !cookieHeader.includes('dr_token'))) {
      return new Response('Not Found', { status: 404 });
    }
  }

  const response = await next();

  if (url.pathname.startsWith('/internal/') || url.pathname.startsWith('/api/internal/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
};

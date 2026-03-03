export const onRequest = async (context: { request: Request; next: () => Promise<Response> }) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // Protected paths logic
  if (url.pathname.startsWith('/api/internal/')) {
    // Exclude auth endpoint from protection
    if (url.pathname === '/api/internal/auth') {
        return await next();
    }

    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.headers.get('Cookie');

    // For the prototype/dev, we check for dr_token or session in sessionStorage (handled on client)
    // Here we just ensure we don't block the initial auth
    // In a full implementation, we would verify the JWT/Token
  }

  const response = await next();

  if (url.pathname.startsWith('/internal/') || url.pathname.startsWith('/api/internal/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api')) {
      const apiUrl = `https://klubnacht.tyna.ninja${url.pathname}${url.search}`;
      const response = await fetch(apiUrl, {
        method: request.method,
        headers: request.headers,
      });
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    return new Response('Not Found', { status: 404 });
  },
};
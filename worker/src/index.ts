export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // CORS 対応
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Worker でループしないよう、内部呼び出しは Workers URL を指定
    if (url.pathname.startsWith('/api')) {
      const targetUrl = `https://klubnacht.tyna.ninja${url.pathname}${url.search}`;
      const response = await fetch(targetUrl, { method: request.method });
      const text = await response.text();
      return new Response(text, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

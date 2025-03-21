export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

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

    if (url.pathname.startsWith('/api')) {
      const apiUrl = `https://klubnacht.tyna.ninja${url.pathname}${url.search}`;
      const upstreamResponse = await fetch(apiUrl, {
        method: request.method,
        headers: { 'Accept': 'application/json' },  // 追加
      });

      // JSONとして取得を試みる
      const data = await upstreamResponse.text();
      console.log('Upstream response:', data);

      return new Response(data, {
        status: upstreamResponse.status,
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response('API is running. Use /api/lineup or /api/ranking endpoints.', { status: 200 });
    }

    if (url.pathname === '/api/ranking') {
      const stage = url.searchParams.get('stage') || 'Berghain';
      const start = url.searchParams.get('start') || '2000-01-01';
      const end = url.searchParams.get('end') || '2100-01-01';

      const stmt = env.lineup.prepare(
        `SELECT p.artist_name, COUNT(*) as appearances FROM performances p
        JOIN events e ON p.event_id = e.id
        WHERE p.stage = ? AND e.date BETWEEN ? AND ?
        GROUP BY p.artist_name
        ORDER BY appearances DESC LIMIT 10`
      ).bind(stage, start, end);

      const result = await stmt.all();
      return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/lineup') {
      const date = url.searchParams.get('date');
      if (!date) {
        return new Response('date クエリパラメータを指定してください。例: /api/lineup?date=2025-03-15', { status: 400 });
      }

      const stmt = env.lineup.prepare(
        `SELECT e.title, p.stage, p.artist_name FROM performances p JOIN events e ON p.event_id = e.id WHERE e.date = ?`
      ).bind(date);

      const result = await stmt.all();
      return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Not Found', { status: 404 });
  }
};
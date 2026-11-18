import { createServer } from 'node:http';
import { ADMIN_EMAIL } from '../../shared/constants/auth';

// Google の通信だけを代替する。アプリの OAuth・セッション・認可は実装をそのまま使う。
export async function startGoogleOAuthFixture() {
  const server = createServer(async (request, response) => {
    response.setHeader('content-type', 'application/json');
    if (request.url === '/token' && request.method === 'POST') {
      let body = '';
      for await (const chunk of request) body += String(chunk);
      const params = new URLSearchParams(body);
      response.end(JSON.stringify({ access_token: params.get('code'), token_type: 'Bearer' }));
      return;
    }
    if (request.url === '/user') {
      const role = request.headers.authorization?.replace('Bearer ', '');
      response.end(
        JSON.stringify({
          sub: `sample-${role}`,
          email: role === 'admin' || role === 'unverified' ? ADMIN_EMAIL : 'sample@example.com',
          email_verified: role !== 'unverified',
          name: 'Sample User',
          picture: 'https://example.com/avatar.png',
        }),
      );
      return;
    }
    response.statusCode = 404;
    response.end('{}');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('OAuth 検証用ポートを取得できません。');
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
}

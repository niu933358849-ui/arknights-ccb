const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 8001);
const host = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};
const publicFiles = new Set([
  'index.html',
  'script.js',
  'styles.css',
  'character_table.json',
  'handbook_info_table.json',
  'moegirl_tags.json',
]);

async function proxySiren(pathname, response) {
  const match = pathname.match(/^\/api\/msr\/(songs|albums|song\/([\w-]+))$/);
  if (!match) {
    response.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Unknown music API route' }));
    return;
  }
  const officialPath = match[1] === 'songs'
    ? '/api/songs'
    : match[1] === 'albums'
      ? '/api/albums'
      : `/api/song/${encodeURIComponent(match[2])}`;
  try {
    const upstream = await fetch(`https://monster-siren.hypergryph.com${officialPath}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'access-control-allow-origin': '*',
    });
    response.end(body);
  } catch (error) {
    response.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Monster Siren is temporarily unavailable', message: error.message }));
  }
}

async function proxyOperatorImage(pathname, response) {
  const match = pathname.match(/^\/api\/operator-image\/(portrait|avatar)\/([^/]+)$/);
  if (!match) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Unknown operator image');
    return;
  }
  let operatorId;
  try {
    operatorId = decodeURIComponent(match[2]);
  } catch {
    response.writeHead(400);
    response.end('Bad operator id');
    return;
  }
  if (!/^char_[a-zA-Z0-9_@#-]+$/.test(operatorId)) {
    response.writeHead(400);
    response.end('Bad operator id');
    return;
  }
  try {
    const upstream = await fetch(`https://web.hycdn.cn/arknights/game/assets/char/${match[1]}/${encodeURIComponent(operatorId)}.png`, {
      headers: { accept: 'image/png,image/*;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(15000),
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') || 'image/png',
      'cache-control': upstream.ok ? 'public, max-age=86400, stale-while-revalidate=604800' : 'no-store',
      'x-content-type-options': 'nosniff',
    });
    response.end(body);
  } catch (error) {
    response.writeHead(502, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    response.end(JSON.stringify({ error: 'Official operator image is temporarily unavailable', message: error.message }));
  }
}

http.createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  if (pathname === '/healthz') {
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
    response.end('ok');
    return;
  }
  if (pathname.startsWith('/api/msr/')) {
    await proxySiren(pathname, response);
    return;
  }
  if (pathname.startsWith('/api/operator-image/')) {
    await proxyOperatorImage(pathname, response);
    return;
  }

  let relative;
  try {
    relative = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }
  const file = path.resolve(root, `.${relative}`);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  if (!publicFiles.has(path.basename(file))) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  });
}).listen(port, host, () => {
  console.log(`Arknights CCB server listening on http://${host}:${port}`);
});

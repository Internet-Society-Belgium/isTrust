// Serves the website build (apps/website/dist/website) for the E2E tests.
// `astro preview` would do, but it detaches into a background daemon when it
// detects an AI agent, and Playwright then sees its web server exit.
//
//   node serve.ts <port>
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = path.join(import.meta.dirname, "../website/dist/website");
const port = Number(process.argv[2] ?? "4321");

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
};

if (!existsSync(root)) {
  console.error(
    `No website build in ${root}: run npm run test:e2e from the repo root.`,
  );
  process.exit(1);
}

createServer((request, response) => {
  const pathname = decodeURIComponent(
    new URL(request.url ?? "/", "http://localhost").pathname,
  );
  let file = path.join(root, path.normalize(pathname));
  if (!file.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "content-type": types[path.extname(file)] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} on http://127.0.0.1:${String(port)}`);
});

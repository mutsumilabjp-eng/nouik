import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "pages-dist");
const host = "127.0.0.1";
const port = Number(process.env.STATIC_EXPORT_PORT || 4173);
const baseUrl = `http://${host}:${port}`;
const domain = "nouiki-lab.com";

function articleSlug(file) {
  const id = file.slice(0, 3).toLowerCase().replace("f", "f-");
  return `${id}-${file.replace(/^F\d+_/, "").replace(/\.md$/, "").replaceAll("_", "-")}`;
}

async function routes() {
  const staticSource = await readFile(path.join(root, "app/static-pages.ts"), "utf8");
  const staticPages = [...staticSource.matchAll(/^\s{2}([a-z][\w-]*):\s*\{/gm)].map(
    ([, page]) => `/${page}`,
  );

  const articleSource = await readFile(path.join(root, "app/content-data.ts"), "utf8");
  const articleFiles = [...articleSource.matchAll(/"((F\d+_[^"]+\.md))"/g)].map(([, file]) => file);
  const articles = articleFiles.map((file) => `/articles/${articleSlug(file)}`);

  return ["/", ...staticPages, ...articles, "/robots.txt", "/sitemap.xml"];
}

async function waitForServer(child) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`vinext start exited early with code ${child.exitCode}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Keep waiting until the production server is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Timed out waiting for vinext start");
}

function outputPath(route) {
  if (route === "/") return path.join(outputDir, "index.html");
  if (route.endsWith(".txt") || route.endsWith(".xml")) {
    return path.join(outputDir, route.slice(1));
  }
  return path.join(outputDir, route.slice(1), "index.html");
}

function normalizeHtml(html) {
  return html.replace(/\/_next\/image\?url=([^"&]+)(?:&amp;|&)w=\d+(?:&amp;|&)q=\d+/g, (_match, url) =>
    decodeURIComponent(url),
  );
}

async function exportRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) {
    throw new Error(`Failed to export ${route}: ${response.status}`);
  }

  const target = outputPath(route);
  await mkdir(path.dirname(target), { recursive: true });
  const body = await response.text();
  await writeFile(target, route.endsWith(".html") || !route.includes(".") ? normalizeHtml(body) : body);

  if (!route.includes(".") && route !== "/") {
    await writeFile(path.join(outputDir, `${route.slice(1)}.html`), normalizeHtml(body));
  }
}

async function main() {
  await rm(outputDir, { force: true, recursive: true });
  await mkdir(outputDir, { recursive: true });

  const child = spawn("npm", ["run", "start", "--", "--host", host, "--port", String(port)], {
    cwd: root,
    env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await waitForServer(child);
    await cp(path.join(root, "dist/client"), outputDir, { recursive: true });

    const allRoutes = await routes();
    for (const route of allRoutes) {
      await exportRoute(route);
    }

    await writeFile(path.join(outputDir, "CNAME"), `${domain}\n`);
    await writeFile(path.join(outputDir, ".nojekyll"), "");
    console.log(`Exported ${allRoutes.length} routes to ${outputDir}`);
  } finally {
    child.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const textTargets = [
  ...fs.readdirSync(root).filter((file) => /^F\d+_.*\.md$/.test(file)).map((file) => path.join(root, file)),
  path.join(root, "app"),
  path.join(root, "research"),
];

const banned = ["必ず到達する", "絶対安全", "治ります", "治せます"];
const requiredFiles = [
  "app/page.tsx",
  "app/articles/[slug]/page.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "research/claim_ledger.md",
  "research/gemini_factcheck_summary.md",
  "research/image_attribution.json",
  "public/images/hero-desk.jpg",
  "public/images/notebook-sun.jpg",
  "public/images/study-window.jpg",
  "public/images/blue-pen-note.jpg",
  ".openai/hosting.json",
];

function collectFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(target, entry.name);
    if (entry.isDirectory()) return collectFiles(next);
    return entry.isFile() && /\.(tsx?|md|json|css|mjs)$/.test(entry.name) ? [next] : [];
  });
}

const files = textTargets.flatMap((target) => collectFiles(target));
let failed = false;

function fail(message) {
  console.error(message);
  failed = true;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Missing required file: ${file}`);
}

for (const file of files.filter((item) => !item.includes(`${path.sep}research${path.sep}`) && !item.endsWith(".css"))) {
  const text = fs.readFileSync(file, "utf8");
  for (const phrase of banned) {
    if (text.includes(phrase)) fail(`Banned phrase "${phrase}" found in ${path.relative(root, file)}`);
  }
  if (/F03[^\n]*(href|\/articles\/)/.test(text)) fail(`F03 appears to be linked in ${path.relative(root, file)}`);
}

for (const file of fs.readdirSync(root).filter((name) => /^F\d+_.*\.md$/.test(name))) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const title = text.match(/^title: "([^"]+)"/m)?.[1];
  const description = text.match(/^meta_description: "([^"]+)"/m)?.[1];
  const keyword = text.match(/^target_keyword: "([^"]+)"/m)?.[1];
  if (!title || !description || !keyword) fail(`Missing SEO front matter in ${file}`);
}

const attribution = JSON.parse(fs.readFileSync(path.join(root, "research/image_attribution.json"), "utf8"));
for (const item of attribution) {
  if (String(item.file).endsWith(".svg")) fail(`SVG image attribution not allowed: ${item.file}`);
  if (!fs.existsSync(path.join(root, item.file))) fail(`Attributed image missing: ${item.file}`);
}

if (failed) process.exit(1);
console.log(`Audit passed: ${files.length} source files, ${attribution.length} raster images, ${requiredFiles.length} required artifacts.`);

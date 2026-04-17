// Generates public/sitemap.xml and public/llms.txt from data sources.
// Runs at build time via package.json prebuild script.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const ORIGIN = "https://tcs.mountainaiproject.com";

function extractIds(filePath) {
  const src = readFileSync(resolve(root, filePath), "utf8");
  const ids = [];
  const re = /^\s+id:\s*"([^"]+)"/gm;
  let m;
  while ((m = re.exec(src)) !== null) ids.push(m[1]);
  return ids;
}

function extractEntries(filePath, fields = ["id", "name"]) {
  const src = readFileSync(resolve(root, filePath), "utf8");
  // crude pair extraction: split by id occurrences
  const entries = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) entries.push({ id: m[1], name: m[2] });
  return entries;
}

const productIds = ["ccid", "scp", "bcd", "cno"];
const apiEntries = extractEntries("src/data/apiData.ts");
const integrationEntries = extractEntries("src/data/integrationData.ts");
const webhookEntries = extractEntries("src/data/webhookData.ts");

// Map api endpoints to products (heuristic via category prefix or path)
function productForEndpoint(id) {
  if (id.startsWith("scp-")) return "scp";
  if (id.startsWith("bcd-") || id.includes("image")) return "bcd";
  if (id.startsWith("cno-")) return "cno";
  // shared endpoints: list under all three product API trees
  return null;
}

const today = new Date().toISOString().split("T")[0];

const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/call-auth", priority: "0.9" },
  { loc: "/changelog", priority: "0.6" },
  { loc: "/resources/analytics", priority: "0.7" },
  { loc: "/resources/webhooks", priority: "0.8" },
  { loc: "/resources/webhooks/guide", priority: "0.7" },
  ...productIds.filter(p => p !== "ccid").map(p => ({ loc: `/products/${p}`, priority: "0.9" })),
  ...productIds.filter(p => p !== "ccid").map(p => ({ loc: `/products/${p}/guide`, priority: "0.8" })),
];

// API endpoints under each non-ccid product
for (const product of ["scp", "bcd", "cno"]) {
  for (const ep of apiEntries) {
    urls.push({ loc: `/products/${product}/api/${ep.id}`, priority: "0.7" });
  }
}

for (const ig of integrationEntries) {
  urls.push({ loc: `/integrations/${ig.id}`, priority: "0.6" });
}

for (const wb of webhookEntries) {
  urls.push({ loc: `/resources/webhooks/api/${wb.id}`, priority: "0.6" });
}

// Dedupe
const seen = new Set();
const uniqueUrls = urls.filter(u => {
  if (seen.has(u.loc)) return false;
  seen.add(u.loc);
  return true;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    u => `  <url>
    <loc>${ORIGIN}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);

// llms.txt — markdown-style index optimized for LLM ingestion
const llmsTxt = `# TruContact Developer Documentation

> Developer documentation for TransUnion TruContact Trusted Call Solutions: Call Authentication (CCID), Spam Tag Mitigation (CNO), Branded Call Display (BCD), and Spoofed Call Protection (SCP). Includes REST API reference, webhooks, analytics, and platform integration guides.

## Core

- [Home](${ORIGIN}/): Product overview and entry point
- [Call Authentication (CCID)](${ORIGIN}/call-auth): Required prerequisite for SCP and BCD; verifies caller identity
- [Spoofed Call Protection (SCP)](${ORIGIN}/products/scp): Digitally sign outbound calls to prevent number spoofing
- [Branded Call Display (BCD)](${ORIGIN}/products/bcd): Display brand name, logo, and call reason on recipient handsets
- [Spam Tag Mitigation (CNO)](${ORIGIN}/products/cno): Prevent legitimate calls from being mislabeled as spam

## Setup Guides

- [SCP Setup Guide](${ORIGIN}/products/scp/guide)
- [BCD Setup Guide](${ORIGIN}/products/bcd/guide)
- [CNO Setup Guide](${ORIGIN}/products/cno/guide)
- [Webhook Setup Guide](${ORIGIN}/resources/webhooks/guide): Subscription lifecycle, event reference, and trigger keys

## API Reference

${apiEntries.map(ep => `- [${ep.name}](${ORIGIN}/products/bcd/api/${ep.id})`).join("\n")}

## Webhooks

- [Webhook Overview](${ORIGIN}/resources/webhooks)
${webhookEntries.map(wb => `- [${wb.name}](${ORIGIN}/resources/webhooks/api/${wb.id})`).join("\n")}

## Resources

- [Analytics API](${ORIGIN}/resources/analytics): BCD/SCP performance metrics by telephone number
- [Changelog](${ORIGIN}/changelog)

## Integrations

${integrationEntries.map(ig => `- [${ig.name}](${ORIGIN}/integrations/${ig.id})`).join("\n")}
`;

writeFileSync(resolve(root, "public/llms.txt"), llmsTxt);

console.log(`✓ Generated sitemap.xml (${uniqueUrls.length} URLs)`);
console.log(`✓ Generated llms.txt`);

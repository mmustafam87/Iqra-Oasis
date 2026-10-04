// Downloads the Google Fonts used by the app into www/fonts so the app works fully offline
// and makes no network requests to Google when children use it.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const html = readFileSync("www/index.html", "utf8");
const m = html.match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/);
if (!m) { console.log("No Google Fonts link found – nothing to do."); process.exit(0); }
const cssUrl = m[1].replace(/&amp;/g, "&");
const UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36";
const urls0 = () => /url\(https:/.test(css);
let css = await (await fetch(cssUrl, { headers: { "User-Agent": UA } })).text();
if (!urls0()) { console.error("Font CSS download failed – keeping online fonts."); process.exit(1); }
mkdirSync("www/fonts", { recursive: true });
const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(x => x[1]))];
let i = 0;
for (const u of urls) {
  const name = `f${i++}.woff2`;
  const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
  writeFileSync(`www/fonts/${name}`, buf);
  css = css.split(u).join(name);
}
writeFileSync("www/fonts/fonts.css", css);
let out = html.replace(m[0], 'href="fonts/fonts.css"')
  .replace(/<link[^>]+rel="preconnect"[^>]*>/g, "");
writeFileSync("www/index.html", out);
console.log(`Vendored ${urls.length} font files into www/fonts`);

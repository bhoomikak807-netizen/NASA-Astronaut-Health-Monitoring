// Converts dist/index.html into the body-only form a claude.ai artifact expects (it supplies its own <html>/<head>/<body>).
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const keep = head
  .replace(/<meta charset[^>]*>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "");
const out = `<title>QuantumNav Live</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n${keep.replace(/<title>[^<]*<\/title>/, "")}\n${body}`;
writeFileSync("dist/artifact.html", out);
console.log(`dist/artifact.html written (${(out.length / 1024).toFixed(0)} KB)`);

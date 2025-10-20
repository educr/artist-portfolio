import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

const inputDir = "./public_html";
const outputDir = "./content";

const turndown = new TurndownService();
fs.mkdirSync(outputDir, { recursive: true });

function convertFile(filePath) {
  const html = fs.readFileSync(filePath, "utf-8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const title = doc.querySelector("title")?.textContent || path.basename(filePath);
  const body = doc.querySelector("body")?.innerHTML || "";

  const markdown = turndown.turndown(body);
  const frontmatter = `---\ntitle: "${title}"\n---\n\n`;

  const relativeName = path.basename(filePath, ".html") + ".mdx";
  const outPath = path.join(outputDir, relativeName);

  fs.writeFileSync(outPath, frontmatter + markdown);
  console.log(`Converted: ${filePath} → ${outPath}`);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath);
    else if (entry.endsWith(".html")) convertFile(fullPath);
  }
}

walk(inputDir);

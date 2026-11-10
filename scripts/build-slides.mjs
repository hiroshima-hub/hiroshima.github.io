
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

// リポジトリのルート
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const slidesRoot = path.join(root, "slides");
const assetsDir = path.join(root, "assets", "reveal");
const revealDir = path.join(
  root, "node_modules", "reveal.js", "dist"
);

// 共通ファイルを公開用フォルダへコピー
await fs.mkdir(assetsDir, { recursive: true });

for (const [src, dest] of [
  ["reveal.js", "reveal.js"],
  ["reveal.css", "reveal.css"],
  ["theme/simple.css", "simple.css"]
]) {
  await fs.copyFile(
    path.join(revealDir, src),
    path.join(assetsDir, dest)
  );
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function buildDirectory(dir) {
  const entries = await fs.readdir(dir, {
    withFileTypes: true
  });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await buildDirectory(fullPath);
      continue;
    }

    if (entry.name !== "slides.md") continue;

    const source = (
      await fs.readFile(fullPath, "utf8")
    ).replace(/\r\n?/g, "\n").trim();

    // --- でスライドを区切る
    const sections = source
      .split(/\n---\n/g)
      .filter(s => s.trim())
      .map(s => `<section>\n${marked.parse(s)}\n</section>`)
      .join("\n");

    const title = escapeHtml(
      source.match(/^#\s+(.+)$/m)?.[1] ?? "授業スライド"
    );

    // 深いフォルダからも参照できる相対パス
    const assets = path.relative(dir, assetsDir)
      .split(path.sep).join("/");

    const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="${assets}/reveal.css">
<link rel="stylesheet" href="${assets}/simple.css">
</head>
<body>
<div class="reveal">
  <div class="slides">
    ${sections}
  </div>
</div>

<script src="${assets}/reveal.js"></script>
<script>
Reveal.initialize({
  hash: true,
  controls: true,
  progress: true,
  center: true,
  width: 1280,
  height: 720,
  margin: 0.05,
  transition: "none"
});
</script>
</body>
</html>`;

    const output = path.join(dir, "index.html");

    // 内容が変化したときだけ書き込む
    const oldHtml = await fs.readFile(
      output, "utf8"
    ).catch(() => "");

    if (oldHtml !== html) {
      await fs.writeFile(output, html, "utf8");
      console.log("生成:", output);
    }
  }
}

await buildDirectory(slidesRoot);
console.log("スライド生成完了");

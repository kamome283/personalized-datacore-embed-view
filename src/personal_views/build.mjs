import * as esbuild from "esbuild";
import { readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

const srcDir = "src/personal_views";
const outDir = "personal_views_out";

async function listBuildTargets(srcDir) {
    const files = await readdir(srcDir);
    return files
        .filter((filename) => filename.endsWith(".jsx"))
        .map((filename) => [path.join(srcDir, filename), path.join(outDir, filename)]);
}

const buildTargets = await listBuildTargets(srcDir)

// Obsidian Datacoreのビューの形式はESMではないため、
// 一時ファイルにESMとして出力した後に正規表現を用いて編集したものを最終出力とすることで
// 目的のフォーマットにしている
async function build(entryPoint, outFile) {
    const tmpFile = `${outFile}.tmp`;

    // ESBuildを用いてESMとして一時ファイルにビルド
    await esbuild.build({
        entryPoints: [entryPoint],
        outfile: tmpFile,
        bundle: true,
        minify: false,
        jsx: "preserve",
        format: "esm",
    });

    try {
        // Obsidian Datacore のビューの形式に編集
        let content = await readFile(tmpFile, "utf-8");
        content = content.replace(/function\s+View/, "return function View");
        content = content.replace(/export\s*\{[^}]+};/s, "");
        await writeFile(outFile, content, "utf-8");
    } finally {
        // 一時ファイルの削除
        await unlink(tmpFile);
    }
}

for (const target of buildTargets) {
    await build(...target);
}

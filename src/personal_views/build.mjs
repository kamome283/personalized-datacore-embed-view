import * as esbuild from "esbuild";
import { readFile, writeFile, unlink } from "fs/promises";

const srcDir = "src/personal_views";
const outDir = "personal_views_out";

const buildTargets = [[`${srcDir}/timeline.jsx`, `${outDir}/timeline.jsx`]];

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

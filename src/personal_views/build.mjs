import * as esbuild from "esbuild";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const srcDir = "src/personal_views";
const outDir = "personal_views_out";

async function listBuildTargets(srcDir) {
    const files = await readdir(srcDir);
    return files
        .filter((filename) => filename.endsWith(".jsx"))
        .map((filename) => [path.join(srcDir, filename), path.join(outDir, filename)]);
}

const buildTargets = await listBuildTargets(srcDir);

async function build(entryPoint, outFile) {
    await esbuild.build({
        entryPoints: [entryPoint],
        outfile: outFile,
        bundle: true,
        minify: false,
        jsx: "preserve",
        format: "esm",
    });

    // Datacore views are not ESM modules, so we rewrite the `export` statement
    // to a `return` statement to produce the correct format.
    const content = await readFile(outFile, "utf-8");
    const newContent = content.replace(/export \{/, "return {");
    await writeFile(outFile, newContent);
}

await Promise.all(buildTargets.map((target) => build(...target)));

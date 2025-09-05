import * as esbuild from "esbuild";
import { readdir } from "fs/promises";
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
        format: "iife",
        globalName: "tempModule",
        footer: { js: "return tempModule.View;" },
    });
}

for (const target of buildTargets) {
    await build(...target);
}

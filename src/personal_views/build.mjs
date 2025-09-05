import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["src/personal_views/timeline.jsx"],
    bundle: true,
    minify: false,
    outdir: "personal_views_out",
    jsx: "preserve",
});

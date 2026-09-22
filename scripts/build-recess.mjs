import { build } from 'esbuild';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'recess');
const output = path.join(root, 'public/recess-assets');
// This directory contains only generated Recess assets.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const stylesheet = path.join(source, 'globals.css');
const css = await postcss([tailwind({ base: source })]).process(
  await readFile(stylesheet, 'utf8'), { from: stylesheet },
);
await writeFile(path.join(source, '.generated.css'), css.css);
const result = await build({
  absWorkingDir: root,
  entryPoints: ['recess/main.tsx'],
  outdir: output,
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  entryNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
  publicPath: '/recess-assets',
  loader: { '.woff2': 'file', '.woff': 'file' },
  metafile: true,
  logLevel: 'warning',
});
const files = Object.keys(result.metafile.outputs);
const assetUrl = name => '/recess-assets/' + path.basename(name);
const script = files.find(name => name.endsWith('.js'));
const styles = files.find(name => name.endsWith('.css'));
if (!script || !styles) throw new Error('Recess build is missing its script or stylesheet.');
await copyFile(path.join(source, 'favicon.svg'), path.join(output, 'favicon.svg'));
for (const font of ['@fontsource-variable/dm-sans', '@fontsource/space-mono', '@fontsource/archivo-black']) {
  await copyFile(path.join(root, 'node_modules', font, 'LICENSE'), path.join(output, font.split('/')[1] + '-LICENSE.txt'));
}
await writeFile(path.join(root, 'public/recess.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brain Break | Mr. Rinka</title><meta name="description" content="Quick word games, drawing challenges, and classroom brain breaks by Mr. Rinka.">
<link rel="canonical" href="https://mrrinka.com/recess"><link rel="icon" type="image/svg+xml" href="/recess-assets/favicon.svg">
<link rel="stylesheet" href="${assetUrl(styles)}"><script type="module" src="${assetUrl(script)}"></script>
</head><body><div id="root"></div><noscript>Enable JavaScript to play Brain Break. <a href="/">Return to Mr. Rinka’s class</a>.</noscript></body></html>`);
console.log('Built Recess with locally hosted scripts, styles, fonts, and game banks.');

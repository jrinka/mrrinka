import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
const bundled = await build({ entryPoints: ['scripts/offline-grid.ts'], bundle: true, write: false, format: 'iife', platform: 'browser', target: 'es2020', minify: true, legalComments: 'inline' });
const notices = (await Promise.all(['docx-LICENSE.txt','pdfmake-LICENSE.txt','Roboto-OFL.txt'].map(name => readFile(`public/downloads/licenses/${name}`, 'utf8')))).join('\n\n');
const script = bundled.outputFiles[0].text.replace(/^[ \t]+$/gm, '').replace(/<\/script/gi, '<\\/script');
for (const method of ['tpcastt', 'soapstone']) {
  const template = await readFile(`scripts/templates/${method}-grid.html`, 'utf8');
  await writeFile(`public/downloads/${method}-grid.html`, template.replace('<!-- EXPORT_SCRIPT -->', () => `<script type="text/plain" id="export-licenses">${notices}</script><script>${script}</script>`));
}
console.log('Built self-contained reading grids with PDF, DOCX, TXT and Markdown exports.');

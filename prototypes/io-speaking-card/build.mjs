import {build} from 'esbuild';
import {cp,rm} from 'node:fs/promises';
const root = new URL('./', import.meta.url);
await rm(new URL('dist', root), {recursive:true,force:true});
await cp(new URL('src', root),new URL('dist', root),{recursive:true});
await build({entryPoints:[new URL('export-client.ts',root).pathname],outdir:new URL('dist',root).pathname,entryNames:'export-client',outExtension:{'.js':'.mjs'},bundle:true,splitting:true,format:'esm',platform:'browser',minify:true});

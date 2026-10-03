import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import catalog from '../content/close-analysis.json';
import CloseAnalysis from '../components/close-analysis';
import { closeRequest } from '../lib/close-analysis';
import { closeSourceIds, closeSourceTypes } from '../lib/close-analysis-metadata';
import { closeSources } from '../lib/close-analysis-sources';

test('every catalog source is allowlisted and has explicit display metadata', () => {
 assert.deepEqual(catalog.map(source => source.id).sort(), [...closeSourceIds].sort());
 for (const source of catalog) {
  const id = closeRequest.shape.sourceId.parse(source.id);
  assert.ok(closeSourceTypes[id].trim(), `${source.id} needs a type label`);
 }
 for (const id of ['unlisted', 'toString', '__proto__', '', 'TOURISM']) {
  assert.equal(closeRequest.shape.sourceId.safeParse(id).success, false);
 }
});

test('selector renders canonical labels for every source and preserves A/B/C', () => {
 const sources = closeSources();
 const render = (items: typeof sources) => renderToStaticMarkup(createElement(CloseAnalysis, {
  sources: items, provider: {name: 'Test', disclosure: 'Test provider'}, live: false,
 }));
 const labels = (html: string) => [...html.matchAll(/<span class="mono">([^<]+)<\/span>/g)]
  .map(match => match[1]).filter(label => /^[A-Z] \/ /.test(label));
 assert.deepEqual(labels(render(sources)), ['A / ADVERTISEMENT', 'B / ADVERTORIAL', 'C / MANIFESTO']);
 assert.deepEqual(labels(render(sources)), sources.map((source, i) =>
  `${String.fromCharCode(65 + i)} / ${closeSourceTypes[source.id]}`));
 // A supplied label must be displayed directly, never inferred from the ID.
 assert.deepEqual(labels(render([{...sources[0], typeLabel: 'SYNTHETIC TYPE'}])), ['A / SYNTHETIC TYPE']);
});

test('lightweight request validation does not bundle the transcript catalog', async () => {
 const result = await build({entryPoints: ['lib/close-analysis.ts'], bundle: true,
  write: false, metafile: true, platform: 'browser'});
 assert.equal(Object.keys(result.metafile!.inputs).some(path => path.endsWith('content/close-analysis.json')), false);
});

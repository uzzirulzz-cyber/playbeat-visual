import test from 'node:test';import assert from 'node:assert/strict';import worker from '../worker/index.js';
const ctx={waitUntil(){}};
test('Workers adapter serves static files through ASSETS',async()=>{let path;const r=await worker.fetch(new Request('https://example.test/studio/'),{ASSETS:{fetch:async request=>{path=new URL(request.url).pathname;return new Response('studio')}}},ctx);assert.equal(path,'/studio/');assert.equal(await r.text(),'studio')});
test('Workers adapter routes AI requests to the existing server handler',async()=>{const r=await worker.fetch(new Request('https://example.test/api/ai'),{},ctx);assert.equal(r.status,200);assert.equal((await r.json()).configured,false)});
test('unknown API paths cannot fall through to static HTML',async()=>{const r=await worker.fetch(new Request('https://example.test/api/missing'),{},ctx);assert.equal(r.status,404);assert.equal((await r.json()).error,'API route not found')});

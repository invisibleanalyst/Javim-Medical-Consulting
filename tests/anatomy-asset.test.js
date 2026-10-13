import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('compressed torso retains every selectable system and omits atlas kidney meshes',()=>{
  const bytes=readFileSync(new URL('../public/assets/anatomy/torso.glb',import.meta.url));
  assert.ok(bytes.length<5*1024*1024);
  assert.equal(bytes.toString('ascii',0,4),'glTF');
  const length=bytes.readUInt32LE(12);const json=JSON.parse(bytes.toString('utf8',20,20+length));
  assert.ok(json.extensionsRequired.includes('EXT_meshopt_compression'));
  const systems=new Set(json.nodes.map(n=>n.extras?.system));
  for(const id of ['blood','thyroid','liver','kidneys','metabolic','bones','vessels'])assert.ok(systems.has(id),id);
  const manifest=JSON.parse(readFileSync(new URL('../public/assets/anatomy/torso-manifest.json',import.meta.url)));
  const kidneys=manifest.filter(n=>n.system==='kidneys');assert.equal(kidneys.length,2);
  assert.ok(kidneys.every(n=>n.source.startsWith('Original simplified')));
  assert.ok(!manifest.some(n=>/^Kidney\.[lr]$/.test(n.name)));
});

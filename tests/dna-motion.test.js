import test from 'node:test';
import assert from 'node:assert/strict';
import {fluidAmount,motionPhase,DNA_CYCLE_SECONDS} from '../src/dna-motion.js';
test('DNA rests, dissolves, flows and reforms within a continuous repeating cycle',()=>{
  assert.equal(fluidAmount(0),0);assert.equal(fluidAmount(3.9),0);
  assert.ok(fluidAmount(6)>0 && fluidAmount(6)<1);
  assert.equal(fluidAmount(12),1);
  assert.ok(fluidAmount(19)>0 && fluidAmount(19)<1);
  assert.equal(fluidAmount(22),0);assert.equal(fluidAmount(DNA_CYCLE_SECONDS),0);
  assert.deepEqual([0,6,12,19,23].map(motionPhase),['intact','dissolving','fluid','reforming','intact']);
});
test('phase transitions have no jumps and all particle blend amounts stay bounded',()=>{
  for(const t of [4,9,16,22,24])assert.ok(Math.abs(fluidAmount(t-.0001)-fluidAmount(t+.0001))<.00001);
  for(let t=-48;t<72;t+=.1){assert.ok(fluidAmount(t)>=0 && fluidAmount(t)<=1);assert.ok(Math.abs(fluidAmount(t)-fluidAmount(t+24))<1e-12);}
});

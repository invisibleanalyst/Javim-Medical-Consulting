import test from 'node:test';
import assert from 'node:assert/strict';
import {allTests, departments, systems, matchesTest, safeCalUrl, whatsapp, bookingTypes} from '../src/data.js';
test('catalogue retains all 42 tests across seven groups without duplicate names',()=>{
  assert.equal(departments.length,7);assert.equal(allTests.length,42);
  assert.equal(new Set(allTests.map(t=>t.name)).size,42);
  assert.ok(allTests.every(t=>t.description && t.sample));
});
test('search accepts test aliases and punctuation variations',()=>{
  for(const q of ['CBC','UECs','HbA1c','TSH','TB PCR','H pylori'])assert.ok(allTests.some(t=>matchesTest(t,q)),q);
});
test('every anatomy service link resolves to a real catalogue item',()=>{
  for(const s of systems)for(const name of s.tests)assert.ok(allTests.some(t=>t.name===name),name);
});
test('booking links remain restricted to HTTPS Cal.com destinations',()=>{
  assert.equal(safeCalUrl('javascript:alert(1)'), '');
  assert.equal(safeCalUrl('https://cal.com.example.org/book'), '');
  assert.equal(safeCalUrl('https://cal.com/javim/visit'), 'https://cal.com/javim/visit');
  assert.equal(bookingTypes.length,3);
});
test('WhatsApp uses the confirmed contact number and safely encodes enquiries',()=>{
  const url=new URL(whatsapp('Hello & goodbye?'));
  assert.equal(url.pathname,'/254114793610');assert.equal(url.searchParams.get('text'),'Hello & goodbye?');
});

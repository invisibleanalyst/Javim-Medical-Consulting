import test from 'node:test';
import assert from 'node:assert/strict';
import {allTests} from '../src/data.js';
import {guidanceFor} from '../src/test-guidance.js';
test('every listed test has practical guidance with no operational promises',()=>{
 assert.equal(allTests.length,42);
 for(const entry of allTests){const g=guidanceFor(entry);for(const key of ['before','during','after'])assert.ok(g[key]?.length>35,`${entry.name}: ${key}`);assert.doesNotMatch(Object.values(g).join(' '),/\bKSh\b|results within|all tests.*in.house/i);}
 assert.match(guidanceFor(allTests.find(t=>t.name==='H. pylori Test')).before,/method/);
 assert.match(guidanceFor(allTests.find(t=>t.name==='Histology')).during,/does not mean a biopsy procedure is provided/);
});

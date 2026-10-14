import {test,expect} from '@playwright/test';
test('transparent blood cell scene pauses, resumes and leaves the catalogue usable',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/services');
 const scene=page.locator('#blood-scene');await expect(scene).toHaveAttribute('data-status','ready',{timeout:30000});await expect(scene).toHaveAttribute('data-cell-count','8');await expect(scene).toHaveAttribute('data-grain-count','69000');
 const toggle=page.getByRole('button',{name:'Play blood cell animation'});await expect(toggle).toBeVisible();
 expect(await scene.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2');return gl.getContextAttributes().alpha&&gl.getParameter(gl.COLOR_CLEAR_VALUE)[3]===0;})).toBe(true);
 const time=await scene.getAttribute('data-time');await page.waitForTimeout(200);await expect(scene).toHaveAttribute('data-time',time);
 await toggle.click();await expect.poll(async()=>Number(await scene.getAttribute('data-time'))).toBeGreaterThan(.05);await page.getByRole('button',{name:'Pause blood cell animation'}).click();
 await page.locator('#test-search').fill('cbc');await expect(page.locator('.test-row h3')).toHaveText('Full Hemogram');expect(errors).toEqual([]);
});
test('mobile cells keep search and heading available and use fewer meshes',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/services');await expect(page.locator('#blood-scene')).toHaveAttribute('data-cell-count','5',{timeout:30000});await expect(page.locator('#blood-scene')).toHaveAttribute('data-grain-count','26000');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#test-search').fill('thyroid');await expect(page.locator('.test-row h3')).toHaveText('Thyroid Function Tests');
});
test('catalogue retains a static blood cell illustration without WebGL',async({page})=>{
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};});await page.goto('/services');await expect(page.locator('#blood-scene')).toHaveAttribute('data-status','fallback');await expect(page.locator('.blood-fallback')).toBeVisible();await expect(page.locator('#blood-motion-toggle')).toBeHidden();await page.locator('#test-search').fill('cbc');await expect(page.locator('.test-row h3')).toHaveText('Full Hemogram');
});

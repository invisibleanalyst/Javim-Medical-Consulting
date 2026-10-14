import {test,expect} from '@playwright/test';
test('scenes autoplay in view, stop outside it and respect reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(const [path,id] of [['/','#medical-scene'],['/services','#blood-scene']]){
  await page.goto(path);const scene=page.locator(id);await scene.scrollIntoViewIfNeeded();await expect(scene).toHaveAttribute('data-paused','false');await expect.poll(async()=>Number(await scene.getAttribute('data-time'))).toBeGreaterThan(.05);
  await expect(page.locator('#motion-toggle,#blood-motion-toggle')).toHaveCount(0);
  await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);const stopped=await scene.getAttribute('data-time');await page.waitForTimeout(250);await expect(scene).toHaveAttribute('data-time',stopped);
  await scene.scrollIntoViewIfNeeded();await expect.poll(async()=>Number(await scene.getAttribute('data-time'))).toBeGreaterThan(Number(stopped));
  await page.emulateMedia({reducedMotion:'reduce'});await expect(scene).toHaveAttribute('data-paused','true');await scene.focus();await page.keyboard.press('Space');await expect(scene).toHaveAttribute('data-paused','false');await page.keyboard.press('Space');await expect(scene).toHaveAttribute('data-paused','true');
  await page.emulateMedia({reducedMotion:'no-preference'});
 }
});

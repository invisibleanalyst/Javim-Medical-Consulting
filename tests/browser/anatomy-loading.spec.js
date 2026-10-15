import {test,expect} from '@playwright/test';
test('detailed torso poster remains visible during delayed loading and is replaced only after rendering',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/assets/anatomy/torso.glb',async route=>{await gate;await route.continue();});await page.goto('/');await page.locator('.explorer-disclosure>summary').click();const scene=page.locator('#anatomy-scene');await scene.scrollIntoViewIfNeeded();
 const poster=scene.locator('.anatomy-fallback');await expect(poster).toBeVisible();await expect(poster.locator('svg')).toHaveCount(0);await expect(poster.locator('img')).toHaveJSProperty('complete',true);expect(await poster.locator('img').evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);await expect(scene).toHaveAttribute('aria-busy','true');
 release();await expect(scene).toHaveAttribute('data-status','ready',{timeout:30000});await expect(scene.locator('canvas')).toBeVisible();await expect(poster).toBeHidden();await expect(scene).toHaveAttribute('aria-busy','false');
 await page.reload();await page.locator('.explorer-disclosure>summary').click();await scene.scrollIntoViewIfNeeded();await expect(scene).toHaveAttribute('data-status','ready',{timeout:30000});await expect(poster.locator('svg')).toHaveCount(0);
});
test('mobile missing model retains a detailed responsive poster and functional test tabs',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.route('**/assets/anatomy/torso.glb',r=>r.abort());await page.goto('/');await page.locator('.explorer-disclosure>summary').click();const scene=page.locator('#anatomy-scene');await expect(scene).toHaveAttribute('data-status','fallback');await expect(scene.locator('.anatomy-fallback')).toBeVisible();await expect(scene.locator('img')).toHaveJSProperty('complete',true);expect(await scene.locator('img').evaluate(i=>i.currentSrc)).toContain('torso-poster-mobile.webp');await page.locator('[data-system="thyroid"]').click();await expect(page.locator('#system-info h3')).toHaveText('Thyroid');
});

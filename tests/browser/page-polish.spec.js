import {test,expect} from '@playwright/test';
test('catalogue departments remain exclusive before and after a search',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/services');const rows=page.locator('.department');
 await rows.nth(0).locator(':scope>summary').click();await rows.nth(1).locator(':scope>summary').click();await expect(page.locator('.department[open]')).toHaveCount(1);await expect(rows.nth(0)).not.toHaveAttribute('open','');
 await page.locator('#test-search').fill('blood');expect(await rows.count()).toBeGreaterThan(1);await expect(page.locator('.department[open]')).toHaveCount(1);
 await rows.last().locator(':scope>summary').click();await expect(page.locator('.department[open]')).toHaveCount(1);
});
test('delayed DNA module shows no substitute drawing before the first real frame',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});let release;const gate=new Promise(resolve=>release=resolve);
 await page.route(/\/assets\/scene-[^/]+\.js/,async route=>{await gate;await route.continue();});
 await page.goto('/',{waitUntil:'domcontentloaded'});const scene=page.locator('#medical-scene');await expect(scene).toHaveAttribute('aria-busy','true');await expect(scene.locator('.scene-fallback')).toBeHidden();await expect(scene.locator('.scene-fallback svg')).toHaveCount(0);
 release();await expect(scene).toHaveAttribute('data-rendered','true',{timeout:30000});await expect(scene).toHaveAttribute('aria-busy','false');await expect(scene.locator('canvas')).toBeVisible();
});
test('scroll reveals enhance content and reduced motion avoids entrance animations',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');const card=page.locator('.service-card').first();await card.scrollIntoViewIfNeeded();await expect(card).toHaveAttribute('data-revealed','true');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await expect(page.locator('#medical-scene')).toHaveAttribute('data-rendered','true',{timeout:30000});expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);await expect(page.getByRole('button',{name:'Make an appointment'})).toBeVisible();
});

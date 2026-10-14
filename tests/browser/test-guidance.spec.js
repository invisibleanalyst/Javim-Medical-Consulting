import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('test guidance supports hover, pinning, keyboard dismissal and filtered results',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/services?q=cbc');
 let guide=page.locator('.test-guide');await guide.locator('summary').hover();await expect(guide).toHaveAttribute('open','');await expect(guide).toContainText('Fasting is generally not needed');
 await guide.locator('.test-guide-card').hover();await expect(guide).toHaveAttribute('open','');
 await guide.locator('summary').click();await page.locator('#test-search').hover();await expect(guide).toHaveAttribute('open','');
 const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await guide.locator('summary').focus();await page.keyboard.press('Escape');await expect(guide).not.toHaveAttribute('open','');
 await page.locator('#test-search').fill('h pylori');guide=page.locator('.test-guide');await guide.locator('summary').focus();await expect(guide).toHaveAttribute('open','');await expect(guide).toContainText('Confirm the method');
 await expect(guide.getByRole('link',{name:'Ask about this test'})).toHaveAttribute('href',/H.%20pylori%20Test/);
 await page.getByRole('button',{name:'Clear search'}).click();await page.getByRole('button',{name:'Clinical Chemistry',exact:true}).click();
 await expect(page.locator('.test-guide')).toHaveCount(4);await page.locator('.test-guide').first().locator('summary').click();await expect(page.locator('.test-guide[open]')).toHaveCount(1);
});
test('mobile guidance expands by tap, closes and retains readable bounds',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/services?q=pap');
 const guide=page.locator('.test-guide');await guide.locator('summary').click();await expect(guide).toHaveAttribute('open','');await expect(guide).toContainText('speculum');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await guide.locator('summary').click();await expect(guide).not.toHaveAttribute('open','');
});

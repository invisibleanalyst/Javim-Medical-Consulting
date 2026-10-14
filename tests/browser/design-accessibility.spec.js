import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('design supports larger text, keyboard access and narrow layouts',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const text=page.locator('#text-size-toggle');await text.focus();await page.keyboard.press('Enter');await expect(text).toHaveAttribute('aria-pressed','true');await expect(page.locator('html')).toHaveClass(/large-text/);
 await page.reload();await expect(page.locator('#text-size-toggle')).toHaveAttribute('aria-pressed','true');await page.locator('#text-size-toggle').click();
 await expect(page.getByRole('link',{name:'Call 0114 793 610'})).toHaveAttribute('href','tel:+254114793610');
 for(const width of [720,390,320]){await page.setViewportSize({width,height:1000});for(const path of ['/','/services','/privacy']){await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} at ${width}`).toBe(true);}}
});
test('design pages and test guidance pass automated accessibility checks',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1100});
 for(const path of ['/','/services?q=cbc','/privacy']){await page.goto(path);if(path.includes('cbc'))await page.locator('.test-guide summary').click();const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),path).toEqual([]);}
});

import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('service index changes image and opens the matching details',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('[data-atlas]')).toHaveCount(7);
 for(const id of ['chemistry','immunoassays','histology']){await page.locator(`[data-atlas="${id}"]`).click();await expect(page.locator('#atlas-image')).toHaveAttribute('src',`/assets/services/${id}.webp`);await expect(page.locator('#atlas-details')).toHaveAttribute('data-service',id);}
 await page.locator('#atlas-details').click();await expect(page.locator('#service-drawer')).toBeVisible();await expect(page.locator('#service-drawer-title')).toHaveText('Histology & Cytology');await page.keyboard.press('Escape');await expect(page.locator('#atlas-details')).toBeFocused();
 await page.getByLabel('Find a test by name or keyword').fill('CBC');await page.getByRole('button',{name:'Search tests',exact:true}).click();await expect(page.locator('.test-row h3')).toHaveText('Full Hemogram');
});
test('Design 02 supports enlarged text and narrow viewports',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1440,720,390,320]){await page.setViewportSize({width,height:1000});for(const path of ['/','/services?q=cbc','/privacy']){await page.goto(path);await page.locator('#text-size-toggle').evaluate(b=>{if(b.getAttribute('aria-pressed')==='false')b.click();});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} at ${width}`).toBe(true);}}
});
test('Design 02 pages and open service panel pass accessibility scans',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1100});
 for(const path of ['/','/services?q=cbc','/privacy']){await page.goto(path);if(path.includes('cbc'))await page.locator('.test-guide summary').click();const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),path).toEqual([]);}
 await page.goto('/');await page.locator('#atlas-details').click();const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

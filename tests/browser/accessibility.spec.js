import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('essential pages and expanded interactive content pass automated accessibility checks',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const path of ['/','/services','/privacy']){
    await page.goto(path);
    if(path==='/'){
      await expect(page.locator('#medical-scene canvas')).toBeVisible({timeout:20000});
      await page.locator('.explorer-disclosure>summary').click();
    }
    if(path==='/services')await page.locator('#test-search').fill('thyroid');
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
  await page.goto('/');await page.getByRole('button',{name:'Book a visit'}).click();
  const modalScan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(modalScan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

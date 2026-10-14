import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('service side sheet preserves the grid and supports switching, dismissal and catalogue links',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const cards=page.locator('.service-card');const drawer=page.getByRole('dialog',{name:'Haematology',exact:true});
 await expect(cards).toHaveCount(7);
 for(const image of await cards.locator('img').all()){await image.scrollIntoViewIfNeeded();await expect(image).toHaveJSProperty('complete',true);expect(await image.evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);}
 const dimensions=()=>cards.evaluateAll(nodes=>nodes.map(n=>({width:n.offsetWidth,height:n.offsetHeight,top:n.offsetTop,left:n.offsetLeft})));
 const before=await dimensions();const columns=await page.locator('.service-card-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);expect(before[0].top).toBe(before[columns-1].top);expect(before[6].left).toBeGreaterThan(before[0].left);
 const first=cards.first().getByRole('button');await first.click();await expect(drawer).toBeVisible();
 await expect(page.getByRole('button',{name:'Close service details'})).toBeFocused();
 expect(await dimensions()).toEqual(before);
 expect(await drawer.evaluate(d=>getComputedStyle(d).animationName)).toBe('none');
 const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.getByLabel('Choose a category').selectOption('immunoassays');
 const sheet=page.locator('#service-drawer');await expect(sheet.getByRole('heading',{level:2})).toHaveText('Immunoassays & Hormones');await expect(sheet.locator('li')).toHaveCount(3);
 await expect(page.locator('[data-service="immunoassays"]')).toHaveAttribute('aria-expanded','true');await expect(first).toHaveAttribute('aria-expanded','false');
 await page.keyboard.press('Escape');await expect(sheet).not.toBeVisible();await expect(first).toBeFocused();
 await first.click();await page.mouse.click(10,10);await expect(sheet).not.toBeVisible();
 await cards.nth(2).getByRole('button').focus();await page.keyboard.press('Enter');await expect(sheet).toBeVisible();
 await sheet.getByRole('link',{name:'View all 18 tests'}).click();await expect(page).toHaveURL(/category=immunoassays/);await expect(page.locator('.test-row')).toHaveCount(18);
});
test('mobile sheet fills viewport, closes and restores scrolling',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const opener=page.locator('.service-card').last().getByRole('button');await opener.click();
 const sheet=page.locator('#service-drawer');await expect(sheet).toBeVisible();await expect(sheet.locator('li')).toHaveCount(2);
 const bounds=await sheet.boundingBox();expect(bounds.x).toBe(0);expect(bounds.width).toBe(390);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await sheet.getByRole('button',{name:'Close service details'}).click();await expect(sheet).not.toBeVisible();await expect(opener).toBeFocused();await expect(page.locator('body')).not.toHaveClass(/service-drawer-open/);
 await opener.click();await sheet.getByRole('link',{name:'Explore this category'}).click();await expect(page.locator('.test-row')).toHaveCount(2);
});

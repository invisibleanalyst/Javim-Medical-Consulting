import {test,expect} from '@playwright/test';
test('category selection supports keyboard and preserves panel dismissal and catalogue navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const category=page.locator('[data-atlas="immunoassays"]');await category.focus();await page.keyboard.press('Enter');await expect(category).toHaveAttribute('aria-pressed','true');await expect(page.locator('#atlas-title')).toHaveText('Immunoassays & Hormones');
 const opener=page.locator('#atlas-details');await opener.click();const sheet=page.locator('#service-drawer');await expect(sheet).toBeVisible();await expect(sheet.locator('li')).toHaveCount(3);
 await page.keyboard.press('Escape');await expect(sheet).not.toBeVisible();await expect(opener).toBeFocused();
 await opener.click();await page.mouse.click(10,10);await expect(sheet).not.toBeVisible();await opener.click();await sheet.getByRole('link',{name:'View all 18 tests'}).click();await expect(page.locator('.test-row')).toHaveCount(18);
});
test('mobile index selects a category and shows its matching full-width details',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('[data-atlas="histology"]').click();await expect(page.locator('#atlas-title')).toHaveText('Histology & Cytology');await page.locator('#atlas-details').click();const sheet=page.locator('#service-drawer');await expect(sheet.locator('li')).toHaveCount(2);expect((await sheet.boundingBox()).width).toBe(390);await sheet.getByRole('button',{name:'Close service details'}).click();await expect(sheet).not.toBeVisible();await expect(page.locator('body')).not.toHaveClass(/service-drawer-open/);
});

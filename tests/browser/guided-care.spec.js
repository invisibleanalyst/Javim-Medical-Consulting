import {test,expect} from '@playwright/test';
test('guided homepage search and clear starting choices work',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.getByRole('heading',{name:'How can we help you today?'})).toBeVisible();await expect(page.locator('.quick-start-card')).toHaveCount(3);
 await page.getByLabel('Know the name of your test?').fill('CBC');await page.getByRole('button',{name:'Find a test',exact:true}).click();await expect(page).toHaveURL(/services\?q=CBC/);await expect(page.locator('.test-row h3')).toHaveText('Full Hemogram');
 await page.goto('/');await page.getByRole('button',{name:/Arrange a visit/}).click();await expect(page.locator('#booking-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('link',{name:/Talk to our team/})).toHaveAttribute('href','tel:+254114793610');
 await page.getByRole('link',{name:/Explore our tests/}).click();await expect(page).toHaveURL(/#services/);await page.locator('.service-card').first().getByRole('button').click();await expect(page.locator('#service-drawer')).toBeVisible();await expect(page.locator('#service-drawer').getByRole('heading',{level:2})).toHaveText('Haematology');
});

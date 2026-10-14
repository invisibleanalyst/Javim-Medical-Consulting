import {test,expect} from '@playwright/test';
test('gallery homepage search, booking and service discovery work',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.getByRole('heading',{name:'For the person behind the sample.'})).toBeVisible();await expect(page.locator('.service-card')).toHaveCount(7);
 await page.getByLabel('Which test are you looking for?').fill('CBC');await page.getByRole('button',{name:'Find a test',exact:true}).click();await expect(page).toHaveURL(/services\?q=CBC/);await expect(page.locator('.test-row h3')).toHaveText('Full Hemogram');
 await page.goto('/');await page.getByRole('button',{name:'Arrange your visit'}).click();await expect(page.locator('#booking-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('link',{name:'Message on WhatsApp'})).toHaveAttribute('href',/^https:\/\/wa.me\/254114793610/);
 await page.getByRole('link',{name:'Explore our tests'}).click();await expect(page).toHaveURL(/#services/);await page.locator('.service-card').first().getByRole('button').click();await expect(page.locator('#service-drawer')).toBeVisible();await expect(page.locator('#service-drawer').getByRole('heading',{level:2})).toHaveText('Haematology');
});

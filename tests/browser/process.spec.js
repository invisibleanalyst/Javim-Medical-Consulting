import {test,expect} from '@playwright/test';
test('process steps change images, disclose referral guidance and provide working actions',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const process=page.locator('.process-section');
 await expect(process.getByRole('tabpanel')).toHaveCount(1);
 await expect(process.getByRole('tabpanel')).toContainText('external laboratory');
 await expect(process.locator('img:visible')).toHaveAttribute('data-process-image','enquire');
 await expect(process.getByRole('link')).toHaveAttribute('href',/^https:\/\/wa.me\/254114793610\?/);
 await process.getByRole('tab',{name:'02 Arrange your sample'}).click();
 await expect(process.locator('img:visible')).toHaveAttribute('data-process-image','sample');
 await process.getByRole('button',{name:'Arrange an appointment'}).click();await expect(page.locator('#booking-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await process.getByRole('tab',{name:'02 Arrange your sample'}).focus();await page.keyboard.press('ArrowRight');
 await expect(process.getByRole('tab',{name:'03 Testing & results'})).toBeFocused();
 await expect(process.locator('img:visible')).toHaveAttribute('data-process-image','results');
 await expect(process.getByRole('tabpanel')).toContainText('Discuss the results with your clinician');
 await expect(process.getByRole('link')).toHaveAttribute('href',/expected%20results%20timing/);
 for(const tab of await process.getByRole('tab').all()){await tab.click();const img=process.locator('img:visible');await expect(img).toHaveJSProperty('complete',true);expect(await img.evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);}
 await page.setViewportSize({width:390,height:844});await expect(process.getByRole('tab')).toHaveCount(3);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

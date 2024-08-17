import { expect } from '@playwright/test';
import test from '@lib/BaseTest';

test('Verify admin can add new recruitment', { tag: '@smoke' }, async ({ page, loginPage, homePage, recruitmentPage }) => {

    await loginPage.login();

    const randomLastName = recruitmentPage.getRandomLastName();
    console.log('Generated Last Name:', randomLastName);

    await homePage.openRecrutment();
    await recruitmentPage.addCandidate('Harry', randomLastName, "test@gmail.com");

    await page.waitForTimeout(2000);
    const successMessageLocator = await page.locator('text=Successfully Saved');
    await expect(successMessageLocator).toBeVisible();

    // Verify remove Candidate
    await recruitmentPage.candidateList();
    await recruitmentPage.removeCandidate("Harry aaab");
    await page.waitForTimeout(2000);
    const deleteMessage = await page.locator('text=Successfully Deleted');
    await expect(deleteMessage).toBeVisible();

});

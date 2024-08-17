import { expect } from '@playwright/test';
import test from '@lib/BaseTest';

test('Verify admin can add new employees', { tag: '@smoke' }, async ({page, loginPage, pimPage }) => {
  //Login
  await loginPage.login();
  //Add new employee
  await pimPage.addEmployee();
  //Assert employee added successfully
  const successMessageLocator = page.locator('text=Successfully Saved');
  await expect(successMessageLocator).toBeVisible();  
});

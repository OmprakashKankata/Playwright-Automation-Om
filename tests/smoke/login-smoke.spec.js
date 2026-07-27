const { test, expect } = require('@playwright/test');
require('dotenv').config();

const { HomePage } = require('../../pages/HomePage');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('smoke', () => {
  test('@smoke opens the site and logs in', async ({ page }) => {
    const email = process.env.AMAZON_EMAIL;
    const password = process.env.AMAZON_PASSWORD;

    test.skip(!email || !password, 'Set AMAZON_EMAIL and AMAZON_PASSWORD in GitHub Secrets or your local .env file');

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await test.step('Open Amazon homepage', async () => {
      await homePage.navigate();
      await homePage.verifyTitle();
    });

    await test.step('Go to sign-in and log in', async () => {
      await homePage.clickSignIn();
      await loginPage.verifySignInPage();
      await loginPage.login(email, password);
    });

    await test.step('Confirm the user is signed in', async () => {
      await expect(page.locator('#nav-link-accountList')).toBeVisible({ timeout: 30000 });
    });
  });
});

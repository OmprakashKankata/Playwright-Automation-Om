const { test } = require('@playwright/test');
require('dotenv').config();

const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { GiftCardPage } = require('../pages/GiftCardPage');

test('Amazon: Sign in → Gift Cards → Wallet Balance', async ({ page }) => {
  // Skip if no credentials configured
  const email = process.env.AMAZON_EMAIL;
  const password = process.env.AMAZON_PASSWORD;
  test.skip(!email || !password,
    'Set AMAZON_EMAIL & AMAZON_PASSWORD in .env or GitHub Secrets');

  // Initialize page objects
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const giftCardPage = new GiftCardPage(page);

  // Step 1: Navigate to Amazon
  await homePage.navigate();
  await homePage.verifyTitle();
  


  // Step 2: Login
  await homePage.clickSignIn();
  await loginPage.verifySignInPage();
  await loginPage.login(email, password);

  // Step 3: Go to Gift Cards & verify balance
  await homePage.goToGiftCards();
  await giftCardPage.clickAddGiftCard();
  await giftCardPage.verifyWalletBalance();

  // Now click on fresh menu and verify that the hover action was successful
  await homePage.hoverOnFreshMenu();
  console.log('Hovered on Fresh menu successfully');
  
  console.log('Test completed successfully!');
});

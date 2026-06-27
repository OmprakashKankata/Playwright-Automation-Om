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

  // Step 4: Go back to homepage before interacting with homepage elements
  await homePage.clickAmazonLogo();
  console.log('Back to homepage');

  // Step 5: Hover on Fresh menu
  await homePage.hoverOnFreshMenu();

  // Step 6: Search for laptops and verify results
  await homePage.enterSearchTerm('Laptops');
  await homePage.verifySearchResults('Laptops');
  console.log('Search results verified for "Laptops"');

  console.log('Test completed successfully!');
});

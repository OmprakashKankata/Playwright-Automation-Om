const { test } = require('@playwright/test');
require('dotenv').config();
const { Logger } = require('../utils/logger');

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

  Logger.step(1, 'Navigate to Amazon');
  await homePage.navigate();
  await homePage.verifyTitle();

  Logger.step(2, 'Login');
  await homePage.clickSignIn();
  await loginPage.verifySignInPage();
  await loginPage.login(email, password);

  Logger.step(3, 'Go to Gift Cards & verify balance');
  await homePage.goToGiftCards();
  await giftCardPage.clickAddGiftCard();
  await giftCardPage.verifyWalletBalance();

  Logger.step(4, 'Back to homepage');
  await homePage.clickAmazonLogo();

  Logger.step(5, 'Hover on Fresh menu');
  await homePage.hoverOnFreshMenu();

  Logger.step(6, 'Search for laptops and verify results');
  await homePage.enterSearchTerm('Laptops');
  await homePage.verifySearchResults('Laptops');

  Logger.step(7, 'Click ASUS checkbox filter');
  await homePage.checkboxfilter();

  Logger.step(7, 'Click ASUS checkbox filter');
  await homePage.clickAsusCheckbox();


  Logger.step(8, 'Verify the asus laptop return count');
  await homePage.getResultCount();

  Logger.step(9, 'PriceSlider: Decrease the price slider by 5 steps');
  await homePage.decreasePriceSlider(5);

  Logger.step(10, 'Verify updated search count after price filter');
  await homePage.getResultCount();

  Logger.info('Test completed successfully!');
});

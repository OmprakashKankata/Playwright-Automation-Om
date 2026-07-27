const { test, expect } = require('@playwright/test');
require('dotenv').config();

const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { GiftCardPage } = require('../pages/GiftCardPage');

test('Amazon: Sign in → Gift Cards → Wallet Balance', async ({ page }) => {
  const email = process.env.AMAZON_EMAIL;
  const password = process.env.AMAZON_PASSWORD;
  test.skip(!email || !password, 'Set AMAZON_EMAIL & AMAZON_PASSWORD in environment config');
  
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const giftCardPage = new GiftCardPage(page);

  await test.step('Navigate to Amazon and login', async () => {
    await homePage.navigate();
    await homePage.verifyTitle();
    await homePage.clickSignIn();
    await loginPage.verifySignInPage();
    await loginPage.login(email, password);
  });

  await test.step('Verify Gift Card wallet balance', async () => {
    await homePage.goToGiftCards();
    await giftCardPage.clickAddGiftCard();
    await giftCardPage.verifyWalletBalance();
    const walletBalance = await giftCardPage.verifyWalletBalance();
    console.log(`Current Wallet Balance: ${walletBalance}`);

  });

  await test.step('Search for Laptops with Asus and Price Filters', async () => {
    await homePage.clickAmazonLogo();
    await homePage.hoverOnFreshMenu();
    await homePage.enterSearchTerm('Laptops');
    await homePage.verifySearchResults('Laptops');
    
    await homePage.clickAsusCheckbox();
    const initialCount = await homePage.getResultCount();   // returns 300 (number)
    
    await homePage.decreasePriceSlider(5);
    // ... apply filters ...
    const filteredCount = await homePage.getResultCount();  // returns e.g. 150 (number)
    expect(filteredCount).toBeLessThan(initialCount);       // ✅ works
   
    await homePage.goToTodaysDeals();
    console.log('Navigated to Today\'s Deals page successfully.');
  });
});


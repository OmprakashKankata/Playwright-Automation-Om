const { test, expect } = require('@playwright/test');
require('dotenv').config();

test('Amazon: Sign in, Gift Cards & Wallet Balance', async ({ page }) => {
  // Read credentials from env vars only — NO hardcoded fallback
  const AMAZON_EMAIL = process.env.AMAZON_EMAIL;
  const AMAZON_PASSWORD = process.env.AMAZON_PASSWORD;

  // Skip gracefully if credentials aren't configured
    test.skip(!AMAZON_EMAIL || !AMAZON_PASSWORD,
    'Skipping: Set AMAZON_EMAIL & AMAZON_PASSWORD in .env file (local) or GitHub Secrets (CI)');

    // Navigate to Amazon India
  await page.goto("https://www.amazon.in/", { waitUntil: "domcontentloaded", timeout: 60000 });

  await page.getByRole('button', { name: /continue shopping/i })
  .click({ timeout: 2000 })
  .catch(() => {
    console.log("Interstitial did not appear, proceeding...");
  });

  // Verify the page title
  await expect(page).toHaveTitle(/Amazon|Online Shopping/);
  const title = await page.title();
  console.log("Page Title:", title);

  // Click on sign-in link
  await page.click('//*[@id="nav-link-accountList"]/a');
  await page.waitForLoadState('networkidle');

  // Verify sign-in header
  const signinHeader = await page.getByRole('heading', { name: /Sign in/i });
  const signinHeaderText = await signinHeader.textContent();
  console.log("Sign In Header Text:", signinHeaderText);
  await expect(signinHeader).toContainText(/Sign in/);

  // Login with credentials
  await page.locator('//input[contains(@type,"email")]').fill(AMAZON_EMAIL, { timeout: 10000 });
  await page.locator('//input[contains(@type,"submit")]').click();
  await page.locator('//input[contains(@type, "password")]').fill(AMAZON_PASSWORD, { timeout: 10000 });
  await page.locator('//input[contains(@id, "signInSubmit")]').click();

  // Go to Gift Cards
  const giftCardsLink = await page.locator('//a[normalize-space(.)="Gift Cards"]');
  await giftCardsLink.click();

  const addgiftcard = await page.locator('//span[text()="Add a Gift Card"]');
  await addgiftcard.click();

  // Check wallet balance
  const walletBalance = await page.locator("//span[text()='₹5.00']");
  const balanceText = await walletBalance.textContent();
  console.log("Wallet Balance:", balanceText);
  await expect(walletBalance).toHaveText('₹5.00');

});
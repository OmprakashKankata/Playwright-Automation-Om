const { test, expect } = require('@playwright/test');
require('dotenv').config();

test('Amazon: Sign in, Gift Cards & Wallet Balance', async ({ page }) => {
  const AMAZON_EMAIL = process.env.AMAZON_EMAIL;
  const AMAZON_PASSWORD = process.env.AMAZON_PASSWORD;

  // Skip if credentials are not configured
  test.skip(!AMAZON_EMAIL || !AMAZON_PASSWORD,
    '⏭️ Skipping: Set AMAZON_EMAIL and AMAZON_PASSWORD in .env or GitHub Secrets');
  // Navigate to Amazon India
  
  await page.goto("https://www.amazon.in/", { waitUntil: "domcontentloaded", timeout: 60000 });
 //verify the page title partially two words amazon or online shopping
  await expect(page).toHaveTitle(/Amazon|Online Shopping/);
  //now print the title of the page
  const title = await page.title();
  console.log("Page Title:", title);
  //print the error message if the title is not correct
  if (!/Amazon|Online Shopping/.test(title)) {
    console.error("Title does not contain 'Amazon' or 'Online Shopping'");
  
  }
    // Click on sign-in link to navigate to sign-in page
 await page.click('//*[@id="nav-link-accountList"]/a');

 // Wait for the sign-in page to load — use domcontentloaded (not networkidle)
 await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

 // Use a SPECIFIC locator to uniquely target the main heading
 const signinHeader = page.getByRole('heading', { name: /Sign in/i });

 const signinHeaderText = await signinHeader.textContent();
 console.log("Sign In Header Text:", signinHeaderText);
 await expect(signinHeader).toContainText(/Sign in/);

    // Input the email or mobile number from environment variables
 await page.locator('//input[contains(@type,"email")]').fill(AMAZON_EMAIL, { timeout: 10000 });

//click on continue button
 const continueButton = await page.locator('//input[contains(@type,"submit")]');
  await continueButton.click();

    const inputpassword = await page.locator(' //input[contains(@type, "password")]');
 await inputpassword.fill(AMAZON_PASSWORD, { timeout: 10000 });

 const signInButton = await page.locator('//input[contains(@id, "signInSubmit")]');
  await signInButton.click();
   
    // Click on Gift Cards link
  const giftCardsLink = page.locator('//a[normalize-space(.)="Gift Cards"]');
  await giftCardsLink.click();

  // ✅ Wait for Gift Cards page to load before interacting
  await page.waitForURL('**/gc/**', { timeout: 15000 });

  const addgiftcard = page.locator('//span[text()="Add a Gift Card"]');
  await addgiftcard.click();

  // ✅ Wait for balance element to appear (with flexible assertion)
  const walletBalance = page.locator("//span[text()='₹5.00']");
  const balanceText = await walletBalance.textContent({ timeout: 10000 });
  console.log("Wallet Balance:", balanceText);
  await expect(walletBalance).toBeVisible();


});
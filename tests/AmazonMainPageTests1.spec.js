const { test, expect } = require('@playwright/test');

test('Open Amazon India homepage and verify elements', async ({ page }) => {
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

 // Wait for the sign-in page to fully load
 await page.waitForLoadState('networkidle');

 // Use a SPECIFIC locator to uniquely target the main heading
 const signinHeader = page.getByRole('heading', { name: /Sign in/i });

 const signinHeaderText = await signinHeader.textContent();
 console.log("Sign In Header Text:", signinHeaderText);
 await expect(signinHeader).toContainText(/Sign in/);

  // Input the email or mobile number — Playwright auto-waits for the element
 await page.locator('//input[contains(@type,"email")]').fill('omprakash.kank@gmail.com', { timeout: 10000 });

//click on continue button
 const continueButton = await page.locator('//input[contains(@type,"submit")]');
  await continueButton.click();

  const inputpassword = await page.locator(' //input[contains(@type, "password")]');
 await inputpassword.fill('Umamaheshwari@44', { timeout: 10000 });

 const signInButton = await page.locator('//input[contains(@id, "signInSubmit")]');
  await signInButton.click();
   
  //click on gift cards link
  const giftCardsLink = await page.locator('//a[normalize-space(.)="Gift Cards"]');
  await giftCardsLink.click();

  const addgiftcard = await page.locator('//span[text()="Add a Gift Card"]');
  await addgiftcard.click();
 
  const walletBalance = await page.locator("//span[text()='₹5.00']");
  const balanceText = await walletBalance.textContent();
  console.log("Wallet Balance:", balanceText);
  await expect(walletBalance).toHaveText('₹5.00');


});
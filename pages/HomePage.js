const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.signInLink = page.locator('//*[@id="nav-link-accountList"]/a');
    this.giftCardsLink = page.locator('//a[normalize-space(.)="Gift Cards"]');
    this.freshMenu = page.locator('//*[@id="nav-link-groceries"]/a/span');
    this.amazonLogo = page.locator("//a[contains(@id, 'nav-logo-sprites')]");
    this.searchAmazonInput = page.locator('//input[contains(@id, "twotabsearchtextbox")]');
  }

  async navigate() {
    await this.page.goto('https://www.amazon.in/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Handle "Continue Shopping" interstitial if it appears
    await this.page
      .getByRole('button', { name: /continue shopping/i })
      .click({ timeout: 2000 })
      .catch(() => {});
  }

  async verifyTitle() {
    await expect(this.page).toHaveTitle(/Amazon|Online Shopping/);
    const title = await this.page.title();
    console.log('Page Title:', title);
  }

  async clickSignIn() {
    await this.signInLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  }

  async goToGiftCards() {
    await this.giftCardsLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    console.log('Current URL:', this.page.url());
  }

  async hoverOnFreshMenu() {
    await this.freshMenu.hover();
    console.log('Hovered on Fresh menu');
  }

  async clickAmazonLogo() {
    await this.amazonLogo.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  }

  async enterSearchTerm(term) {
    await this.searchAmazonInput.fill(term);
    await this.searchAmazonInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  }
};


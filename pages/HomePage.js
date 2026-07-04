const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.signInLink = page.locator('//*[@id="nav-link-accountList"]/a');
    this.giftCardsLink = page.locator('//a[normalize-space(.)="Gift Cards"]');
    this.freshMenu = page.locator('//*[@id="nav-link-groceries"]/a/span');
    this.amazonLogo = page.locator("//a[contains(@id, 'nav-logo-sprites')]");
    this.searchAmazonInput = page.locator('//input[contains(@id, "twotabsearchtextbox")]');
    // Robust ASUS checkbox locator - find by label text instead of brittle ID
    this.allFiltersButton = page.locator('//*[@id="s-all-filters-announce"]');
    this.asusCheckbox = page.locator('//span[@class="a-size-base a-color-base" and text()="ASUS"]/ancestor::a[@role="link"]');

    this.searchResultCount = page.locator('//*[@id="search"]/span/div/h1/div/div[1]/div/div/div[2]/h2');
    this.priceSlider = page.locator('//input[contains(@id,"p_36/range-slider_slider-item_upper-bound-slider")]');
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
    Logger.info('Page Title: ' + title);
  }

  async clickSignIn() {
    await this.signInLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  }

  async goToGiftCards() {
    await this.giftCardsLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    
  }

  async hoverOnFreshMenu() {
    await this.freshMenu.hover();
    Logger.info('Hovered on Fresh menu');
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

  async verifySearchResults(term) {
    // Verify page title includes the search term
    await expect(this.page).toHaveTitle(new RegExp(term, 'i'), { timeout: 10000 });
    Logger.info('Verified search results for: ' + term);
    
  }

   async checkboxfilter() {
    const isFilterVisible = await this.allFiltersButton.isVisible().catch(() => false);

    if (isFilterVisible) {
      await this.allFiltersButton.click();
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      Logger.info('Clicked on All Filters button');
    } else {
      Logger.info('Filter button not visible, clicking ASUS checkbox directly');
      await this.clickAsusCheckbox();
    }
  }

  async clickAsusCheckbox() {
    const exists = await this.asusCheckbox.count();
    if (exists === 0) {
      Logger.error('ASUS checkbox not found on the page');
      return;
    }
    
    await this.asusCheckbox.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    try {
      // Try regular click first
      await this.asusCheckbox.click({ timeout: 5000 });
    } catch {
      // Fallback: Force click (bypass overlays)
      Logger.info('Regular click failed, trying force click');
      await this.asusCheckbox.click({ force: true, timeout: 5000 });
    }
    
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    Logger.info('Clicked on ASUS checkbox filter');
  }

  async scrollToPosition(position) {
    if (position === 'bottom') {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    } else if (position === 'middle') {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    }
    Logger.info('Scrolled to ' + position + ' of the page');
  }

  async getResultCount() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(1000);

    const countText = await this.searchResultCount.textContent();
    Logger.info('Search result count: ' + countText);
    return countText;
}

async decreasePriceSlider(steps) {
    await this.priceSlider.scrollIntoViewIfNeeded();
    await this.priceSlider.focus();

    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press('ArrowLeft');
      await this.page.waitForTimeout(100);
      Logger.info(`Decreased price slider by 1 step (total steps: ${i + 1})`);
    }

      await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    Logger.info(`Decreased price slider by ${steps} steps`);
  }}


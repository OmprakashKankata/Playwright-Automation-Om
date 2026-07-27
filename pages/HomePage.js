const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.signInLink = page.locator('//*[@id="nav-link-accountList"]/a');
    this.giftCardsLink = page.locator('//a[normalize-space(.)="Gift Cards"]');
    this.freshMenu = page.locator('//*[@id="nav-link-groceries"]/a/span');
    this.amazonLogo = page.locator("//a[contains(@id, 'nav-logo-sprites')]");
    this.searchAmazonInput = page.locator('//input[contains(@id, "twotabsearchtextbox")]');
    this.asusCheckbox = page.locator('//*[self::span or self::a][contains(normalize-space(.), "ASUS")]').first();

    this.searchResultCount = page.locator('//*[@id="search"]/span/div/h1/div/div[1]/div/div/div[2]/h2');
    this.priceSlider = page.locator('//input[contains(@id,"p_36/range-slider_slider-item_upper-bound-slider")]');
    this.todaysDealsPage= page.locator("(//a[normalize-space()=\"Today's Deals\"])[1]");
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
    
  }

  async checkboxfilter() {
    await this.clickAsusCheckbox();
  }

  async clickAsusCheckbox() {
    const count = await this.asusCheckbox.count();
    if (count === 0) {
      console.warn('ASUS filter option not found; skipping filter.');
      return false;
    }

    await this.asusCheckbox.scrollIntoViewIfNeeded();
    await this.asusCheckbox.click({ timeout: 5000 }).catch(async () => {
      await this.asusCheckbox.click({ force: true, timeout: 5000 });
    });

    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    return true;
  }

  async scrollToPosition(position) {
    if (position === 'bottom') {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    } else if (position === 'middle') {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    }
    
  }

  async getResultCount() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(1000);

    const countText = await this.searchResultCount.textContent().catch(() => '');
    console.info('Search result count: ' + countText);

    const match = countText.match(/of\s+([\d,]+)\s+results/i);
    if (!match) {
      console.warn('Could not parse result count; returning 0.');
      return 0;
    }

    const total = parseInt(match[1].replace(/,/g, ''), 10);
    console.info('Parsed result count (number): ' + total);
    return total;
  }

  async decreasePriceSlider(steps) {
    const sliderCount = await this.priceSlider.count();
    if (sliderCount === 0) {
      console.warn('Price slider not found; skipping price filter.');
      return false;
    }

    await this.priceSlider.scrollIntoViewIfNeeded();
    await this.priceSlider.focus();

    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press('ArrowLeft');
      await this.page.waitForTimeout(100);
    }

    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    return true;
  }

  async goToTodaysDeals() {
    try {
      await this.todaysDealsPage.click();
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (error) {
      console.warn('Could not open Today\'s Deals page:', error.message);
    }
  }
}



const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');

exports.GiftCardPage = class GiftCardPage {
  constructor(page) {
    this.page = page;
    this.addGiftCardButton = page.locator('//span[text()="Add a Gift Card"]');
    this.walletBalance = page.locator("//span[text()='₹5.00']");
  }

  async clickAddGiftCard() {
    await this.addGiftCardButton.click();
  }

  async verifyWalletBalance(expectedBalance = '₹5.00') {
    await expect(this.walletBalance).toHaveText(expectedBalance);
    const balanceText = await this.walletBalance.textContent();
    Logger.info('Wallet Balance: ' + balanceText);
  }
};

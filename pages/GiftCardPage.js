const { expect } = require('@playwright/test');

exports.GiftCardPage = class GiftCardPage {
  constructor(page) {
    this.page = page;
    this.addGiftCardButton = page.getByRole('link', { name: /Add Gift Card/i }).first();
    this.walletBalance = page.locator("//span[normalize-space()='₹5.00']");
  }

  async clickAddGiftCard() {
    let button = this.addGiftCardButton;
    if (await button.count() === 0) {
      button = this.page
        .locator('//a[contains(normalize-space(.),"Add Gift Card") or contains(normalize-space(.),"Add Gift Card/Voucher") or contains(normalize-space(.),"Add Gift Card to Amazon Pay balance")]')
        .first();
    }

    if (await button.count() === 0) {
      button = this.page.locator('//*[contains(normalize-space(.),"Add Gift Card") or contains(normalize-space(.),"Add Gift Card/Voucher")]').first();
    }

    await expect(button).toBeVisible({ timeout: 20000 });
    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async verifyWalletBalance(expectedBalance) {
    await expect(this.walletBalance).toBeVisible({ timeout: 20000 });
    const balanceText = await this.walletBalance.textContent();

    if (expectedBalance) {
      await expect(this.walletBalance).toHaveText(expectedBalance, { timeout: 10000 });
    }

    return balanceText ? balanceText.trim() : '';
  }
};

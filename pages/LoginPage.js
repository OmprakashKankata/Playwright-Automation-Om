const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name="email"], input#ap_email, input#email');
    this.continueButton = page.locator('input[type="submit"], #continue, input#continue, button:has-text("Continue")');
    this.passwordInput = page.locator('input[type="password"], input#ap_password, input[name="password"]');
    this.signInButton = page.locator('input#signInSubmit, input[type="submit"], button:has-text("Sign in")');
    this.signInHeader = page.getByRole('heading', { name: /Sign in/i }).or(page.locator('text=Sign in'));
  }

  async verifySignInPage() {
    await expect(this.signInHeader.first()).toBeVisible({ timeout: 20000 });
  }

  async login(email, password) {
    await this.emailInput.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.emailInput.first().fill(email, { timeout: 10000 });

    const continueButton = this.continueButton.first();
    await continueButton.waitFor({ state: 'visible', timeout: 20000 });
    await continueButton.click();

    await this.passwordInput.first().waitFor({ state: 'visible', timeout: 30000 });
    await this.passwordInput.first().fill(password, { timeout: 10000 });

    const signInButton = this.signInButton.first();
    await signInButton.waitFor({ state: 'visible', timeout: 20000 });
    await signInButton.click();

    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });

    await this.page
      .getByRole('button', { name: /continue shopping/i })
      .click({ timeout: 2000 })
      .catch(() => {});
  }
};

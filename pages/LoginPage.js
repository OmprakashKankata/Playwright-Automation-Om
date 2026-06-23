const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('//input[contains(@type,"email")]');
    this.continueButton = page.locator('//input[contains(@type,"submit")]');
    this.passwordInput = page.locator('//input[contains(@type, "password")]');
    this.signInButton = page.locator('//input[contains(@id, "signInSubmit")]');
    this.signInHeader = page.getByRole('heading', { name: /Sign in/i });
  }

  async verifySignInPage() {
    await expect(this.signInHeader).toContainText(/Sign in/);
    const headerText = await this.signInHeader.textContent();
    console.log('Sign In Header:', headerText);
  }

  async login(email, password) {
    await this.emailInput.fill(email, { timeout: 10000 });
    await this.continueButton.click();
    await this.passwordInput.fill(password, { timeout: 10000 });
    await this.signInButton.click();
    console.log('Login completed');
  }
};

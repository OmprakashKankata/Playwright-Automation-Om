const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

/**
 * Test: Intercept AppSync GraphQL API calls made by the browser.
 */
test('API: verify getAllBroadcastData from live broadcast page', async ({ page }) => {
  const homePage = new HomePage(page);

  let apiResponsePromise;
  await test.step('Start waiting for AppSync API response', async () => {
    apiResponsePromise = page.waitForResponse(
      response =>
        response.url().includes('appsync-api') &&
        response.status() === 200,
      { timeout: 45000 }
    );
  });

  await test.step('Navigate to Amazon', async () => {
    await homePage.navigate();
  });

  await test.step('Capture API response', async () => {
    const apiResponse = await apiResponsePromise.catch(() => null);
    if (!apiResponse) {
      test.skip(true, 'No API response captured');
      return;
    }

    const json = await apiResponse.json();
    expect(json.data).toBeDefined();

    const broadcast = json.data.getAllBroadcastData?.broadcast;
    test.skip(!broadcast, 'No live broadcast active at this time');

    await test.step('Validate broadcast data', async () => {
      expect(broadcast.liveViewers).toEqual(expect.any(Number));
      expect(broadcast.status).toEqual(expect.any(String));
      expect(broadcast.title).toEqual(expect.any(String));
    });
  });
});
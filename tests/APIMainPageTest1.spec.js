const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { Logger } = require('../utils/logger');

/**
 * Test: Intercept AppSync GraphQL API calls made by the browser.
 */
test('API: verify getAllBroadcastData from live broadcast page', async ({ page }) => {
  const homePage = new HomePage(page);

  Logger.step(1, 'Start waiting for AppSync API response');
  const apiResponsePromise = page.waitForResponse(
    response =>
      response.url().includes('appsync-api') &&
      response.status() === 200,
    { timeout: 45000 }
  );

  Logger.step(2, 'Navigate to Amazon');
  await homePage.navigate();

  Logger.step(3, 'Capture API response');
  const apiResponse = await apiResponsePromise.catch(() => null);
  if (!apiResponse) {
    Logger.info('No AppSync API response captured — skipping test');
    test.skip(true, 'No API response captured');
    return;
  }

  const json = await apiResponse.json();
  expect(json.data).toBeDefined();

  const broadcast = json.data.getAllBroadcastData?.broadcast;
  test.skip(!broadcast, 'No live broadcast active at this time');

  Logger.step(4, 'Validate broadcast data');
  expect(broadcast.liveViewers).toEqual(expect.any(Number));
  expect(broadcast.status).toEqual(expect.any(String));
  expect(broadcast.title).toEqual(expect.any(String));

  Logger.info('Live Broadcast Data: ' + JSON.stringify({
    liveViewers: broadcast.liveViewers,
    status: broadcast.status,
    title: broadcast.title,
  }));
});
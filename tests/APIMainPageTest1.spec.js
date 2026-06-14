const { test, expect } = require('@playwright/test');

/**
 * Test: Intercept AppSync GraphQL API calls made by the browser.
 * ✅ No API keys needed — Amazon handles authentication automatically.
 * ✅ Works with both Fetch and XHR requests.
 */
test('API: verify getAllBroadcastData from live broadcast page', async ({ page }) => {
  // Step 1: Start waiting for the GraphQL API response BEFORE navigating
  const apiResponsePromise = page.waitForResponse(response =>
    response.url().includes('appsync-api') &&
    response.status() === 200
  );

  // Step 2: Navigate to Amazon — this triggers the API call
  await page.goto('https://www.amazon.in/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Step 3: Wait for and capture the API response
  const apiResponse = await apiResponsePromise;
  const json = await apiResponse.json();

  // Step 4: Validate the response structure
  expect(json.data).toBeDefined();

  const broadcast = json.data.getAllBroadcastData?.broadcast;
  expect(broadcast).toBeTruthy();

  // Step 5: Flexible assertions — validate data types, not exact values
  expect(broadcast.liveViewers).toEqual(expect.any(Number));
  expect(broadcast.status).toEqual(expect.any(String));
  expect(broadcast.title).toEqual(expect.any(String));

  // Step 6: Log the live data for debugging
  console.log('✅ Live Broadcast Data:', {
    liveViewers: broadcast.liveViewers,
    status: broadcast.status,
    title: broadcast.title,
  });
});
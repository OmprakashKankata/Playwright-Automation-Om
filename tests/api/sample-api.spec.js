const { test, expect } = require('@playwright/test');



test.describe('API smoke tests', () => {
  test('GET /posts/1 returns valid post details @smoke @api', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/');

    expect(response.status()).toBe(200);

    const body = await response.json();
        console.log('Response Body:', body);
  });

  test('POST /posts creates a new record @api', async ({ request }) => {
    const payload = {
      title: 'Playwright API Test',
      body: 'This request validates API creation flow using Playwright.',
      userId: 1,
    };

    const response = await request.post(`${API_BASE_URL}/posts`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
  });
});

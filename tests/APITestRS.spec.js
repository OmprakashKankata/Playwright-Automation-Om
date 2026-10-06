const {test, expect} = require('@playwright/test');

test('API: validate RS response for geo lookup', async ({request}) => {
    const response = await request.get('https://ipwho.is/', {
        headers: {
            accept: 'application/json',
        },
    });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    console.log('ipwho.is response body:', JSON.stringify(body, null, 2));
    expect(body).toBeDefined();
    expect(body.success).toBe(true);
    expect(body.ip).toEqual(expect.any(String));
    expect(body.country).toEqual(expect.any(String));
    expect(body.country_code).toEqual(expect.any(String));
    expect(body.type).toMatch(/IPv4|IPv6/);
});
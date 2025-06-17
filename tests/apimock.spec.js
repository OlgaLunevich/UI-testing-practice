import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.example.com/users/';

const mockSuccessfulResponse = {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "phone": "+1-555-123-4567",
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipcode": "10001",
        "country": "USA"
    },
    "company": {
        "name": "Doe Enterprises",
        "industry": "Technology",
        "position": "Software Engineer"
    },
    "dob": "1990-05-15",
    "profile_picture_url": "https://example.com/images/johndoe.jpg",
    "is_active": true,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-10-01T12:00:00Z",
    "preferences": {
        "language": "en",
        "timezone": "America/New_York",
        "notifications_enabled": true
    }
};

// Returns a standardized mock error response for a given HTTP status code
const mockErrorResponse = (code) => ({
    status: code,
    contentType: 'application/json',
    body: JSON.stringify({
        error: `Error ${code}`,
        details: `Simulated error for status ${code}`
    })
});

test.describe('API: Mocking and Validation tests',() => {
    // 200 Successful Response
    test('Mock Successful Response', async ({page}) => {
        await page.route(`${BASE_URL}1`, async (route)=> {
            route.fulfill({
                status:200,
                contentType: "application/json",
                body: JSON.stringify(mockSuccessfulResponse)
            })
        });
        const response = await page.evaluate( async (url)=> {
            const res = await fetch(url);
            return res.json();
        }, `${BASE_URL}1`);

        expect(response).toHaveProperty('id', 1);
        expect(typeof response.name).toBe('string');
        expect(typeof response.email).toBe('string');
        expect(typeof response.username).toBe('string');
        expect(typeof response.address).toBe('object');
        expect(typeof response.address.city).toBe('string');
        expect(typeof response.company.name).toBe('string');
        expect(typeof response.preferences.notifications_enabled).toBe('boolean');
    });

    // 204 No Content
    test('Mock 204 No Content Response', async ({ page }) => {
        await page.route(`${BASE_URL}204`, route => {
            route.fulfill({ status: 204, body: '' });
        });

        const response = await page.evaluate(async (url) => {
            const res = await fetch(url);
            const text = await res.text();
            return { status: res.status, body: text };
        }, `${BASE_URL}204`);

        expect(response.status).toBe(204);
        expect(response.body).toBe('');
    });

    // 403 Forbidden
    test('Mock 403 Forbidden Error', async ({ page }) => {
        await page.route(`${BASE_URL}403`, route => {
            route.fulfill(mockErrorResponse(403));
        });

        const response = await page.evaluate(async (url) => {
            const res = await fetch(url);
            const json = await res.json();
            return { status: res.status, json };
        }, `${BASE_URL}403`);

        expect(response.status).toBe(403);
        expect(response.json).toHaveProperty('error', 'Error 403');
        expect(typeof response.json.details).toBe('string');
    });

    //  404 Not Found
    test('Mock 404 Not Found Error', async ({ page }) => {
        await page.route(`${BASE_URL}404`, route => {
            route.fulfill(mockErrorResponse(404));
        });

        const response = await page.evaluate(async (url) => {
            const res = await fetch(url);
            const json = await res.json();
            return { status: res.status, json };
        }, `${BASE_URL}404`);

        expect(response.status).toBe(404);
        expect(response.json.error).toBe('Error 404');
    });

    //  502 Bad Gateway
    test('Mock 502 Bad Gateway Error', async ({ page }) => {
        await page.route(`${BASE_URL}502`, route => {
            route.fulfill(mockErrorResponse(502));
        });

        const response = await page.evaluate(async (url) => {
            const res = await fetch(url);
            const json = await res.json();
            return { status: res.status, json };
        }, `${BASE_URL}502`);

        expect(response.status).toBe(502);
        expect(response.json).toHaveProperty('details', 'Simulated error for status 502');
    });
});
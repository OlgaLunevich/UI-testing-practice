import { test, expect } from '@playwright/test';
import Fakerator from "fakerator";

const fakerator = Fakerator();
const BASE_URL = 'https://demoqa.com/Account/v1';

// Parsing JSON with try/catch protection is used,
// because the API sometimes returns invalid JSON (e.g., HTML with a 502 error)

test.describe.serial('API tests with DemoQA', () => {
    const userName = `User_${fakerator.names.firstName()}_${fakerator.names.lastName()}`;
    const password = `123!@#qweQWE`;

    let userID = '';
    let token = '';

    // Positive test: Create user with valid data
    test('POST /User - Positive: Should create a user with valid data', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/User`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: { userName, password }
        });

        console.log('Status:', response.status());
        const text = await response.text();
        console.log('Response:', text);

        expect(response.status()).toBe(201);

        let body;
        try {
            body = JSON.parse(text);
        } catch {
            throw new Error('Invalid JSON response received when creating user');
        }

        expect(body.userID).toBeTruthy();
        userID = body.userID;
    });

    // Negative test: Create user with empty password
    test('POST /User - Negative: Should attempt to create a user with empty password', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/User`, {
            data: {
                userName: `Test_${Date.now()}`,
                password: ''
            }
        });

        expect(response.status()).toBe(400);

        let body;
        try {
            body = await response.json();
        } catch {
            throw new Error('Invalid JSON response for empty password');
        }

        expect(body.message).toBe('UserName and Password required.');
    });

    // Positive test: Generate token with correct credentials
    test('POST /GenerateToken - Positive: Should generate a token for an existing user', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/GenerateToken`, {
            data: { userName, password }
        });

        expect(response.status()).toBe(200);

        let body;
        try {
            body = await response.json();
        } catch {
            throw new Error('Invalid JSON response when generating token');
        }

        console.log('Token generation response:', body);
        expect(body.token).toBeTruthy();
        expect(body.status).toBe('Success');

        token = body.token;
    });

    // Negative test: Generate token with incorrect password
    test('POST /GenerateToken - Negative: Should attempt to generate token with an incorrect password', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/GenerateToken`, {
            data: { userName, password: 'WrongPassword1!' }
        });

        expect(response.status()).toBe(200);

        let body;
        try {
            body = await response.json();
        } catch {
            throw new Error('Invalid JSON response for wrong password');
        }

        expect(body.token).toBeNull();
        expect(body.status).toBe('Failed');
        expect(body.result).toBe('User authorization failed.');
    });

    // Positive test: Get user info with valid ID and token
    test('GET /User/{UUID} - Positive: Should get information about an existing user', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/User/${userID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status()).toBe(200);

        let body;
        try {
            body = await response.json();
        } catch {
            throw new Error('Invalid JSON response while getting user info');
        }

        expect(body.username).toBe(userName);
        expect(body.userId).toBe(userID);
    });

    // Negative test: Attempt to get info for a non-existent user
    test('GET /User/{UUID} - Negative: Should attempt to get information about a non-existent user', async ({ request }) => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        const response = await request.get(`${BASE_URL}/User/${fakeId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status()).toBe(401); // Unauthorized
    });

    // Positive test: Delete an existing user
    test('DELETE /User/{UUID} - Positive: Should delete existing user', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/User/${userID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status()).toBe(204);
    });

    // Negative test: Attempt to delete a non-existent user
    test('DELETE /User/{UUID} - Negative: Should attempt to delete a non-existent user', async ({ request }) => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        const response = await request.delete(`${BASE_URL}/User/${fakeId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status()).toBe(200);

        let body;
        try {
            body = await response.json();
        } catch {
            throw new Error('Invalid JSON response when deleting non-existent user');
        }

        expect(body.code).toBe('1207');
        expect(body.message).toBe('User Id not correct!');
    });
});


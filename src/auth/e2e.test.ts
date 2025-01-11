import assert from 'assert';
import { test } from 'node:test';

const BASE_URL = 'http://localhost:3000/auth';

test('E2E Testing for User Authentication', async (t) => {
  let userId: string;
  let userEmail: string;

  const randomUsername = `user_${Math.random().toString(36).substring(7)}`;

  // Test: Register a user
  await t.test('Register User - Success', async () => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: randomUsername,
        email: `${randomUsername}@example.com`,
        password: 'securepassword',
      }),
    });

    assert.strictEqual(response.status, 201);
    const data = await response.json();
    assert.ok(data.id, 'User ID should be returned');
    userId = data.id;
    userEmail = `${randomUsername}@example.com`;
  });

  // Test: Login the registered user
  await t.test('Login User - Success', async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'securepassword',
      }),
    });

    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.id, userId, 'Logged in user ID should match the registered user ID');
  });

  // Test: Change the password
  await t.test('Change Password - Success', async () => {
    const response = await fetch(`${BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        userId,
      },
      body: JSON.stringify({
        oldPassword: 'securepassword',
        newPassword: 'newsecurepassword',
      }),
    });

    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.message, 'Password updated successfully');
  });

  // Test: Login with the new password
  await t.test('Login with New Password - Success', async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'newsecurepassword',
      }),
    });

    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.id, userId, 'Logged in user ID should match the registered user ID');
  });

  // Test: Login with the old password (should fail)
  await t.test('Login with Old Password - Fail', async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'securepassword',
      }),
    });

    assert.strictEqual(response.status, 401);
    const data = await response.json();
    assert.strictEqual(data.error, 'Invalid email or password');
  });
});

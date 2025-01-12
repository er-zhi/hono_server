import assert from 'assert';
import { test } from 'node:test';

const BASE_URL = 'http://localhost:3000';
let userId: number;
let availableProducts: any[];

test('E2E Tests for Product Purchase', async (t) => {
  const randomUsername = `user_${Math.random().toString(36).substring(7)}`;

  // Step 1: Create a new user
  await t.test('Register User', async () => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: randomUsername,
        email: `${randomUsername}@example.com`,
        password: 'securepassword',
      }),
    });

    assert.strictEqual(response.status, 201, 'User registration should succeed');
    const data = await response.json();
    assert.ok(data.id, 'User ID should be returned');
    userId = data.id;
  });

  // Step 2: Fetch all available products from the database
  await t.test('Fetch Products from Database', async () => {
    const response = await fetch(`${BASE_URL}/products/available`, {
      method: 'GET',
    });

    assert.strictEqual(response.status, 200, 'Fetching products from database should succeed');
    const data = await response.json();
    assert.ok(Array.isArray(data), 'Products should be returned as an array');
    assert.ok(data.length > 0, 'Products array should not be empty');

    // Save available products for later tests
    availableProducts = data;

    // Validate the structure of a product
    const product = data[0];
    assert.ok(product.id, 'Product should have an ID');
    assert.ok(product.name, 'Product should have a name');
    assert.ok(typeof product.price === 'number', 'Product price should be a number');
  });

  // Step 3: Purchase a product with sufficient balance
  await t.test('Purchase Product - Success', async () => {
    const productToPurchase = availableProducts[0]; // Use the first product
    const response = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId: productToPurchase.id }),
    });

    assert.strictEqual(response.status, 200, 'Product purchase should succeed');
    const data = await response.json();
    assert.ok(data.message, 'Purchase successful');
    assert.ok(data.updatedBalance < 1000.0, 'User balance should be deducted');
  });

  // Step 4: Attempt to purchase an expensive product with insufficient balance
  await t.test('Purchase Product - Insufficient Balance', async () => {
    const expensiveProduct = availableProducts.find((product) => product.price > 1000.0); // Find an expensive product
    if (!expensiveProduct) {
      console.warn('No expensive product available to test insufficient balance scenario');
      return;
    }

    const response = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId: expensiveProduct.id }),
    });

    assert.strictEqual(response.status, 400, 'Should fail due to insufficient balance');
    const data = await response.json();
    assert.strictEqual(data.error, 'Insufficient balance', 'Error message should indicate insufficient balance');
  });
});

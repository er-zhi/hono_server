import axios from 'axios';
import { query } from '../db/database.ts';

// Fetch items from the Skinport API
const fetchItemsFromSkinport = async (tradable: boolean) => {
  try {
    const url = new URL('https://api.skinport.com/v1/items');
    url.searchParams.append('tradable', tradable.toString());
    url.searchParams.append('app_id', '730');
    url.searchParams.append('currency', 'EUR'); // Default currency

    const response = await fetch(url, {
      headers: {
        'Accept-Encoding': 'br', // Enable Brotli compression
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Skinport: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `An unknown error occurred while fetching Skinport data: ${
        (error as Error).message || 'Unknown error'
      }`
    );
  }
};

export const getLowestPricedItems = async () => {
  // parallel request for speed
  const [tradableItems, nonTradableItems] = await Promise.all([
    fetchItemsFromSkinport(true),
    fetchItemsFromSkinport(false),
  ]);

  const getLowestPrices = (items: any[]) => items
    .sort((a, b) => a.min_price - b.min_price)
    .slice(0, 2);

  return {
    tradable: getLowestPrices(tradableItems),
    nonTradable: getLowestPrices(nonTradableItems),
  };
};

// Get products from the database
export const getProductsFromDb = async () => {
  try {
    const result = await query('SELECT id, name, price FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching products from database:', error);
    throw new Error('Failed to fetch products from the database.');
  }
};

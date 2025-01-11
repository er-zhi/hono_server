import axios from 'axios';

const fetchItemsFromSkinport = async (tradable: boolean) => {
  try {
    const response = await axios.get('https://api.skinport.com/v1/items', {
      headers: {
        'Accept-Encoding': 'br', // Enable Brotli compression
      },
      params: {
        tradable,
        app_id: 730,
        currency: 'EUR', // Default currency
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch data from Skinport: ${error.response?.data || error.message}`);
    }
    throw new Error('An unknown error occurred while fetching Skinport data.');
  }
};

export const getLowestPricedItems = async () => {
  // parallel request for speed
  const [tradableItems, nonTradableItems] = await Promise.all([
    fetchItemsFromSkinport(true),
    fetchItemsFromSkinport(false),
  ]);

  const getLowestPrices = (items: any[]) =>
    items
      .sort((a, b) => a.min_price - b.min_price)
      .slice(0, 2);

  return {
    tradable: getLowestPrices(tradableItems),
    nonTradable: getLowestPrices(nonTradableItems),
  };
};

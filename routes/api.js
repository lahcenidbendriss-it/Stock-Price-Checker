const express = require('express');
const axios = require('axios');
const router = express.Router();

const proxyUrl = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock';

// Endpoint to get stock prices
router.get('/stock-prices', async (req, res) => {
  try {
    const { stock, like } = req.query;
    if (!stock) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    // Ensure stock is an array
    let stockSymbols = Array.isArray(stock) ? stock : [stock];
    const requests = stockSymbols.map(symbol => {
      const url = `${proxyUrl}/${symbol}/quote`;
      console.log(`Fetching data from: ${url}`); // Log the URL for debugging
      return axios.get(url);
    });

    const responses = await Promise.all(requests);
    const stockData = responses.map((response, index) => ({
      stock: stockSymbols[index],
      price: response.data.latestPrice // Adjusted to match the correct response field
    }));

    // If 'like' query is present, handle it here (e.g., save to database)
    // For example: handle likes here, if applicable

    res.json({ stockData });
  } catch (error) {
    console.error('API route error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

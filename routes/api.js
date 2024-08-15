const express = require('express');
const axios = require('axios');
const router = express.Router();

// Simulated in-memory store for stock likes based on anonymized IP
const stockLikes = {};

router.get('/stock-prices', async (req, res) => {
  const { stock, like } = req.query;
  const stockSymbols = Array.isArray(stock) ? stock : [stock];

  try {
    const stockData = await Promise.all(stockSymbols.map(async (symbol) => {
      // Fetch stock data
      const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
      const stockPrice = response.data.latestPrice;

      // Simulated IP (In real applications, use hashed or anonymized IP)
      const ip = req.ip;

      // Handle likes
      if (like === 'true') {
        if (!stockLikes[symbol]) {
          stockLikes[symbol] = new Set();
        }
        stockLikes[symbol].add(ip);
      }

      return {
        stock: symbol,
        price: stockPrice,
        likes: stockLikes[symbol] ? stockLikes[symbol].size : 0 // Ensure likes are always returned
      };
    }));

    if (stockData.length === 1) {
      // Single stock response (no change)
      res.json({ stockData: stockData[0] });
    } else {
      // Multiple stocks response with relative likes
      const [stock1, stock2] = stockData;
      const rel_likes_1 = stock1.likes - stock2.likes;
      const rel_likes_2 = stock2.likes - stock1.likes;

      // Format response to match the expected result
      const result = [
        { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes_1 },
        { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes_2 }
      ];

      res.json({ stockData: result });
    }
  } catch (error) {
    console.error("API route error:", error.message);
    res.status(500).send("Error retrieving stock data.");
  }
});

module.exports = router;

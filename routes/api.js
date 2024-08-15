'use strict';

const { Stock } = require("../models"); // Ensure to import Stock model correctly

// Use dynamic import to load node-fetch
async function getStock(stock) {
  const { default: fetch } = await import('node-fetch'); // Dynamic import

  try {
    const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
    
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const { symbol, latestPrice } = data;
    return { symbol, latestPrice };
  } catch (error) {
    console.error('Failed to fetch stock data:', error.message);
    throw new Error('Failed to fetch stock data');
  }
}

// Function to create a new stock document
async function createStock(stock, like, ip) {
  const newStock = new Stock({
    symbol: stock,
    likes: like ? [ip] : []
  });
  return await newStock.save();
}

// Function to save or update a stock document
async function saveStock(stock, like, ip) {
  const foundStock = await findStock(stock);
  if (!foundStock) {
    return await createStock(stock, like, ip);
  } else {
    if (like && !foundStock.likes.includes(ip)) {
      foundStock.likes.push(ip);
    }
    return await foundStock.save();
  }
}

// Function to find a stock document by symbol
async function findStock(stock) {
  return await Stock.findOne({ symbol: stock }).exec();
}

module.exports = function (app) {
  app.route('/api/stock-prices').get(async function (req, res) {
    const { stock, like } = req.query;

    if (Array.isArray(stock)) {
      try {
        const [firstStockInfo, secondStockInfo] = await Promise.all([
          getStock(stock[0]),
          getStock(stock[1])
        ]);

        const [firstSavedStock, secondSavedStock] = await Promise.all([
          saveStock(stock[0], like, req.ip),
          saveStock(stock[1], like, req.ip)
        ]);

        res.json({
          stockData: [
            {
              stock: firstStockInfo.symbol,
              price: firstStockInfo.latestPrice,
              rel_likes: firstSavedStock.likes.length - secondSavedStock.likes.length
            },
            {
              stock: secondStockInfo.symbol,
              price: secondStockInfo.latestPrice,
              rel_likes: secondSavedStock.likes.length - firstSavedStock.likes.length
            }
          ]
        });
      } catch (error) {
        console.error('Error during stock processing:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
      }
    } else {
      try {
        const { symbol, latestPrice } = await getStock(stock);
        const savedStock = await saveStock(stock, like, req.ip);

        res.json({
          stockData: {
            stock: symbol,
            price: latestPrice,
            likes: savedStock.likes.length
          }
        });
      } catch (error) {
        console.error('Error during stock processing:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
      }
    }
  });
};

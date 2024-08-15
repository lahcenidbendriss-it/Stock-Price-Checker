const mongoose = require('mongoose');
const { Schema } = mongoose; // Ensure you destructure Schema correctly from mongoose

const StockSchema = new Schema({
  symbol: { type: String, required: true },
  latestPrice: { type: Number, required: true },
  likes: { type: Number, default: 0 },
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;


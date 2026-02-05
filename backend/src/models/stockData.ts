import mongoose from 'mongoose';

const stockDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['NIFTY50', 'NIFTY100', 'ETF'],
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  open: Number,
  high: Number,
  low: Number,
  previousClose: Number,
  change: Number,
  changePercent: Number,
  volume: Number,
  marketCap: Number,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
stockDataSchema.index({ category: 1, timestamp: -1 });
stockDataSchema.index({ symbol: 1, timestamp: -1 });

export default mongoose.model('StockData', stockDataSchema);

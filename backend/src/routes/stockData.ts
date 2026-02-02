import express from 'express';
import {
  getStockData,
  getLatestStockData,
  getStockBySymbol,
  manualScrape,
  getScraperStatus
} from '../controllers/stockData';

const router = express.Router();

// ✅ SPECIFIC ROUTES FIRST (MUST come before :symbol dynamic route)
// These match your frontend API_ENDPOINTS.STOCK.NIFTY50 and API_ENDPOINTS.STOCK.ETF
router.get('/stocks/nifty50', async (req, res) => {
  req.query.category = 'NIFTY50';
  return getLatestStockData(req, res);
});

router.get('/stocks/etf', async (req, res) => {
  req.query.category = 'ETF';
  return getLatestStockData(req, res);
});

// General routes
router.get('/stocks/latest', getLatestStockData);
router.get('/stocks', getStockData);

// Admin routes
router.post('/stocks/scrape', manualScrape);
router.get('/scraper/status', getScraperStatus);

// ⚠️ CRITICAL: Dynamic :symbol route MUST BE LAST
// Otherwise it catches /stocks/nifty50 and /stocks/etf as symbols
router.get('/stocks/:symbol', getStockBySymbol);

export default router;

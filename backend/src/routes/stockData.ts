import express from 'express';
import {
  getStockData,
  getLatestStockData,
  getStockBySymbol,
  manualScrape,
  getScraperStatus
} from '../controllers/stockData';

const router = express.Router();

// Public routes (can add auth middleware later)
router.get('/stocks', getStockData);
router.get('/stocks/latest', getLatestStockData);
router.get('/stocks/:symbol', getStockBySymbol);

// Admin routes (protect with auth middleware)
router.post('/stocks/scrape', manualScrape);
router.get('/scraper/status', getScraperStatus);

export default router;

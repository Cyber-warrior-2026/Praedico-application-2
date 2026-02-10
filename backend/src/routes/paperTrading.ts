import express from 'express';
// ✅ Import all controllers by name to ensure they are defined
import {
  executePaperTrade,
  getTradeHistory,
  getPortfolio,
  getTradingStats,
  getAIStockAnalysis,
  getAIPortfolioAnalysis,
  getTradingInsights,
  resetVirtualBalance
} from '../controllers/paperTrading';

// ✅ Import Guards & Middleware
import { authorize } from '../common/guards/role.guard'; 
import { 
  stockRecommendationLimiter, 
  portfolioLimiter 
} from '../common/middlewares/rateLimiter.middleware';

const router = express.Router();

// ============================================
// PAPER TRADING ROUTES
// ============================================

// 1. Trade Execution
router.post(
  '/trade',
  authorize(['user', 'admin', 'super_admin']),
  executePaperTrade
);

// 2. History & Portfolio
router.get(
  '/trades',
  authorize(['user', 'admin', 'super_admin']),
  getTradeHistory
);

router.get(
  '/portfolio',
  authorize(['user', 'admin', 'super_admin']),
  getPortfolio
);

router.get(
  '/stats',
  authorize(['user', 'admin', 'super_admin']),
  getTradingStats
);

// 3. AI Endpoints
router.get(
  '/ai/analysis/:symbol',
  authorize(['user', 'admin', 'super_admin']),
  stockRecommendationLimiter,
  getAIStockAnalysis
);

router.get(
  '/ai/portfolio-analysis',
  authorize(['user', 'admin', 'super_admin']),
  portfolioLimiter,
  getAIPortfolioAnalysis
);

router.get(
  '/ai/insights',
  authorize(['user', 'admin', 'super_admin']),
  getTradingInsights
);

// 4. Settings
router.post(
  '/reset-balance',
  authorize(['user', 'admin', 'super_admin']),
  resetVirtualBalance
);

export default router;
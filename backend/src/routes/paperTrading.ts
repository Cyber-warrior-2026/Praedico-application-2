import express from 'express';
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
import { authorize } from '../common/guards/role.guard'; // Your auth guard
import { 
  stockRecommendationLimiter, 
  portfolioLimiter 
} from '../common/middlewares/rateLimiter.middleware';

const router = express.Router();

// ============================================
// PAPER TRADING ROUTES
// ============================================

// All routes require authentication (user, admin, or super_admin)
// Using your authorize guard with allowed roles

// Core Trading Endpoints
router.post(
  '/trade',
  authorize(['user', 'admin', 'super_admin']),
  executePaperTrade
);

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

router.post(
  '/reset-balance',
  authorize(['user', 'admin', 'super_admin']),
  resetVirtualBalance
);

// ============================================
// AI-POWERED TRADING ENDPOINTS
// ============================================

// Get AI analysis for a specific stock (with rate limiting)
router.get(
  '/ai/analysis/:symbol',
  authorize(['user', 'admin', 'super_admin']),
  stockRecommendationLimiter,
  getAIStockAnalysis
);

// Get AI portfolio analysis (with stricter rate limiting)
router.get(
  '/ai/portfolio-analysis',
  authorize(['user', 'admin', 'super_admin']),
  portfolioLimiter,
  getAIPortfolioAnalysis
);

// Get personalized trading insights
router.get(
  '/ai/insights',
  authorize(['user', 'admin', 'super_admin']),
  getTradingInsights
);

export default router;

import { Request, Response } from 'express';
import paperTradingService from '../services/paperTrading';
import aiTradingService from '../services/aiTrading';

// ✨ Helper to extract userId from token (supports both "id" and "userId")
const getUserId = (req: Request): string => {
  const user = (req as any).user;
  const userId = user?.userId || user?.id;
  console.log('🔍 Extracting userId:', { userId: user?.userId, id: user?.id, extracted: userId });
  return userId || '';
};

// ✨ Helper to extract auth token from cookies or Authorization header
const getAuthToken = (req: Request): string => {
  // 1. Try cookie first (how the frontend sends it)
  let token = req.cookies?.accessToken;
  // 2. Fallback to Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization
      : `Bearer ${req.headers.authorization}`;
  } else if (token) {
    token = `Bearer ${token}`;
  }
  return token || '';
};

// Execute a paper trade
export const executePaperTrade = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const { 
      symbol, 
      type, 
      quantity, 
      orderType = 'MARKET',
      limitPrice,
      stopLossPrice,
      reason 
    } = req.body;

    // Validation
    if (!symbol || !type || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: symbol, type, quantity'
      });
    }

    if (!['BUY', 'SELL'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either BUY or SELL'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    // Validate reason/thesis (required for all trades, min 50 characters)
    if (!reason || typeof reason !== 'string' || reason.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'A trading reason/thesis is required (minimum 50 characters)'
      });
    }

    // Get AI recommendation before trade (optional)
    let aiAnalysis = null;
    try {
      const authToken = getAuthToken(req);
      aiAnalysis = await aiTradingService.getStockAnalysis(symbol, userId, authToken);
    } catch (error) {
      console.log('AI analysis failed, proceeding with trade');
    }

    // Execute trade
    const result = await paperTradingService.executeTrade(
      userId,
      symbol.toUpperCase(),
      type,
      quantity,
      orderType,
      limitPrice,
      stopLossPrice,
      reason.trim()
    );

    res.status(200).json({
      success: true,
      message: `${type} order executed successfully`,
      data: {
        ...result,
        aiRecommendation: aiAnalysis
      }
    });

  } catch (error: any) {
    console.error('Execute Trade Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to execute trade'
    });
  }
};

// Get trade history
export const getTradeHistory = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const { 
      symbol, 
      type, 
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50 
    } = req.query;

    const filters: any = {};
    if (symbol) filters.symbol = (symbol as string).toUpperCase();
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    filters.limit = parseInt(limit as string);
    filters.skip = (parseInt(page as string) - 1) * filters.limit;

    const result = await paperTradingService.getTradeHistory(userId, filters);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Get Trade History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trade history'
    });
  }
};

// Get portfolio
export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const portfolio = await paperTradingService.getPortfolio(userId);

    res.status(200).json({
      success: true,
      data: portfolio
    });

  } catch (error: any) {
    console.error('Get Portfolio Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio'
    });
  }
};

// Get trading statistics
export const getTradingStats = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const stats = await paperTradingService.getTradingStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Get Trading Stats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trading statistics'
    });
  }
};

// Get AI stock analysis
export const getAIStockAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const rawSymbol = req.params.symbol;

    if (!rawSymbol) {
      return res.status(400).json({
        success: false,
        message: "Stock symbol is required",
      });
    }

    // ✅ normalize
    const symbol = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;

    const authToken = getAuthToken(req);
    const analysis = await aiTradingService.getStockAnalysis(
      symbol.toUpperCase(),
      userId,
      authToken
    );

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error: any) {
    console.error('AI Analysis Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI analysis'
    });
  }
};

// Get AI portfolio analysis
export const getAIPortfolioAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const authToken = getAuthToken(req);
    const analysis = await aiTradingService.getPortfolioAnalysis(userId, authToken);

    res.status(200).json({
      success: true,
      data: { analysis }
    });

  } catch (error: any) {
    console.error('Portfolio Analysis Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate portfolio analysis'
    });
  }
};

// Get trading insights
export const getTradingInsights = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const authToken = getAuthToken(req);
    const insights = await aiTradingService.getTradingInsights(userId, authToken);

    res.status(200).json({
      success: true,
      data: insights
    });

  } catch (error: any) {
    console.error('Trading Insights Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate trading insights'
    });
  }
};

// Reset virtual balance
export const resetVirtualBalance = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const { newBalance = 100000 } = req.body;

    if (newBalance < 1000 || newBalance > 10000000) {
      return res.status(400).json({
        success: false,
        message: 'Balance must be between ₹1,000 and ₹1,00,00,000'
      });
    }

    const result = await paperTradingService.resetVirtualBalance(userId, newBalance);

    res.status(200).json({
      success: true,
      message: 'Virtual balance reset successfully',
      data: result
    });

  } catch (error: any) {
    console.error('Reset Balance Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reset virtual balance'
    });
  }
};

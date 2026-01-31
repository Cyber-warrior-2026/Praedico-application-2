import { Request, Response } from 'express';
import StockData from '../models/stockData';
import cronService from '../services/cronService';

export const getStockData = async (req: Request, res: Response) => {
  try {
    const { category, limit = 50 } = req.query;
    
    const query: any = {};
    if (category) {
      query.category = category;
    }
    
    const stocks = await StockData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .lean();
    
    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock data',
      error: error.message
    });
  }
};

export const getLatestStockData = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const pipeline: any[] = [
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$symbol',
          latestData: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestData' }
      },
      {
        $sort: { changePercent: -1 }
      }
    ];
    
    if (category) {
      pipeline.unshift({ $match: { category } });
    }
    
    const stocks = await StockData.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks,
      lastUpdated: stocks[0]?.timestamp || new Date()
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching latest stock data',
      error: error.message
    });
  }
};

export const getStockBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    const stock = await StockData.findOne({ symbol })
      .sort({ timestamp: -1 })
      .lean();
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: stock
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock',
      error: error.message
    });
  }
};

export const manualScrape = async (req: Request, res: Response) => {
  try {
    await cronService.runScraperNow();
    
    res.status(200).json({
      success: true,
      message: 'Manual scraping initiated'
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error triggering manual scrape',
      error: error.message
    });
  }
};

export const getScraperStatus = async (req: Request, res: Response) => {
  try {
    const status = cronService.getJobStatus();
    
    const lastUpdate = await StockData.findOne()
      .sort({ timestamp: -1 })
      .select('timestamp')
      .lean();
    
    res.status(200).json({
      success: true,
      status,
      lastUpdate: lastUpdate?.timestamp || null
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error getting scraper status',
      error: error.message
    });
  }
};

import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../constants';
import {
  Stock,
  StockListResponse,
  StockDetailResponse,
  ScraperStatusResponse,
  ManualScrapeResponse,
} from '../types/stock.types';

// Stock API Service
export const stockApi = {
  // Get all latest stocks (both Nifty50 and ETF)
  getAllLatestStocks: async (): Promise<StockListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.STOCK.ALL_LATEST);
    return response.data;
  },

  // Get Nifty 50 stocks only
  getNifty50Stocks: async (): Promise<StockListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.STOCK.NIFTY50);
    return response.data;
  },

  // Get ETF stocks only
  getETFStocks: async (): Promise<StockListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.STOCK.ETF);
    return response.data;
  },

  // Get specific stock by symbol
  getStockBySymbol: async (symbol: string): Promise<StockDetailResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.STOCK.BY_SYMBOL(symbol));
    return response.data;
  },

  // Get scraper status
  getScraperStatus: async (): Promise<ScraperStatusResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.STOCK.SCRAPER_STATUS);
    return response.data;
  },

  // Manual trigger scraper (admin only)
  triggerManualScrape: async (): Promise<ManualScrapeResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.STOCK.MANUAL_SCRAPE);
    return response.data;
  },
};

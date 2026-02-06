import axios from 'axios';
import * as cheerio from 'cheerio';
import StockData from '../models/stockData';

class StockScraperService {
  
  private nseBaseUrl = 'https://www.nseindia.com/api';
  private cookies = ''; // Store the session cookies here

  // Headers must match a real browser EXACTLY
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': 'https://www.nseindia.com/market-data/live-equity-market'
  };

  // ✅ FIX 1: Capture and Store Cookies
  async initSession() {
    try {
      const response = await axios.get('https://www.nseindia.com', { 
        headers: this.headers 
      });
      
      // Extract cookies from the response headers
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        this.cookies = setCookie.join('; ');
        console.log('✅ NSE Session Initialized with cookies');
      }
    } catch (error) {
      console.error('Failed to initialize NSE session:', error);
    }
  }

  // ✅ FIX 2: Helper to get headers with cookies
  private getAuthHeaders() {
    return {
      ...this.headers,
      'Cookie': this.cookies // Attach the stored cookie
    };
  }

  async scrapeNifty50(): Promise<any[]> {
    try {
      if (!this.cookies) await this.initSession();
      
      const response = await axios.get(
        `${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%2050`,
        { headers: this.getAuthHeaders() } // Use authenticated headers
      );

      // Validate data structure before mapping
      const stocksData = response.data?.data;
      if (!Array.isArray(stocksData)) {
        // If cookies expired, retry once
        console.log("Session expired, re-initializing...");
        await this.initSession();
        const retryResponse = await axios.get(
            `${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%2050`,
            { headers: this.getAuthHeaders() }
        );
        return this.formatNiftyData(retryResponse.data?.data || []);
      }

      const formattedData = this.formatNiftyData(stocksData);
      console.log(`Scraped ${formattedData.length} Nifty 50 stocks`);
      return formattedData;
      
    } catch (error: any) {
      console.error('Error scraping Nifty 50:', error.message);
      return [];
    }
  }

  // Extracted formatter for cleanliness
  private formatNiftyData(data: any[]) {
      /**
       * PROFESSIONAL DATA-DRIVEN FILTERING
       * 
       * Instead of hardcoding symbols, we filter based on NSE API metadata:
       * 1. series === 'EQ' means it's an equity stock (not ETF, not index)
       * 2. Exclude the index summary row (symbol === index name like "NIFTY 50")
       * 3. Exclude any non-traded instruments
       * 
       * This approach automatically adapts when the Nifty 50 index changes.
       */
      const filteredData = data.filter((stock: any) => {
        const symbol = (stock.symbol || '').trim();
        const series = (stock.series || '').toUpperCase();
        
        // Skip the index summary row (NSE returns the index itself as a row)
        if (symbol.includes('NIFTY') || symbol.includes('INDEX')) {
          return false;
        }
        
        // Only include equity stocks (series = 'EQ')
        // NSE uses 'EQ' for regular equity, 'BE' for trade-to-trade, etc.
        // If series is not provided, we check other indicators
        if (series && series !== 'EQ') {
          return false;
        }
        
        // Exclude known non-stock instruments by pattern
        // These are ETFs, funds, and other derivative products
        const nonStockPatterns = ['ETF', 'BEES', 'LIQUID', 'GILT', 'GOLD', 'SILVER'];
        if (nonStockPatterns.some(p => symbol.toUpperCase().includes(p))) {
          return false;
        }
        
        // Must have a valid price (real stocks have prices)
        if (!stock.lastPrice || parseFloat(stock.lastPrice) <= 0) {
          return false;
        }
        
        return true;
      });
      
      return filteredData.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.companyName || stock.symbol,
        category: 'NIFTY50',
        price: parseFloat(stock.lastPrice) || 0,
        open: parseFloat(stock.open) || 0,
        high: parseFloat(stock.dayHigh) || 0,
        low: parseFloat(stock.dayLow) || 0,
        previousClose: parseFloat(stock.previousClose) || 0,
        change: parseFloat(stock.change) || 0,
        changePercent: parseFloat(stock.pChange) || 0,
        volume: parseInt(stock.totalTradedVolume) || 0,
        marketCap: parseFloat(stock.totalTradedValue) || 0,
        timestamp: new Date(),
        lastUpdated: new Date()
      }));
  }

  async scrapeNifty100(): Promise<any[]> {
    try {
      if (!this.cookies) await this.initSession();
      
      const response = await axios.get(
        `${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%20100`,
        { headers: this.getAuthHeaders() }
      );

      // Validate data structure before mapping
      const stocksData = response.data?.data;
      if (!Array.isArray(stocksData)) {
        // If cookies expired, retry once
        console.log("Session expired, re-initializing...");
        await this.initSession();
        const retryResponse = await axios.get(
            `${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%20100`,
            { headers: this.getAuthHeaders() }
        );
        return this.formatNifty100Data(retryResponse.data?.data || []);
      }

      const formattedData = this.formatNifty100Data(stocksData);
      console.log(`Scraped ${formattedData.length} Nifty 100 stocks`);
      return formattedData;
      
    } catch (error: any) {
      console.error('Error scraping Nifty 100:', error.message);
      return [];
    }
  }

  // Formatter for Nifty100 data
  private formatNifty100Data(data: any[]) {
      return data.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.symbol,
        category: 'NIFTY100',
        price: parseFloat(stock.lastPrice) || 0,
        open: parseFloat(stock.open) || 0,
        high: parseFloat(stock.dayHigh) || 0,
        low: parseFloat(stock.dayLow) || 0,
        previousClose: parseFloat(stock.previousClose) || 0,
        change: parseFloat(stock.change) || 0,
        changePercent: parseFloat(stock.pChange) || 0,
        volume: parseInt(stock.totalTradedVolume) || 0,
        marketCap: parseFloat(stock.totalTradedValue) || 0,
        timestamp: new Date(),
        lastUpdated: new Date()
      }));
  }

  async scrapeETF(): Promise<any[]> {
    try {
      if (!this.cookies) await this.initSession();
      
      const response = await axios.get(
        `${this.nseBaseUrl}/etf`, // This endpoint is often more stable for ETFs
        { headers: this.getAuthHeaders() }
      );

      // NSE API data structure check
      let etfData = [];
      if (response.data && Array.isArray(response.data.data)) {
          etfData = response.data.data;
      } else if (Array.isArray(response.data)) {
          etfData = response.data;
      } else {
          throw new Error("Invalid ETF data structure received (likely 403 HTML page)"); 
      }
      
      const formattedData = this.formatETFData(etfData);
      console.log(`Scraped ${formattedData.length} ETFs`);
      return formattedData;

    } catch (error: any) {
      console.error('Error scraping ETF:', error.message);
      return [];
    }
  }

  private formatETFData(etfData: any[]): any[] {
    return etfData.map((etf: any) => ({
      symbol: etf.symbol,
      name: etf.meta?.companyName || etf.assets || etf.symbol,
      category: 'ETF',
      price: parseFloat(etf.ltP || etf.lastPrice) || 0,
      open: parseFloat(etf.open) || 0,
      high: parseFloat(etf.high) || 0,
      low: parseFloat(etf.low) || 0,
      previousClose: parseFloat(etf.prevClose) || 0,
      change: parseFloat(etf.chn) || 0,
      changePercent: parseFloat(etf.per) || 0,
      volume: parseInt(etf.qty) || 0,
      marketCap: parseFloat(etf.trdVal) || 0,
      timestamp: new Date(),
      lastUpdated: new Date()
    }));
  }

  // ... (Keep existing scrapeFromInvesting and saveStockData methods) ...
  // Ensure you include the rest of your class methods here
  
  // Save scraped data to database
// ... inside StockScraperService class

  // Save scraped data to database
  async saveStockData(stocksData: any[]): Promise<void> {
    try {
      if (stocksData.length === 0) {
        console.log('No stock data to save');
        return;
      }

      // FIX: Use 'insertMany' to APPEND data (creating history) 
      // instead of 'bulkWrite'/'updateOne' (which overwrites).
      await StockData.insertMany(stocksData);

      console.log(`Stock data saved: ${stocksData.length} new records created.`);
      
    } catch (error: any) {
      console.error('Error saving stock data:', error.message);
    }
  }
  

  // Main scraping function
  async scrapeAllStocks(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Starting stock data scraping...`);
      
      // Initialize session ONCE before parallel requests
      await this.initSession();

      // Scrape Nifty 50, Nifty 100, and ETF in parallel
      const [nifty50Data, nifty100Data, etfData] = await Promise.all([
        this.scrapeNifty50(),
        this.scrapeNifty100(),
        this.scrapeETF()
      ]);
      
      const allStocks = [...nifty50Data, ...nifty100Data, ...etfData];
      
      await this.saveStockData(allStocks);
      console.log(`[${new Date().toISOString()}] Scraping completed successfully`);
      console.log(`Summary: ${nifty50Data.length} Nifty50, ${nifty100Data.length} Nifty100, ${etfData.length} ETF stocks`);
      
    } catch (error: any) {
      console.error('Error in scrapeAllStocks:', error.message);
    }
  }
}

export default new StockScraperService();
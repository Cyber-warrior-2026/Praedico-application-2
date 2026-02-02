import axios from 'axios';
import * as cheerio from 'cheerio';
import StockData from '../models/stockData';

class StockScraperService {
  
  // NSE India API endpoint (more reliable than web scraping)
  private nseBaseUrl = 'https://www.nseindia.com/api';
  
  // Headers to mimic browser request
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  // Initialize session with NSE
  async initSession() {
    try {
      await axios.get('https://www.nseindia.com', { headers: this.headers });
      console.log('NSE session initialized');
    } catch (error) {
      console.error('Failed to initialize NSE session:', error);
    }
  }

  // Scrape Nifty 50 stocks from NSE API
  async scrapeNifty50(): Promise<any[]> {
    try {
      await this.initSession();
      
      const response = await axios.get(
        `${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%2050`,
        { headers: this.headers }
      );

      const stocksData = response.data.data || [];
      
      const formattedData = stocksData.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.symbol, // Can be enhanced with full company name
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

      console.log(`Scraped ${formattedData.length} Nifty 50 stocks`);
      return formattedData;
      
    } catch (error: any) {
      console.error('Error scraping Nifty 50:', error.message);
      return [];
    }
  }

  // Scrape ETF data from NSE
// Scrape ETF data from NSE
async scrapeETF(): Promise<any[]> {
  try {
    await this.initSession();
    
    // ✅ Use correct NSE ETF endpoint
    const response = await axios.get(
      `${this.nseBaseUrl}/live-analysis-variations?index=etf`,
      { headers: this.headers }
    );

    const etfData = response.data.data || [];
    
    const formattedData = etfData.map((etf: any) => ({
      symbol: etf.symbol || etf.meta?.symbol,
      name: etf.symbol || etf.meta?.companyName || etf.symbol,
      category: 'ETF',
      // ✅ Try multiple field names (NSE uses different names for ETFs)
      price: parseFloat(etf.lastPrice || etf.ltp || etf.ltP || etf.last) || 0,
      open: parseFloat(etf.open || etf.openPrice) || 0,
      high: parseFloat(etf.dayHigh || etf.high || etf.highPrice) || 0,
      low: parseFloat(etf.dayLow || etf.low || etf.lowPrice) || 0,
      previousClose: parseFloat(etf.previousClose || etf.prevClose || etf.previousPrice) || 0,
      change: parseFloat(etf.change || etf.netChange) || 0,
      changePercent: parseFloat(etf.pChange || etf.perChange || etf.percentChange) || 0,
      volume: parseInt(etf.totalTradedVolume || etf.volume || etf.totalVolume) || 0,
      marketCap: parseFloat(etf.totalTradedValue || etf.totalValue) || 0,
      timestamp: new Date(),
      lastUpdated: new Date()
    }));

    // ✅ Log first item to see structure
    if (formattedData.length > 0) {
      console.log('Sample ETF data:', JSON.stringify(formattedData[0], null, 2));
    }

    console.log(`Scraped ${formattedData.length} ETFs`);
    return formattedData;
  } catch (error: any) {
    console.error('Error scraping ETF:', error.message);
    
    // ✅ FALLBACK: Try alternative endpoint
    try {
      console.log('Trying alternative ETF endpoint...');
      await this.initSession();
      
      const response = await axios.get(
        'https://www.nseindia.com/api/etf',
        { headers: this.headers }
      );
      
      const etfData = response.data.data || response.data || [];
      console.log(`Alternative endpoint returned ${etfData.length} ETFs`);
      
      // Log raw structure to see what fields are available
      if (etfData.length > 0) {
        console.log('Raw ETF structure:', JSON.stringify(etfData[0], null, 2));
      }
      
      return this.formatETFData(etfData);
    } catch (fallbackError: any) {
      console.error('Fallback ETF scraping also failed:', fallbackError.message);
      return [];
    }
  }
}

// Helper function to format ETF data
// Helper function to format ETF data
private formatETFData(etfData: any[]): any[] {
  return etfData.map((etf: any) => ({
    symbol: etf.symbol,
    name: etf.meta?.companyName || etf.assets || etf.symbol,
    category: 'ETF',
    // ✅ Use correct NSE ETF field names
    price: parseFloat(etf.ltP || etf.lastPrice) || 0,  // ltP = Last Traded Price
    open: parseFloat(etf.open) || 0,
    high: parseFloat(etf.high) || 0,
    low: parseFloat(etf.low) || 0,
    previousClose: parseFloat(etf.prevClose) || 0,
    change: parseFloat(etf.chn) || 0,  // chn = change
    changePercent: parseFloat(etf.per) || 0,  // per = percentage
    volume: parseInt(etf.qty) || 0,  // qty = quantity/volume
    marketCap: parseFloat(etf.trdVal) || 0,  // trdVal = traded value
    timestamp: new Date(),
    lastUpdated: new Date()
  }));
}



  // Alternative: Scrape from Investing.com (backup method)
  async scrapeFromInvesting(): Promise<any[]> {
    try {
      const response = await axios.get(
        'https://www.investing.com/indices/s-p-cnx-nifty-components',
        { headers: this.headers }
      );
      
      const $ = cheerio.load(response.data);
      const stocks: any[] = [];
      
      $('#cr1 tbody tr').each((index, element) => {
        const $row = $(element);
        
        const symbol = $row.find('td:nth-child(2)').text().trim();
        const name = $row.find('td:nth-child(2)').text().trim();
        const price = parseFloat($row.find('td:nth-child(3)').text().replace(/,/g, '')) || 0;
        const change = parseFloat($row.find('td:nth-child(5)').text().replace(/,/g, '')) || 0;
        const changePercent = parseFloat($row.find('td:nth-child(6)').text().replace(/%/g, '')) || 0;
        
        if (symbol) {
          stocks.push({
            symbol,
            name,
            category: 'NIFTY50',
            price,
            change,
            changePercent,
            timestamp: new Date(),
            lastUpdated: new Date()
          });
        }
      });
      
      console.log(`Scraped ${stocks.length} stocks from Investing.com`);
      return stocks;
      
    } catch (error: any) {
      console.error('Error scraping Investing.com:', error.message);
      return [];
    }
  }

  // Save scraped data to database
  async saveStockData(stocksData: any[]): Promise<void> {
    try {
      if (stocksData.length === 0) {
        console.log('No stock data to save');
        return;
      }

      // Bulk insert/update operations
      const operations = stocksData.map(stock => ({
        updateOne: {
          filter: { 
            symbol: stock.symbol, 
            category: stock.category 
          },
          update: { $set: stock },
          upsert: true
        }
      }));

      const result = await StockData.bulkWrite(operations);
      console.log(`Stock data saved: ${result.upsertedCount} new, ${result.modifiedCount} updated`);
      
    } catch (error: any) {
      console.error('Error saving stock data:', error.message);
    }
  }

  // Main scraping function
  async scrapeAllStocks(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Starting stock data scraping...`);
      
      // Scrape Nifty 50 and ETF in parallel
      const [nifty50Data, etfData] = await Promise.all([
        this.scrapeNifty50(),
        this.scrapeETF()
      ]);
      
      const allStocks = [...nifty50Data, ...etfData];
      
      // Save to database
      await this.saveStockData(allStocks);
      
      console.log(`[${new Date().toISOString()}] Scraping completed successfully`);
      
    } catch (error: any) {
      console.error('Error in scrapeAllStocks:', error.message);
    }
  }
}

export default new StockScraperService();

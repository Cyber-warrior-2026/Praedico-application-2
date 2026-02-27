import * as cron from 'node-cron';
import stockScraperService from './stockScraper';
import newsScraperService from './newsScraper';
import tradingLevelService from './tradingLevel';
class CronService {
  private scraperJob: cron.ScheduledTask | null = null;
  private newsScraperJob: cron.ScheduledTask | null = null;
  private tradingLevelJob: cron.ScheduledTask | null = null;
  // Check if current day is weekday (Monday-Friday)
  private isWeekday(): boolean {
    const day = new Date().getDay();
    return day >= 1 && day <= 5; // 1=Monday, 5=Friday
  }

  // Check if market hours (9:15 AM to 3:30 PM IST)
  private isMarketHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;
    
    const marketOpen = 9 * 60;  // 9:00 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    return currentTime >= marketOpen && currentTime <= marketClose;
  }

  // Start the scraper cron job
  startScraperJob(): void {
    // Run every 1 minutes on weekdays during market hours
    // Cron format: */1 * * * 1-5 means every 1 minutes, Monday-Friday
    this.scraperJob = cron.schedule('*/1 * * * 1-5', async () => {
      
      if (!this.isWeekday()) {
        console.log('Skipping: Weekend detected');
        return;
      }
      
      if (!this.isMarketHours()) {
        console.log('Skipping: Outside market hours');
        return;
      }
      
      // Run the scraper
      await stockScraperService.scrapeAllStocks();
      
    }, {
      timezone: 'Asia/Kolkata'
    });

    // ensure the task is started
    this.scraperJob.start();

    console.log('Stock scraper cron job started (every 1 minutes on weekdays)');
  }

   // ✅ START NEWS SCRAPER JOB (ADD THIS METHOD)
  startNewsScraperJob(): void {
    // Run every 30 minutes, 24/7 (news is published anytime)
    // Cron format: */30 * * * * means every 30 minutes
    this.newsScraperJob = cron.schedule('*/30 * * * *', async () => {
      console.log('Running news scraper...');
      await newsScraperService.scrapeAllNews();
    }, {
      timezone: 'Asia/Kolkata'
    });

    this.newsScraperJob.start();
    console.log('News scraper cron job started (every 30 minutes)');
  }

  // ✅ MANUAL TRIGGER FOR NEWS (ADD THIS METHOD)
  async runNewsScraperNow(): Promise<void> {
    console.log('Manual news scraper triggered');
    await newsScraperService.scrapeAllNews();
  }

  // ✅ STOP NEWS SCRAPER (ADD THIS METHOD)
  stopNewsScraperJob(): void {
    if (this.newsScraperJob) {
      this.newsScraperJob.stop();
      console.log('News scraper cron job stopped');
    }
  }

  // Manual trigger for testing
  async runScraperNow(): Promise<void> {
    console.log('Manual scraper triggered');
    await stockScraperService.scrapeAllStocks();
  }

  // Stop the cron job
  stopScraperJob(): void {
    if (this.scraperJob) {
      this.scraperJob.stop();
      console.log('Stock scraper cron job stopped');
    }
  }

  // Get job status
  getJobStatus(): string {
    return this.scraperJob ? 'Running' : 'Stopped';
  }

  // ─── Trading Level Evaluation Job ────────────────────────────────────

  // Start the trading level cron job (daily at 4:00 PM IST, weekdays)
  startTradingLevelJob(): void {
    // Cron: minute 0, hour 16, every day, Mon-Fri
    this.tradingLevelJob = cron.schedule('0 16 * * 1-5', async () => {
      if (!this.isWeekday()) {
        console.log('[TradingLevel] Skipping: Weekend detected');
        return;
      }
      console.log('[TradingLevel] Daily evaluation triggered (4:00 PM IST)');
      await tradingLevelService.evaluateAllActiveUsers();
    }, {
      timezone: 'Asia/Kolkata'
    });

    this.tradingLevelJob.start();
    console.log('🏆 Trading Level cron job started (daily at 4:00 PM IST, weekdays)');
  }

  // Manual trigger for testing
  async runTradingLevelNow(): Promise<void> {
    console.log('[TradingLevel] Manual evaluation triggered');
    await tradingLevelService.evaluateAllActiveUsers();
  }

  // Stop the trading level job
  stopTradingLevelJob(): void {
    if (this.tradingLevelJob) {
      this.tradingLevelJob.stop();
      console.log('🏆 Trading Level cron job stopped');
    }
  }
}

export default new CronService();

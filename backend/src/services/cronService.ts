import * as cron from 'node-cron';
import stockScraperService from './stockScraper';

class CronService {
  private scraperJob: cron.ScheduledTask | null = null;

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
}

export default new CronService();

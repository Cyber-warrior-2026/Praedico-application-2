import * as cron from 'node-cron';
import stockScraperService from './stockScraper';
import newsScraperService from './newsScraper';
import { OrganizationModel } from '../models/organization';
import { OrganizationAdminModel } from '../models/organizationAdmin';
import { sendSubscriptionExpiryEmail } from './email';

class CronService {
  private scraperJob: cron.ScheduledTask | null = null;
  private newsScraperJob: cron.ScheduledTask | null = null;
  private subscriptionJob: cron.ScheduledTask | null = null;

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

  // ✅ START SUBSCRIPTION EXPIRY CHECKER
  startSubscriptionExpiryJob(): void {
    // Run once a day at 9:00 AM IST
    this.subscriptionJob = cron.schedule('0 9 * * *', async () => {
      console.log('Running daily subscription expiry check...');
      await this.checkSubscriptions();
    }, {
      timezone: 'Asia/Kolkata'
    });

    this.subscriptionJob.start();
    console.log('Subscription cron job started (runs daily at 9:00 AM IST)');
  }

  // ✅ MANUAL TRIGGER FOR SUBSCRIPTION CHECK 
  async checkSubscriptionsNow(): Promise<void> {
    console.log('Manual subscription check triggered');
    await this.checkSubscriptions();
  }

  // The actual check logic
  private async checkSubscriptions() {
    try {
      // Find active organizations that have a physical expiry date
      const activeOrgs = await OrganizationModel.find({
        isActive: true,
        isDeleted: { $ne: true },
        subscriptionExpiry: { $exists: true, $ne: null }
      });

      const today = new Date();
      // Normalize today to start of day for exact day comparison
      today.setHours(0, 0, 0, 0);

      for (const org of activeOrgs) {
        if (!org.subscriptionExpiry || !org.subscriptionPlan) continue;

        const expiry = new Date(org.subscriptionExpiry);
        // Normalize expiry to start of day
        expiry.setHours(0, 0, 0, 0);

        // Calculate differences in days
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // We want to send emails exactly at 7 days, 1 day, and 0 days
        if (diffDays === 7 || diffDays === 1 || diffDays === 0) {
          // Find admins to email
          const admins = await OrganizationAdminModel.find({
            organization: org._id,
            isActive: true,
            isDeleted: false
          });

          if (admins.length === 0) continue;

          // Format date like 'Oct 24, 2026'
          const dateStr = expiry.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

          // Send to all admins
          for (const admin of admins) {
            await sendSubscriptionExpiryEmail(
              admin.email,
              org.organizationName,
              diffDays,
              org.subscriptionPlan,
              dateStr
            );
          }
          console.log(`Sent ${diffDays}-day reminder to admins of ${org.organizationName}`);
        }
      }
    } catch (error) {
      console.error('Error checking subscriptions:', error);
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
}

export default new CronService();

import * as cron from 'node-cron';
import stockScraperService from './stockScraper';
import newsScraperService from './newsScraper';
import { OrganizationModel } from '../models/organization';
import { OrganizationAdminModel } from '../models/organizationAdmin';
import { sendSubscriptionExpiryEmail } from './email';
import tradingLevelService from './tradingLevel';
import certificateService from './certificateService';
import { UserModel } from '../models/user';
import { CertificateModel } from '../models/certificate';

class CronService {
  private scraperJob: cron.ScheduledTask | null = null;
  private newsScraperJob: cron.ScheduledTask | null = null;
  private subscriptionJob: cron.ScheduledTask | null = null;
  private tradingLevelJob: cron.ScheduledTask | null = null;
  private certificateJob: cron.ScheduledTask | null = null;
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

  // ─── Certificate Generation Job ────────────────────────────────────

  // Start certificate job (runs daily at 1:00 AM IST)
  startCertificateJob(): void {
    // Cron: minute 0, hour 1, every day
    this.certificateJob = cron.schedule('0 1 * * *', async () => {
      console.log('Running daily certificate generation check (1:00 AM IST)...');
      await this.generateCertificatesForExpiredPlans();
    }, {
      timezone: 'Asia/Kolkata'
    });

    this.certificateJob.start();
    console.log('🎓 Certificate cron job started (runs daily at 1:00 AM IST)');
  }

  // Manual trigger for testing
  async runCertificateJobNow(): Promise<void> {
    console.log('Manual certificate generation triggered');
    await this.generateCertificatesForExpiredPlans();
  }

  // Stop the certificate job
  stopCertificateJob(): void {
    if (this.certificateJob) {
      this.certificateJob.stop();
      console.log('🎓 Certificate cron job stopped');
    }
  }

  private async generateCertificatesForExpiredPlans() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      // We need everything that expired exactly 'yesterday'
      // Meaning expiry > yesterday 00:00 and expiry < yesterday 23:59
      const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
      const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

      console.log(`Checking expirations between ${startOfYesterday.toISOString()} and ${endOfYesterday.toISOString()}`);

      // --- 1. Independent Users ---
      const individualUsers = await UserModel.find({
        organization: null,
        isActive: true,
        isDeleted: false,
        subscriptionExpiry: {
          $gte: startOfYesterday,
          $lte: endOfYesterday
        }
      });

      for (const user of individualUsers) {
        // Skip if they already have one generated for this expiry date (prevent duplicates)
        const existingCert = await CertificateModel.findOne({
          user: user._id,
          endDate: {
            $gte: startOfYesterday,
            $lte: endOfYesterday
          }
        });

        if (!existingCert && user.subscriptionExpiry && user.currentPlan) {
          // Determine the start date (for now we assume 1 year or 1 month before expiry, here we assume it's created at `createdAt` if we don't have explicit plan start date, falling back to 30 days ago)
          let startDate = (user as any).createdAt || new Date();
          if (user.subscriptionExpiry) {
               startDate = new Date(user.subscriptionExpiry.getTime() - 30 * 24 * 60 * 60 * 1000); // Approximate 1 month back if nothing else
          }

          await certificateService.generateCertificate({
            userId: user._id.toString(),
            userName: user.name,
            planName: user.currentPlan,
            startDate: startDate,
            endDate: user.subscriptionExpiry
          });
        }
      }

      // --- 2. Organization Students ---
      const expiredOrgs = await OrganizationModel.find({
        isActive: true,
        isDeleted: false,
        subscriptionExpiry: {
          $gte: startOfYesterday,
          $lte: endOfYesterday
        }
      });

      for (const org of expiredOrgs) {
        // Find all active students in this org
        const students = await UserModel.find({
          organization: org._id,
          role: 'user',
          isActive: true,
          isDeleted: false
        });

        for (const student of students) {
          const existingCert = await CertificateModel.findOne({
            user: student._id,
            organization: org._id,
            endDate: {
              $gte: startOfYesterday,
              $lte: endOfYesterday
            }
          });

          if (!existingCert && org.subscriptionExpiry && org.subscriptionPlan) {
            let startDate = (org as any).createdAt || new Date();
            if (org.subscriptionExpiry) {
                 // Assume org plan was 1 year or similar, approximate to 30 days or based on createdAt
                 startDate = new Date(org.subscriptionExpiry.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 year back
                 if (startDate < ((org as any).createdAt || new Date(0))) startDate = (org as any).createdAt; 
            }

            await certificateService.generateCertificate({
              userId: student._id.toString(),
              organizationId: org._id.toString(),
              userName: student.name,
              planName: org.subscriptionPlan,
              startDate: startDate,
              endDate: org.subscriptionExpiry,
              organizationLogoUrl: org.logoUrl
            });
          }
        }
      }

    } catch (error) {
      console.error('Error generating certificates for expired plans:', error);
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

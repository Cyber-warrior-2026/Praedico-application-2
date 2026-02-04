import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay';
import { ENV } from '../config/env';

export class PaymentService {
  /**
   * Creates a subscription link for a specific Plan ID.
   * @param planId - The Plan ID generated in Razorpay Dashboard
   */
  static async createSubscription(planId: string, customerId?: string) {
    try {
      // 1. Create subscription
      const subscription = await razorpayInstance.subscriptions.create({
        plan_id: planId,
        total_count: 12, // Billing cycles (e.g., 1 year if monthly)
        quantity: 1,
        customer_notify: 1, // Razorpay notifies customer
        // customer_id: customerId, // Optional: if you already have a Razorpay customer ID
      });

      return subscription;
    } catch (error) {
      console.error("[PaymentService] Error creating subscription:", error);
      throw new Error("Failed to create subscription initialization");
    }
  }

  /**
   * Verifies the authenticity of the payment signature returned by frontend.
   * This is CRITICAL for security.
   */
  static verifyPaymentSignature(
    paymentId: string, 
    subscriptionId: string, 
    signature: string
  ): boolean {
    const data = `${paymentId}|${subscriptionId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', ENV.razorpay.keySecret)
      .update(data)
      .digest('hex');

    return expectedSignature === signature;
  }
}
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment';
import { ENV } from '../config/env';
import { UserModel } from '../models/user';
import crypto from 'crypto';

interface AuthRequest extends Request {
  user?: any; // or IUser if you have the interface
}

/**
 * INIT SUBSCRIPTION
 * Route: POST /api/payments/subscribe
 */
export const initiateSubscription = async (req: Request, res: Response) => {
  try {
    // In a real app, 'planId' might come from your DB based on a simpler 'planName' (e.g. "PRO")
    const { planId } = req.body; 
    
    // NOTE: In production, map "Pro" -> plan_L7... inside backend to avoid client manipulation
    // const planMapping = { 'Pro': 'plan_xyz...', 'Team': 'plan_abc...' }
    // const realPlanId = planMapping[planId]

    if (!planId) {
       return res.status(400).json({ success: false, message: "Plan ID is required" });
    }

    const subscription = await PaymentService.createSubscription(planId);

    // Return the ID to frontend so it can open the checkout modal
    return res.status(200).json({
      success: true,
      subscriptionId: subscription.id,
      keyId: ENV.razorpay.keyId // Frontend needs this to open the SDK
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * VERIFY PAYMENT
 * Route: POST /api/payments/verify
 */
export const verifySubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planName } = req.body;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const isValid = PaymentService.verifyPaymentSignature(
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    // UPDATE USER SUBSCRIPTION
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Mock 1 year, or calc based on API response

    await UserModel.findByIdAndUpdate(userId, {
        subscriptionId: razorpay_subscription_id,
        subscriptionStatus: 'active',
        currentPlan: planName || 'Pro',
        subscriptionExpiry: expiryDate
    });

    return res.status(200).json({ success: true, message: "Payment Verified & Subscription Activated" });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * WEBHOOK HANDLER
 * Route: POST /api/payments/webhook
 */

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const secret = ENV.razorpay.webhookSecret;
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!secret || !signature) {
      return res.status(400).json({ success: false, message: "Missing Secret or Signature" });
    }

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error("Webhook Signature Mismatch");
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    const event = req.body;
    console.log("Webhook Event:", event.event);

    if (event.event === 'subscription.charged') {
      const subscriptionId = event.payload.subscription.entity.id;
      // const paymentId = event.payload.payment.entity.id;
      
      // Calculate new expiry (e.g., +1 month or +1 year based on plan)
      // For simplicity, we just extend by 30 days or fetch plan details
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 30); 

      // Update User
      await UserModel.findOneAndUpdate(
        { subscriptionId: subscriptionId },
        { 
          subscriptionStatus: 'active',
          subscriptionExpiry: newExpiry
        }
      );
      console.log(`Subscription Renewed: ${subscriptionId}`);
    } 
    else if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
      const subscriptionId = event.payload.subscription.entity.id;
      await UserModel.findOneAndUpdate(
        { subscriptionId: subscriptionId },
        { subscriptionStatus: 'cancelled' }
      );
       console.log(`Subscription Cancelled: ${subscriptionId}`);
    }

    res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
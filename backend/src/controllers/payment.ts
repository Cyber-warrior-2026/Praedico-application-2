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
 * INIT TRIAL SUBSCRIPTION (7 Days)
 * Route: POST /api/payments/trial
 */
export const initiateTrial = async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!planId) return res.status(400).json({ success: false, message: "Plan ID is required" });

    // Check if user already used trial
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.hasUsedTrial) {
      return res.status(403).json({ success: false, message: "You have already used your free trial." });
    }

    // Trial Start: Now + 7 Days
    const startAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

    const subscription = await PaymentService.createSubscription(planId, startAt);

    return res.status(200).json({
      success: true,
      subscriptionId: subscription.id,
      keyId: ENV.razorpay.keyId,
      isTrial: true
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
    const { isTrial } = req.body;
    
    // Calculate expiry
    let expiryDate = new Date();
    if (isTrial) {
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 Day Trial
    } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Default 1 year (or depend on plan)
    }

    // Prepare update object
    const updateData: any = {
        subscriptionId: razorpay_subscription_id,
        subscriptionStatus: isTrial ? 'on_trial' : 'active',
        currentPlan: planName || 'Pro',
        subscriptionExpiry: expiryDate
    };

    if (isTrial) {
        updateData.isOnTrial = true;
        updateData.hasUsedTrial = true;
        updateData.trialEndDate = expiryDate;
    }

    await UserModel.findByIdAndUpdate(userId, updateData);

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

    // 1. VALIDATE SIGNATURE
    if (!secret) {
      console.error('[WEBHOOK] Webhook secret not configured in environment');
      return res.status(500).json({ success: false, message: "Webhook secret not configured" });
    }

    if (!signature) {
      console.error('[WEBHOOK] Missing x-razorpay-signature header');
      return res.status(400).json({ success: false, message: "Missing signature header" });
    }

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[WEBHOOK] Signature verification failed');
      console.error('[WEBHOOK] Expected:', expectedSignature);
      console.error('[WEBHOOK] Received:', signature);
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 2. PARSE EVENT
    const event = req.body;
    const eventType = event.event;

    if (!eventType) {
      console.error('[WEBHOOK] Event type missing in payload');
      return res.status(400).json({ success: false, message: "Invalid event payload" });
    }

    console.log(`[WEBHOOK] Received event: ${eventType}`);

    // 3. HANDLE DIFFERENT EVENT TYPES
    if (eventType === 'subscription.charged') {
      const subscriptionId = event.payload?.subscription?.entity?.id;
      
      if (!subscriptionId) {
        console.error('[WEBHOOK] Missing subscription ID in subscription.charged event');
        return res.status(400).json({ success: false, message: "Invalid payload structure" });
      }

      // Calculate expiry based on billing period
      const currentPeriodEnd = event.payload.subscription.entity.current_end 
        ? new Date(event.payload.subscription.entity.current_end * 1000) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const updatedUser = await UserModel.findOneAndUpdate(
        { subscriptionId: subscriptionId },
        { 
          subscriptionStatus: 'active',
          subscriptionExpiry: currentPeriodEnd,
          isOnTrial: false // Clear trial status on charge
        },
        { new: true }
      );

      if (!updatedUser) {
        console.warn(`[WEBHOOK] No user found with subscriptionId: ${subscriptionId}`);
      } else {
        console.log(`[WEBHOOK] ✓ Subscription renewed for user ${updatedUser._id} (Plan: ${updatedUser.currentPlan})`);
        console.log(`[WEBHOOK] New expiry: ${currentPeriodEnd.toISOString()}`);
      }
    } 
    else if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted' || eventType === 'subscription.completed') {
      const subscriptionId = event.payload?.subscription?.entity?.id;
      
      if (!subscriptionId) {
        console.error(`[WEBHOOK] Missing subscription ID in ${eventType} event`);
        return res.status(400).json({ success: false, message: "Invalid payload structure" });
      }

      // Reset user to Free plan when subscription ends
      const updatedUser = await UserModel.findOneAndUpdate(
        { subscriptionId: subscriptionId },
        { 
          subscriptionStatus: 'cancelled',
          currentPlan: 'Free',
          subscriptionExpiry: new Date(),
          isOnTrial: false
        },
        { new: true }
      );

      if (!updatedUser) {
        console.warn(`[WEBHOOK] No user found with subscriptionId: ${subscriptionId}`);
      } else {
        console.log(`[WEBHOOK] ✓ Subscription ${eventType} for user ${updatedUser._id}`);
        console.log(`[WEBHOOK] User downgraded to Free plan`);
      }
    }
    else if (eventType === 'subscription.authenticated' || eventType === 'subscription.activated') {
      const subscriptionId = event.payload?.subscription?.entity?.id;
      if (subscriptionId) {
        await UserModel.findOneAndUpdate(
          { subscriptionId: subscriptionId },
          { subscriptionStatus: 'active' }
        );
        console.log(`[WEBHOOK] Subscription ${eventType}: ${subscriptionId}`);
      }
    }
    else {
      console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ success: true, event: eventType });

  } catch (error: any) {
    console.error('[WEBHOOK] Error processing webhook:', error.message);
    console.error('[WEBHOOK] Stack:', error.stack);
    
    // Still return 200 to prevent Razorpay from retrying on application errors
    return res.status(200).json({ success: false, error: 'Internal processing error' });
  }
};
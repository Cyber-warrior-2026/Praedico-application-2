import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';

export interface VerifyPaymentData {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
  planName: string;
  isTrial: boolean;
}

export const paymentApi = {
  // Start a regular subscription
  subscribe: async (planId: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT.SUBSCRIBE, { planId });
    return response.data;
  },

  // Start a trial
  trial: async (planId: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT.TRIAL, { planId });
    return response.data;
  },

  // Verify the payment/subscription after Razorpay closes
  verify: async (data: VerifyPaymentData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT.VERIFY, data);
    return response.data;
  }
};
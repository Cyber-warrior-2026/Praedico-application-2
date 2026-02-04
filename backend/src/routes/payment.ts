import { Router } from 'express';
import { initiateSubscription, verifySubscription, handleWebhook, initiateTrial } from '../controllers/payment';
import { authorize } from '../common/guards/role.guard';

const router = Router();

// Endpoint to start the payment flow
// Protected route: Only logged-in users should be able to subscribe
router.post('/subscribe', authorize(['user', 'admin', 'super_admin']), initiateSubscription);

// Endpoint to start 7-Day Trial
router.post('/trial', authorize(['user', 'admin', 'super_admin']), initiateTrial);

// Endpoint to verify payment success
router.post('/verify', authorize(['user', 'admin', 'super_admin']), verifySubscription);

// Endpoint for Razorpay Webhooks (Public but Secured by Signature)
router.post('/webhook', handleWebhook);

export default router;
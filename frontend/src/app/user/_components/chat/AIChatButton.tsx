"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import AIChatModal from './AIChatModal';
import PremiumFeatureModal from '../PremiumFeatureModal';
import axiosInstance from '@/lib/axios';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data } = await axiosInstance.get('/api/users/me');
      if (data.success && data.user) {
        // User has access if Plan is NOT Free OR they are on Trial
        const isPremium = data.user.currentPlan !== 'Free';
        const isTrial = data.user.isOnTrial;
        setHasAccess(isPremium || isTrial);
      }
    } catch (error) {
      console.error('Failed to check user plan:', error);
      // Default to no access on error
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (loading) return; // Prevent click while loading status

    if (hasAccess) {
      setIsOpen(true);
    } else {
      setShowPremiumModal(true);
    }
  };

  if (loading) return null; // Or render a skeleton/spinner

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <MessageCircle className="w-6 h-6" />

        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
      </button>

      {/* Chat Modal (Only opens if authorized) */}
      <AIChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Premium Lock Modal (Opens if unauthorized) */}
      <PremiumFeatureModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}

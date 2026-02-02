'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AIChatModal from './AIChatModal';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
      </button>

      {/* Chat Modal */}
      <AIChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

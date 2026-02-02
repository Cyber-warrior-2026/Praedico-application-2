'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Trash2, Loader2, Sparkles, MessageSquare, 
  TrendingUp, PieChart, BarChart 
} from 'lucide-react';
import { chatApi, ChatMessage as ChatMessageType } from '@/lib/api/chat.api';
import ChatMessage from './ChatMessage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatModal({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const [showStockAnalysis, setShowStockAnalysis] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [portfolioBudget, setPortfolioBudget] = useState('');
  const [portfolioRisk, setPortfolioRisk] = useState<'low' | 'medium' | 'high'>('medium');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await chatApi.getChatHistory(50);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend || loading) return;

    if (!messageText) {
      setInput('');
    }
    setLoading(true);

    const tempUserMessage: ChatMessageType = {
      _id: Date.now().toString(),
      userId: 'temp',
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await chatApi.sendMessage(textToSend);

      const aiMessage: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'assistant',
        content: response.data.message,
        timestamp: response.data.timestamp,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAnalysis = async () => {
    if (!stockSymbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setShowStockAnalysis(false);

    const userMessage: ChatMessageType = {
      _id: Date.now().toString(),
      userId: 'temp',
      role: 'user',
      content: `Analyze ${stockSymbol.toUpperCase()} stock`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatApi.analyzeStock(stockSymbol.toUpperCase());

      const aiMessage: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'assistant',
        content: response.data.analysis,
        timestamp: response.data.timestamp,
        metadata: {
          queryType: 'stock_analysis',
          stockSymbol: stockSymbol.toUpperCase(),
        },
      };
      setMessages((prev) => [...prev, aiMessage]);
      setStockSymbol('');
    } catch (error: any) {
      console.error('Failed to analyze stock:', error);
      const errorMessage: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'assistant',
        content: `Failed to analyze ${stockSymbol.toUpperCase()}. ${error.response?.data?.message || 'Please check the symbol and try again.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioRecommendation = async () => {
    const budget = parseFloat(portfolioBudget);
    
    if (!budget || budget <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    setShowPortfolio(false);

    const userMessage: ChatMessageType = {
      _id: Date.now().toString(),
      userId: 'temp',
      role: 'user',
      content: `Recommend portfolio for ₹${budget.toLocaleString('en-IN')} with ${portfolioRisk} risk`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatApi.recommendPortfolio(budget, portfolioRisk);

      const aiMessage: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'assistant',
        content: response.data.recommendation,
        timestamp: response.data.timestamp,
        metadata: {
          queryType: 'portfolio_recommendation',
        },
      };
      setMessages((prev) => [...prev, aiMessage]);
      setPortfolioBudget('');
      setPortfolioRisk('medium');
    } catch (error: any) {
      console.error('Failed to get portfolio recommendation:', error);
      const errorMessage: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'assistant',
        content: `Failed to generate portfolio recommendation. ${error.response?.data?.message || 'Please try again.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Are you sure you want to clear your chat history?')) return;

    try {
      await chatApi.clearChatHistory();
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
      alert('Failed to clear chat history');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ NEW: Quick action handler for instant message sending
  const handleQuickAction = (message: string) => {
    handleSend(message);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* ✅ FIXED: Modal with proper spacing from navbar */}
      <div className="fixed top-20 left-0 right-0 bottom-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-5xl h-full max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto animate-in zoom-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Stock Assistant</h3>
                <p className="text-sm text-white/80">Ask me anything about Indian stock markets</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleClearChat}
                className="p-2.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-blue-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h4>
                <p className="text-gray-500 max-w-md mb-6">
                  Ask me about stocks, get AI analysis, or portfolio recommendations!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickAction('What is Nifty 50?')}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
                  >
                    What is Nifty 50?
                  </button>
                  <button
                    onClick={() => handleQuickAction('Tell me about TCS')}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm transition-colors"
                  >
                    About TCS
                  </button>
                  <button
                    onClick={() => setShowStockAnalysis(true)}
                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm transition-colors"
                  >
                    Analyze a Stock
                  </button>
                  <button
                    onClick={() => setShowPortfolio(true)}
                    className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm transition-colors"
                  >
                    Portfolio Advice
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message._id} message={message} />
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="px-4 py-2.5 bg-gray-200 rounded-2xl rounded-tl-sm">
                      <p className="text-sm text-gray-600">Analyzing...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Special Actions Bar */}
          <div className="border-t bg-white px-5 py-3 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setShowStockAnalysis(!showStockAnalysis)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                <TrendingUp className="w-4 h-4" />
                Analyze Stock
              </button>
              <button
                onClick={() => setShowPortfolio(!showPortfolio)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                <PieChart className="w-4 h-4" />
                Portfolio Advice
              </button>
              {/* ✅ FIXED: Top Gainers now directly sends message */}
              <button
                onClick={() => handleQuickAction('What are the top Nifty 50 gainers today?')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm transition-colors whitespace-nowrap disabled:opacity-50"
              >
                <BarChart className="w-4 h-4" />
                Top Gainers
              </button>
            </div>

            {/* Stock Analysis Form */}
            {showStockAnalysis && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg animate-in slide-in-from-top duration-200">
                <h4 className="font-semibold text-blue-900 mb-3">Stock Analysis</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter stock symbol (e.g., RELIANCE, TCS)"
                    className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleStockAnalysis()}
                  />
                  <button
                    onClick={handleStockAnalysis}
                    disabled={loading || !stockSymbol.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Analyze
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Get AI-powered analysis including risk level, performance, and investment suitability
                </p>
              </div>
            )}

            {/* Portfolio Recommendation Form */}
            {showPortfolio && (
              <div className="mt-3 p-4 bg-purple-50 rounded-lg animate-in slide-in-from-top duration-200">
                <h4 className="font-semibold text-purple-900 mb-3">Portfolio Recommendation</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Investment Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={portfolioBudget}
                      onChange={(e) => setPortfolioBudget(e.target.value)}
                      placeholder="e.g., 50000"
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Risk Tolerance
                    </label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((risk) => (
                        <button
                          key={risk}
                          onClick={() => setPortfolioRisk(risk)}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            portfolioRisk === risk
                              ? 'bg-purple-500 text-white'
                              : 'bg-white text-purple-700 hover:bg-purple-100'
                          }`}
                        >
                          {risk.charAt(0).toUpperCase() + risk.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handlePortfolioRecommendation}
                    disabled={loading || !portfolioBudget}
                    className="w-full px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Get Recommendation
                  </button>
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  Get diversified portfolio suggestions based on your budget and risk profile
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white p-5 rounded-b-2xl flex-shrink-0">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about stocks, markets, or investment concepts..."
                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

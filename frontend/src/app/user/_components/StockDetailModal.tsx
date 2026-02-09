"use client";

import { X, TrendingUp, TrendingDown, Activity, BarChart3, History, LayoutDashboard, LineChart, Briefcase, Lock } from "lucide-react";
import { Stock } from "@/lib/types/stock.types";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stockApi } from "@/lib/api";

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
}

type ModalTab = 'overview' | 'history' | 'chart' | 'trading';

export default function StockDetailModal({ isOpen, onClose, stock }: StockDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [historyData, setHistoryData] = useState<Stock[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch history when tab changes to 'history'
  useEffect(() => {
    if (activeTab === 'history' && stock && historyData.length === 0) {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          const response = await stockApi.getStockHistory(stock.symbol);
          if (response.success) {
            setHistoryData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch history", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab, stock, historyData.length]);

  // TradingView Widget Integration
  useEffect(() => {
    if (activeTab === 'chart' && stock && containerRef.current) {
      containerRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      // User requested to search directly with stock name/symbol without exchange prefix
      // This allows TradingView's smart search to find the best match (usually NSE/BSE for Indian IP)
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": stock.symbol,
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": isDark ? "dark" : "light",
        "style": "1",
        "locale": "in", // Changed to 'in' for better Indian market context
        "enable_publishing": false,
        "backgroundColor": isDark ? "rgba(10, 10, 10, 1)" : "rgba(255, 255, 255, 1)",
        "backgroundColor": "rgba(15, 23, 42, 1)",
        "gridColor": "rgba(30, 41, 59, 0.5)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "hide_volume": false,
        "support_host": "https://www.tradingview.com"
      });
      containerRef.current.appendChild(script);
    }
  }, [activeTab, stock]);

  // Auth check for Trading tab
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // simple check for token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    }
  }, []);

  if (!isOpen || !stock) return null;

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const bgChangeColor = isPositive ? "bg-emerald-500/10" : "bg-rose-500/10";
  const borderChangeColor = isPositive ? "border-emerald-500/20" : "border-rose-500/20";

  // Calculate price position in day's range
  const priceRangePercent = ((stock.price - stock.low) / (stock.high - stock.low)) * 100;

  const tabs = [
    { id: 'overview' as ModalTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'history' as ModalTab, label: 'Historical Data', icon: History },
    { id: 'chart' as ModalTab, label: 'TradingView Chart', icon: LineChart },
    { id: 'trading' as ModalTab, label: 'Trading', icon: Briefcase },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 w-full max-w-5xl h-[90vh] flex flex-col pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="shrink-0 p-6 sm:p-8 border-b border-slate-800 bg-slate-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600`}>
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        {stock.symbol}
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${borderChangeColor} ${bgChangeColor} ${changeColor}`}>
                          {stock.category}
                        </span>
                      </h2>
                      <p className="text-slate-400 font-medium mt-1">{stock.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-4xl font-bold text-white mb-1">
                      ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center justify-end gap-2 ${changeColor} font-bold text-lg`}>
                      {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                      <span>({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-2 mt-8 overflow-x-auto pb-1 custom-scrollbar-dark">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                                relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                                ${isActive ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                            `}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        {tab.id === 'trading' && !isLoggedIn && (
                          <Lock className="w-3 h-3 ml-1 text-amber-500" />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="modalTabInfo"
                            className="absolute inset-0 border-2 border-indigo-500/30 rounded-xl"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-6 sm:p-8 bg-slate-950/50">

                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Price Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Open</div>
                        <div className="text-xl font-bold text-white">₹{stock.open.toFixed(2)}</div>
                      </div>
                      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Prev. Close</div>
                        <div className="text-xl font-bold text-white">₹{stock.previousClose.toFixed(2)}</div>
                      </div>
                      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Day High</div>
                        <div className="text-xl font-bold text-emerald-400">₹{stock.high.toFixed(2)}</div>
                      </div>
                      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Day Low</div>
                        <div className="text-xl font-bold text-rose-400">₹{stock.low.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Range Bar */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                      <div className="flex justify-between text-sm font-medium text-slate-400 mb-3">
                        <span>Day's Range</span>
                        <span>{priceRangePercent.toFixed(1)}%</span>
                      </div>
                      <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${priceRangePercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                        <span>₹{stock.low}</span>
                        <span>₹{stock.high}</span>
                      </div>
                    </div>

                    {/* Trading Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-slate-500 text-xs font-bold uppercase mb-1">Total Volume</div>
                          <div className="text-2xl font-bold text-white">{stock.volume.toLocaleString()}</div>
                        </div>
                        <Activity className="w-8 h-8 text-indigo-500/50" />
                      </div>
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-slate-500 text-xs font-bold uppercase mb-1">Traded Value</div>
                          <div className="text-2xl font-bold text-white">₹{(stock.marketCap / 10000000).toFixed(2)} Cr</div>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-500/50" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. HISTORY TAB */}
                {activeTab === 'history' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    {loadingHistory ? (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <Activity className="w-8 h-8 animate-bounce mb-2 text-indigo-500" />
                        Loading history...
                      </div>
                    ) : historyData.length === 0 ? (
                      <div className="text-center py-20 text-slate-500">
                        No historical data available.
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-slate-800">
                        <table className="w-full text-left text-sm text-slate-400">
                          <thead className="bg-slate-900 text-slate-200 uppercase text-xs font-bold">
                            <tr>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Price</th>
                              <th className="px-6 py-4 text-right">Open</th>
                              <th className="px-6 py-4 text-right">High</th>
                              <th className="px-6 py-4 text-right">Low</th>
                              <th className="px-6 py-4 text-right">Change</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                            {historyData.map((item) => {
                              const isPos = item.change >= 0;
                              return (
                                <tr key={item._id} className="hover:bg-slate-800/50 transition-colors">
                                  <td className="px-6 py-4 font-mono text-slate-300">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold text-white">₹{item.price.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right">₹{item.open.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right text-emerald-400">₹{item.high.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right text-rose-400">₹{item.low.toFixed(2)}</td>
                                  <td className={`px-6 py-4 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {item.changePercent.toFixed(2)}%
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. CHART TAB (TradingView) */}
                {activeTab === 'chart' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col"
                  >
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex-1 min-h-[600px]">
                      <div className="w-full h-full" ref={containerRef} />
                    </div>
                  </motion.div>
                )}

                {/* 4. TRADING TAB */}
                {activeTab === 'trading' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    {!isLoggedIn ? (
                      <div className="max-w-md p-8 bg-slate-900 rounded-3xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-slate-950 shadow-xl group-hover:scale-110 transition-transform duration-500">
                            <Lock className="w-10 h-10 text-indigo-500" />
                          </div>

                          <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
                          <p className="text-slate-400 mb-8 leading-relaxed">
                            You need to be logged in to access premium trading features. Join Praedico to start trading stocks instantly.
                          </p>

                          <a
                            href="/"
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-1"
                          >
                            Log In Now
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-md p-8 bg-slate-900 rounded-3xl border border-slate-800">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 mx-auto rotate-12">
                          <Briefcase className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                        <p className="text-slate-400">
                          Our advanced trading terminal is currently in development. Stay tuned for updates!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}


              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 text-center text-xs text-slate-500">
                Last updated: {new Date(stock.timestamp).toLocaleString()} • Data provided by NSE
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

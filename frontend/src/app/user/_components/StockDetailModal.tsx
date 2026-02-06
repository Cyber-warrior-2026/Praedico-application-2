"use client";

import { TrendingUp, TrendingDown, Activity, BarChart3, History, LayoutDashboard, LineChart, Briefcase, Lock, Clock } from "lucide-react";
import { Stock } from "@/lib/types/stock.types";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stockApi } from "@/lib/api";

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  theme?: 'light' | 'dark'; // <--- NEW PROP ADDED
}

type ModalTab = 'overview' | 'history' | 'chart' | 'trading';

export default function StockDetailModal({ isOpen, onClose, stock, theme = 'dark' }: StockDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [historyData, setHistoryData] = useState<Stock[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark'; // Helper to switch styles

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
      setActiveTab('overview');
      setChartLoaded(false); 
    };
  }, [isOpen, onClose]);

  // Fetch history logic
  useEffect(() => {
    if (activeTab === 'history' && stock && historyData.length === 0) {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          const response = await stockApi.getStockHistory(stock.symbol);
          if (response.success) setHistoryData(response.data);
        } catch (error) {
          console.error("Failed to fetch history", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab, stock, historyData.length]);

  // TradingView Logic
  useEffect(() => {
    if (activeTab === 'chart' && !chartLoaded && stock && containerRef.current) {
      containerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": stock.symbol,
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": isDark ? "dark" : "light", // <--- DYNAMIC THEME
        "style": "1",
        "locale": "in",
        "enable_publishing": false,
        "backgroundColor": isDark ? "rgba(10, 10, 10, 1)" : "rgba(255, 255, 255, 1)", // <--- DYNAMIC BG
        "gridColor": isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": false,
        "support_host": "https://www.tradingview.com"
      });
      containerRef.current.appendChild(script);
      setChartLoaded(true);
    }
  }, [activeTab, chartLoaded, stock, isDark]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    }
  }, []);

  if (!isOpen || !stock) return null;

  const isPositive = stock.change >= 0;
  const priceRangePercent = ((stock.price - stock.low) / (stock.high - stock.low)) * 100;

  const tabs = [
    { id: 'overview' as ModalTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'chart' as ModalTab, label: 'Live Chart', icon: LineChart },
    { id: 'history' as ModalTab, label: 'History', icon: History },
    { id: 'trading' as ModalTab, label: 'Trade', icon: Briefcase },
  ];

  // --- STYLE VARIABLES ---
  const styles = {
    bg: isDark ? 'bg-[#0A0A0A]' : 'bg-white',
    backdrop: isDark ? 'bg-[#050505]/80' : 'bg-slate-200/60',
    border: isDark ? 'border-white/[0.08]' : 'border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
    cardBg: isDark ? 'bg-white/[0.02]' : 'bg-slate-50',
    cardHover: isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-100',
    inputBg: isDark ? 'bg-white/[0.03]' : 'bg-white',
    divider: isDark ? 'divide-white/[0.05]' : 'divide-slate-200',
    headerBorder: isDark ? 'border-white/[0.06]' : 'border-slate-100',
    footerBorder: isDark ? 'border-white/[0.06]' : 'border-slate-100',
    tabActive: isDark ? 'text-white' : 'text-indigo-600 bg-indigo-50',
    tabInactive: isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Click to Close) */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`fixed inset-0 backdrop-blur-md z-[200] ${styles.backdrop}`}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className={`relative ${styles.bg} rounded-[24px] border ${styles.border} shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col pointer-events-auto overflow-hidden ring-1 ring-black/5`}
              onClick={(e) => e.stopPropagation()}
            >
               {/* Noise Texture (Dark Mode Only) */}
               {isDark && <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />}

              {/* --- HEADER --- */}
              <div className={`shrink-0 p-6 sm:p-8 border-b ${styles.headerBorder} ${styles.bg} relative overflow-hidden z-10`}>
                {/* Header Glow (Dark Mode Only) */}
                {isDark && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />}
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    {/* Stock Logo */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl bg-gradient-to-br from-indigo-600 to-purple-600 ring-1 ring-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       {stock.symbol[0]}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className={`text-3xl font-bold ${styles.text} tracking-tight`}>{stock.symbol}</h2>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${styles.border} ${styles.cardBg} ${styles.textMuted} font-medium uppercase tracking-wider`}>
                          {stock.category}
                        </span>
                      </div>
                      <p className={`${styles.textMuted} text-sm font-medium mt-1 flex items-center gap-2`}>
                        {stock.name} 
                        <span className="opacity-30">•</span> 
                        <span className="text-xs opacity-70">NSE</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-4xl font-bold ${styles.text} mb-1 tabular-nums tracking-tight`}>
                      ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center justify-end gap-2 font-bold text-lg ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                      <span className="opacity-80 text-base">({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-1 mt-8 overflow-x-auto pb-1 custom-scrollbar-dark mask-linear-fade">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                            ${isActive ? styles.tabActive : styles.tabInactive}
                        `}
                      >
                        {isActive && isDark && (
                          <motion.div
                            layoutId="modalTab"
                            className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-lg shadow-sm"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-indigo-500' : ''}`} />
                        <span className="relative z-10">{tab.label}</span>
                        {tab.id === 'trading' && !isLoggedIn && <Lock className="w-3 h-3 ml-1 text-amber-500/80 relative z-10" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* --- CONTENT AREA --- */}
              <div className={`flex-1 overflow-y-auto custom-scrollbar-dark ${styles.bg} relative`}>
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 sm:p-8 space-y-6"
                  >
                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard label="Open" value={stock.open} styles={styles} />
                      <StatCard label="Prev. Close" value={stock.previousClose} styles={styles} />
                      <StatCard label="Day High" value={stock.high} color="text-emerald-500" styles={styles} />
                      <StatCard label="Day Low" value={stock.low} color="text-rose-500" styles={styles} />
                    </div>

                    {/* Range Bar */}
                    <div className={`${styles.cardBg} p-6 rounded-2xl border ${styles.border}`}>
                      <div className={`flex justify-between text-sm font-medium ${styles.textMuted} mb-4`}>
                        <span>Day's Range</span>
                        <span className={styles.text}>{priceRangePercent.toFixed(1)}%</span>
                      </div>
                      <div className={`h-2 ${isDark ? 'bg-white/[0.05]' : 'bg-slate-200'} rounded-full overflow-hidden relative`}>
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
                          style={{ width: `${priceRangePercent}%` }}
                        />
                      </div>
                      <div className={`flex justify-between text-xs ${styles.textMuted} mt-3 font-mono`}>
                        <span>L: ₹{stock.low.toFixed(2)}</span>
                        <span>H: ₹{stock.high.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Volume & Market Cap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailCard 
                        label="Total Volume" 
                        value={stock.volume.toLocaleString()} 
                        icon={Activity} 
                        subtext="Shares Traded"
                        styles={styles}
                      />
                      <DetailCard 
                        label="Traded Value" 
                        value={`₹${(stock.marketCap / 10000000).toFixed(2)} Cr`} 
                        icon={BarChart3} 
                        subtext="Estimated Turnover"
                        styles={styles}
                      />
                    </div>
                  </motion.div>
                )}

                {/* 2. HISTORY TAB */}
                {activeTab === 'history' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 sm:p-8">
                    {loadingHistory ? (
                      <div className={`flex flex-col items-center justify-center h-64 ${styles.textMuted}`}>
                        <Activity className="w-8 h-8 animate-bounce mb-3 text-indigo-500" />
                        <span className="text-sm font-medium">Retrieving archival data...</span>
                      </div>
                    ) : historyData.length === 0 ? (
                      <div className={`text-center py-20 ${styles.textMuted}`}>
                        <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        No historical data available.
                      </div>
                    ) : (
                      <div className={`overflow-hidden rounded-2xl border ${styles.border}`}>
                        <table className={`w-full text-left text-sm ${styles.textMuted}`}>
                          <thead className={`${styles.cardBg} ${styles.textMuted} uppercase text-[10px] font-bold tracking-wider`}>
                            <tr>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Price</th>
                              <th className="px-6 py-4 text-right">Open</th>
                              <th className="px-6 py-4 text-right">H / L</th>
                              <th className="px-6 py-4 text-right">Change</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${styles.divider}`}>
                            {historyData.map((item) => {
                              const isPos = item.change >= 0;
                              return (
                                <tr key={item._id} className={`${styles.cardHover} transition-colors`}>
                                  <td className={`px-6 py-4 font-mono text-xs ${styles.textMuted}`}>
                                    {new Date(item.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className={`px-6 py-4 text-right font-bold ${styles.text}`}>₹{item.price.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right">₹{item.open.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right text-xs">
                                    <span className="text-emerald-500/80">{item.high.toFixed(0)}</span> / <span className="text-rose-500/80">{item.low.toFixed(0)}</span>
                                  </td>
                                  <td className={`px-6 py-4 text-right font-bold ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
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

                {/* 3. CHART TAB (Persistent) */}
                <div className={`h-full w-full flex flex-col ${activeTab === 'chart' ? 'block' : 'hidden'}`}>
                    <div className={`flex-1 min-h-[500px] h-full ${isDark ? 'bg-black' : 'bg-white'}`}>
                       <div className="w-full h-full" ref={containerRef} />
                    </div>
                </div>

                {/* 4. TRADING TAB */}
                {activeTab === 'trading' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8"
                  >
                    {!isLoggedIn ? (
                      <div className={`max-w-md w-full p-8 ${styles.cardBg} rounded-3xl border ${styles.border} relative overflow-hidden group`}>
                        {isDark && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />}
                        
                        <div className={`w-16 h-16 ${isDark ? 'bg-slate-900' : 'bg-white shadow-md'} rounded-2xl flex items-center justify-center mb-6 border ${styles.border} mx-auto shadow-2xl`}>
                          <Lock className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className={`text-2xl font-bold ${styles.text} mb-2`}>Login Required</h3>
                        <p className={`${styles.textMuted} mb-8 text-sm leading-relaxed`}>
                            Access to the live trading terminal is restricted to verified members.
                        </p>
                        <a href="/" className="block w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/25">
                            Connect Account
                        </a>
                      </div>
                    ) : (
                      <div className={`max-w-md w-full p-10 ${styles.cardBg} rounded-3xl border ${styles.border} relative`}>
                         {isDark && <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />}
                        <div className={`w-16 h-16 ${isDark ? 'bg-slate-900' : 'bg-white shadow-md'} rounded-2xl flex items-center justify-center mb-6 border ${styles.border} mx-auto transform -rotate-6`}>
                          <Briefcase className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className={`text-xl font-bold ${styles.text} mb-2`}>Terminal Offline</h3>
                        <p className={`${styles.textMuted} text-sm`}>
                          The Praedico Trading Engine is currently undergoing scheduled maintenance for the V2 upgrade.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

              </div>

              {/* Footer */}
              <div className={`p-4 border-t ${styles.footerBorder} ${styles.bg} flex justify-between items-center text-[10px] ${styles.textMuted} z-10`}>
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Last update: {new Date(stock.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-1">
                    Data provided by <span className={`${styles.text} font-bold`}>NSE</span>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ label, value, color, styles }: { label: string, value: number, color?: string, styles: any }) {
    const textColor = color || styles.text;
    return (
        <div className={`${styles.cardBg} p-5 rounded-2xl border ${styles.border} ${styles.cardHover} transition-colors group`}>
            <div className={`${styles.textMuted} text-[10px] font-bold uppercase tracking-wider mb-2 group-hover:opacity-80 transition-opacity`}>{label}</div>
            <div className={`text-xl font-bold ${textColor} tabular-nums`}>₹{value.toFixed(2)}</div>
        </div>
    )
}

function DetailCard({ label, value, icon: Icon, subtext, styles }: { label: string, value: string, icon: any, subtext: string, styles: any }) {
    return (
        <div className={`${styles.cardBg} p-6 rounded-2xl border ${styles.border} flex items-center justify-between ${styles.cardHover} transition-colors`}>
            <div>
                <div className={`${styles.textMuted} text-[10px] font-bold uppercase tracking-wider mb-1`}>{label}</div>
                <div className={`text-2xl font-bold ${styles.text} tabular-nums tracking-tight mb-1`}>{value}</div>
                <div className={`text-xs ${styles.textMuted} font-medium`}>{subtext}</div>
            </div>
            <div className={`w-12 h-12 rounded-full ${styles.inputBg} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-indigo-500/80" />
            </div>
        </div>
    )
}
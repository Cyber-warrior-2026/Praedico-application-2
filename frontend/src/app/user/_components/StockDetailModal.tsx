"use client";

import { TrendingUp, TrendingDown, Activity, BarChart3, History, LayoutDashboard, LineChart, Briefcase, Lock, Clock, X } from "lucide-react";
import { Stock } from "@/lib/types/stock.types";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stockApi } from "@/lib/api";

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  theme?: 'light' | 'dark';
}

type ModalTab = 'overview' | 'history' | 'chart' | 'trading';

export default function StockDetailModal({ isOpen, onClose, stock, theme = 'dark' }: StockDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [historyData, setHistoryData] = useState<Stock[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Lock body scroll & Reset tab on close
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
        setActiveTab('overview');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Fetch History
  useEffect(() => {
    if (activeTab === 'history' && stock && historyData.length === 0) {
      setLoadingHistory(true);
      stockApi.getStockHistory(stock.symbol)
        .then(res => setHistoryData(res.data || []))
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [activeTab, stock, historyData.length]);

  // --- PEAK PERFORMANCE CHART LOADING ---
  // 1. Dependency Update: We removed 'activeTab' from dependencies.
  //    This runs immediately when 'stock.symbol' exists (on modal open).
  useEffect(() => {
    if (stock && containerRef.current) {
      // Clear container to prevent duplicate charts
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
        "theme": isDark ? "dark" : "light",
        "style": "1",
        "locale": "in",
        "enable_publishing": false,
        "backgroundColor": isDark ? "rgba(10, 10, 10, 1)" : "rgba(255, 255, 255, 1)",
        "hide_top_toolbar": true, 
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      });

      containerRef.current.appendChild(script);
    }
  }, [stock?.symbol, isDark]); // Only re-run if stock changes, not on tab switch

  if (!isOpen || !stock) return null;

  const isPositive = stock.change >= 0;
  const rangePercent = stock.high === stock.low 
    ? 50 
    : ((stock.price - stock.low) / (stock.high - stock.low)) * 100;

  const tabs = [
    { id: 'overview' as ModalTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'chart' as ModalTab, label: 'Live Chart', icon: LineChart },
    { id: 'history' as ModalTab, label: 'History', icon: History },
    { id: 'trading' as ModalTab, label: 'Trade', icon: Briefcase },
  ];

  const styles = {
    bg: isDark ? 'bg-[#0A0A0A]' : 'bg-white',
    text: isDark ? 'text-white' : 'text-slate-900',
    muted: isDark ? 'text-slate-500' : 'text-slate-500',
    border: isDark ? 'border-white/[0.08]' : 'border-slate-200',
    cardBg: isDark ? 'bg-white/[0.03]' : 'bg-slate-50',
    hover: isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-100'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
                relative w-full max-w-5xl h-[90vh] sm:h-[85vh] 
                rounded-t-[24px] sm:rounded-[24px] 
                ${styles.bg} border ${styles.border} shadow-2xl flex flex-col overflow-hidden
            `}
          >
            {/* Header Section */}
            <div className={`p-5 sm:p-8 border-b ${styles.border} relative shrink-0`}>
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 hidden sm:block text-slate-400">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg ring-1 ring-white/10">
                            {stock.symbol[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className={`text-2xl sm:text-3xl font-bold ${styles.text} tracking-tight`}>{stock.symbol}</h2>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-300 font-bold tracking-wider uppercase border border-white/5">
                                    {stock.category}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium truncate max-w-[200px] mt-0.5">
                                {stock.name} <span className="opacity-50 mx-1">•</span> NSE
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start">
                        <div className={`text-3xl sm:text-4xl font-bold ${styles.text} tabular-nums tracking-tight`}>
                            ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`flex items-center gap-2 font-bold text-sm sm:text-base ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                            <span className="opacity-80">({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-8 overflow-x-auto pb-1 no-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                                    ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-white/5'}
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar-dark relative">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Stats Components... (kept same as before) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            <StatCard label="Open" value={stock.open} styles={styles} />
                            <StatCard label="Prev. Close" value={stock.previousClose} styles={styles} />
                            <StatCard label="Day High" value={stock.high} color="text-emerald-500" styles={styles} />
                            <StatCard label="Day Low" value={stock.low} color="text-rose-500" styles={styles} />
                        </div>

                        <div className={`p-5 rounded-2xl border ${styles.border} ${styles.cardBg}`}>
                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-3">
                                <span className="uppercase tracking-wider font-bold">Day's Range</span>
                                <span className={styles.text}>{rangePercent.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                                <div 
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full" 
                                    style={{ width: `${rangePercent}%` }} 
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                                <span>L: ₹{stock.low.toFixed(2)}</span>
                                <span>H: ₹{stock.high.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                             <DetailCard 
                                label="Total Volume" 
                                value={stock.volume.toLocaleString()} 
                                subtext="Shares Traded"
                                icon={Activity}
                                styles={styles}
                             />
                             <DetailCard 
                                label="Traded Value" 
                                value={`₹${(stock.marketCap / 10000000).toFixed(2)} Cr`} 
                                subtext="Estimated Turnover"
                                icon={BarChart3}
                                styles={styles}
                             />
                        </div>
                    </motion.div>
                )}

                {/* 2. CHART TAB (PEAK PERFORMANCE MODE)
                   - Rendered ALWAYS (no conditional check).
                   - Uses "off-screen" technique (absolute + invisible) when inactive.
                   - This ensures the iframe has dimensions and loads fully in background.
                */}
                <div 
                    className={`
                        h-[400px] w-full rounded-2xl overflow-hidden border ${styles.border} 
                        ${isDark ? 'bg-[#111]' : 'bg-white'}
                        ${activeTab === 'chart' 
                            ? 'block relative' 
                            : 'absolute top-0 left-[-9999px] invisible' // Hide off-screen
                        }
                    `}
                >
                    <div className="w-full h-full" ref={containerRef} />
                </div>

                {/* 3. HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-500">
                            <thead className="bg-white/[0.03] font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-right">Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {historyData.map((item) => (
                                    <tr key={item._id} className={styles.hover}>
                                        <td className="px-4 py-3 font-mono">{new Date(item.timestamp).toLocaleDateString()}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${styles.text}`}>₹{item.price.toFixed(2)}</td>
                                        <td className={`px-4 py-3 text-right ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {item.changePercent.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {historyData.length === 0 && !loadingHistory && (
                            <div className="p-8 text-center text-slate-500 text-sm">No history available</div>
                        )}
                    </div>
                )}

                {/* 4. TRADING TAB */}
                {activeTab === 'trading' && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                        <Lock className="w-12 h-12 mb-4 text-slate-600" />
                        <h3 className={`text-lg font-bold ${styles.text}`}>Trading Offline</h3>
                        <p className="text-sm text-slate-500 mt-2">Market orders are currently disabled for this session.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${styles.border} ${styles.bg} flex justify-between items-center text-[10px] ${styles.muted} z-10`}>
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Last update: {new Date(stock.timestamp).toLocaleTimeString()}
                </div>
                <div>Data: NSE</div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ... Sub components (StatCard, DetailCard) remain same ...
function StatCard({ label, value, color, styles }: { label: string, value: number, color?: string, styles: any }) {
    const textColor = color || styles.text;
    return (
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.cardBg} ${styles.hover} transition-colors group`}>
            <div className={`${styles.muted} text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-slate-400 transition-colors`}>{label}</div>
            <div className={`text-lg font-bold ${textColor} tabular-nums tracking-tight`}>₹{value.toFixed(2)}</div>
        </div>
    )
}

function DetailCard({ label, value, icon: Icon, subtext, styles }: { label: string, value: string, icon: any, subtext: string, styles: any }) {
    return (
        <div className={`p-5 rounded-2xl border ${styles.border} ${styles.cardBg} flex items-center justify-between ${styles.hover} transition-colors`}>
            <div>
                <div className={`${styles.muted} text-[10px] font-bold uppercase tracking-wider mb-1`}>{label}</div>
                <div className={`text-2xl font-bold ${styles.text} tabular-nums tracking-tight mb-1`}>{value}</div>
                <div className={`text-[10px] ${styles.muted} font-medium`}>{subtext}</div>
            </div>
            <div className={`w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border ${styles.border}`}>
                <Icon className="w-5 h-5 text-indigo-500" />
            </div>
        </div>
    )
}
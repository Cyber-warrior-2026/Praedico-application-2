"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Search, TrendingUp, TrendingDown, RefreshCw, Activity, ArrowUpDown, LineChart, Layers, Zap, BarChart3, Filter } from "lucide-react";
import { stockApi } from "@/lib/api";
import { Stock } from "@/lib/types/stock.types";
import StockDetailModal from "@/app/user/_components/StockDetailModal";
import { motion, AnimatePresence } from "framer-motion";

type TabType = 'nifty50' | 'nifty100' | 'etf';

// --- 1. RESPONSIVE STOCK ROW ---
const StockRow = memo(({ stock, index, currentTabColor, onClick }: { stock: Stock, index: number, currentTabColor: string, onClick: (s: Stock) => void }) => {
    const isPositive = stock.change >= 0;
    const animationDelay = `${Math.min(index * 0.03, 0.4)}s`;

    return (
        <div
            onClick={() => onClick(stock)}
            style={{ animationDelay }}
            className="group relative border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-300 cursor-pointer animate-fade-in-up opacity-0 fill-mode-forwards"
        >
            {/* --- MOBILE VIEW (Card Layout) --- */}
            <div className="flex items-center justify-between p-4 md:hidden">
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs 
                        shadow-lg ring-1 ring-white/10 bg-gradient-to-br from-[#1a1f2e] to-[#0f1219]
                    `}>
                        <span className={`bg-gradient-to-br from-${currentTabColor}-400 to-${currentTabColor}-600 bg-clip-text text-transparent`}>
                            {stock.symbol[0]}
                        </span>
                    </div>
                    {/* Name & Symbol */}
                    <div>
                        <h3 className="font-bold text-slate-100 text-sm">{stock.symbol}</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate max-w-[100px]">{stock.name}</p>
                    </div>
                </div>

                {/* Price & Change */}
                <div className="text-right">
                    <div className="font-bold text-white text-sm mb-0.5">₹{stock.price.toFixed(2)}</div>
                    <span className={`
                        inline-flex items-center gap-1 text-[10px] font-bold
                        ${isPositive ? 'text-emerald-400' : 'text-rose-400'}
                    `}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* --- DESKTOP VIEW (Grid Table Layout) --- */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 items-center relative overflow-hidden">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                <div className="col-span-3 flex items-center gap-4 relative z-10">
                    <div className={`
                        w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm 
                        shadow-lg shadow-black/40 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300
                        bg-gradient-to-br from-[#1a1f2e] to-[#0f1219]
                    `}>
                        <span className={`bg-gradient-to-br from-${currentTabColor}-400 to-${currentTabColor}-600 bg-clip-text text-transparent`}>
                            {stock.symbol[0]}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors tracking-tight text-sm mb-0.5">{stock.symbol}</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest truncate max-w-[120px]">{stock.name}</p>
                    </div>
                </div>

                <div className="col-span-2 text-right font-medium text-slate-400 tabular-nums text-sm">₹{stock.open.toFixed(2)}</div>
                <div className="col-span-2 text-right font-medium text-slate-400 tabular-nums text-sm">₹{stock.high.toFixed(2)}</div>
                <div className="col-span-2 text-right font-medium text-slate-400 tabular-nums text-sm">₹{stock.low.toFixed(2)}</div>
                <div className="col-span-1 text-right font-bold text-white text-[15px] tabular-nums">₹{stock.price.toFixed(2)}</div>

                <div className="col-span-2 flex justify-end relative z-10">
                    <span className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold w-24 justify-center backdrop-blur-md transition-all duration-300
                        ${isPositive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20'}
                    `}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
});
StockRow.displayName = "StockRow";

export default function MarketsClient() {
    const [activeTab, setActiveTab] = useState<TabType>('nifty50');
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [sortBy, setSortBy] = useState<'symbol' | 'change'>('symbol');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    const fetchStocks = useCallback(async (tab: TabType) => {
        try {
            if (stocks.length === 0) setLoading(true);
            let response;
            switch (tab) {
                case 'nifty50': response = await stockApi.getNifty50Stocks(); break;
                case 'nifty100': response = await stockApi.getNifty100Stocks(); break;
                case 'etf': response = await stockApi.getETFStocks(); break;
            }
            setStocks(response.data);
            setLastUpdated(response.lastUpdated || new Date().toISOString());
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to fetch data`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setStocks([]); 
        setSearchQuery(""); 
        fetchStocks(activeTab);
    }, [activeTab, fetchStocks]);

    // Polling every 2 minutes
    useEffect(() => {
        const interval = setInterval(() => fetchStocks(activeTab), 120000);
        return () => clearInterval(interval);
    }, [activeTab, fetchStocks]);

    const processedStocks = useMemo(() => {
        let result = stocks.filter((stock) =>
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'symbol') comparison = a.symbol.localeCompare(b.symbol);
            else if (sortBy === 'change') comparison = a.changePercent - b.changePercent;
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [stocks, searchQuery, sortBy, sortOrder]);

    const handleStockClick = useCallback((stock: Stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    }, []);

    const toggleSort = useCallback((field: 'symbol' | 'change') => {
        setSortBy(prev => {
            if (prev === field) {
                setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                return prev;
            }
            setSortOrder('desc');
            return field;
        });
    }, []);

    const tabs = [
        { id: 'nifty50' as TabType, name: 'Nifty 50', icon: LineChart, color: 'blue' },
        { id: 'nifty100' as TabType, name: 'Nifty 100', icon: BarChart3, color: 'indigo' },
        { id: 'etf' as TabType, name: 'ETF', icon: Layers, color: 'purple' }
    ];

    const currentTab = tabs.find(t => t.id === activeTab)!;

    return (
        <div className="min-h-screen font-sans relative overflow-hidden bg-[#030303] text-slate-200 selection:bg-indigo-500/30">
            {/* Global Styles */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation-name: fadeInUp;
                    animation-duration: 0.5s;
                    animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .fill-mode-forwards { animation-fill-mode: forwards; }
                .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
            `}</style>

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#030303]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                
                {/* HEADER - Made Responsive */}
                <div className="flex flex-col items-center justify-center mb-10 md:mb-16 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-4"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Market</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-7xl font-medium text-white mb-4 tracking-tight">
                        Market <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">Pulse.</span>
                    </h1>
                    
                    <p className="text-slate-400 max-w-md text-sm md:text-lg font-light px-4">
                        Real-time data for India's leading indices.
                    </p>
                </div>

                {/* TABS - Horizontal Scroll on Mobile */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl overflow-x-auto max-w-full">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-300
                                        flex items-center gap-2 whitespace-nowrap
                                        ${isActive ? 'text-white shadow-lg bg-white/[0.08]' : 'text-slate-500 hover:text-slate-300'}
                                    `}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? `text-${tab.color}-400` : ''}`} />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* MAIN CARD */}
                <motion.div
                    layout
                    className="relative bg-[#0A0A0A]/60 backdrop-blur-3xl rounded-2xl md:rounded-[24px] border border-white/[0.06] shadow-2xl overflow-hidden ring-1 ring-white/[0.02]"
                >
                    {/* TOOLBAR */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/[0.03]">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-sm transition-all"
                                placeholder="Search symbol..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Synced</span>
                                <span className="text-xs font-mono text-slate-300">
                                    {lastUpdated ? new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                                </span>
                            </div>
                            <button
                                onClick={() => fetchStocks(activeTab)}
                                disabled={loading}
                                className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-indigo-400 border border-white/[0.05]"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {/* TABLE HEADERS - Hidden on Mobile */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#0A0A0A]/80 border-b border-white/[0.05] text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                        <div className="col-span-3 cursor-pointer flex items-center gap-1 hover:text-white" onClick={() => toggleSort('symbol')}>Symbol <ArrowUpDown className="w-2.5 h-2.5"/></div>
                        <div className="col-span-2 text-right">Open</div>
                        <div className="col-span-2 text-right">High</div>
                        <div className="col-span-2 text-right">Low</div>
                        <div className="col-span-1 text-right">Price</div>
                        <div className="col-span-2 text-right cursor-pointer flex justify-end gap-1 hover:text-white" onClick={() => toggleSort('change')}>Change <ArrowUpDown className="w-2.5 h-2.5"/></div>
                    </div>

                    {/* CONTENT LIST */}
                    <div className="min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar-dark relative">
                        {loading && stocks.length === 0 ? (
                            <div className="p-8 space-y-4 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-12 bg-white/[0.05] rounded-lg w-full" />
                                ))}
                            </div>
                        ) : processedStocks.length === 0 ? (
                            <div className="p-20 text-center text-slate-600 flex flex-col items-center">
                                <Filter className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm">No assets found</p>
                            </div>
                        ) : (
                            processedStocks.map((stock, i) => (
                                <StockRow 
                                    key={stock.symbol} 
                                    stock={stock} 
                                    index={i} 
                                    currentTabColor={currentTab.color}
                                    onClick={handleStockClick}
                                />
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            <StockDetailModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedStock(null); }}
                stock={selectedStock}
            />
        </div>
    );
}
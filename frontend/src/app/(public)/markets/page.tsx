"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, RefreshCw, Activity, ArrowUpDown, LineChart, Layers, Zap, Sparkles } from "lucide-react";
import { stockApi } from "@/lib/api";
import { Stock } from "@/lib/types/stock.types";
import StockDetailModal from "@/app/user/_components/StockDetailModal";
import Market3DBackground from "../_components/Market3DBackground";
import { motion, AnimatePresence } from "framer-motion";

type TabType = 'nifty50' | 'nifty100' | 'etf';

export default function MarketsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('nifty50');
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [sortBy, setSortBy] = useState<'symbol' | 'change'>('symbol');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isMounted, setIsMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch stocks based on active tab
    const fetchStocks = async (tab: TabType) => {
        try {
            setLoading(true);
            let response;

            switch (tab) {
                case 'nifty50':
                    response = await stockApi.getNifty50Stocks();
                    break;
                case 'nifty100':
                    response = await stockApi.getNifty100Stocks();
                    break;
                case 'etf':
                    response = await stockApi.getETFStocks();
                    break;
            }

            setStocks(response.data);
            setFilteredStocks(response.data);
            setLastUpdated(response.lastUpdated || new Date().toISOString());
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to fetch ${tab.toUpperCase()} stocks`);
            console.error(`Error fetching ${tab} stocks:`, err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when tab changes
    useEffect(() => {
        if (isMounted) {
            fetchStocks(activeTab);
            setSearchQuery(""); // Reset search when changing tabs
        }
    }, [activeTab, isMounted]);

    // Auto-refresh every 2 minutes
    useEffect(() => {
        if (!isMounted) return;
        const interval = setInterval(() => fetchStocks(activeTab), 120000);
        return () => clearInterval(interval);
    }, [activeTab, isMounted]);

    // Filter and sort stocks
    useEffect(() => {
        if (!isMounted) return;
        let result = stocks.filter((stock) =>
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'symbol') {
                comparison = a.symbol.localeCompare(b.symbol);
            } else if (sortBy === 'change') {
                comparison = a.changePercent - b.changePercent;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredStocks(result);
    }, [searchQuery, stocks, sortBy, sortOrder, isMounted]);

    const handleStockClick = (stock: Stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    };

    const toggleSort = (field: 'symbol' | 'change') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Tab configuration
    const tabs = [
        { id: 'nifty50' as TabType, name: 'Nifty 50', icon: LineChart, color: 'blue', desc: "Top 50 Blue Chip Companies" },
        { id: 'nifty100' as TabType, name: 'Nifty 100', icon: Zap, color: 'indigo', desc: "India's Market Leaders" },
        { id: 'etf' as TabType, name: 'ETF', icon: Layers, color: 'purple', desc: "Exchange Traded Funds" }
    ];

    const currentTabConfig = tabs.find(t => t.id === activeTab)!;

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <div className="min-h-screen font-sans relative overflow-hidden text-white selection:bg-indigo-500/30">

            {/* 3D BACKGROUND */}
            <Market3DBackground />

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 backdrop-blur-md border border-slate-700 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/20 cursor-default">
                        <Sparkles className="w-3 h-3 text-indigo-400 fill-indigo-400 animate-pulse" /> Live Market Intelligence
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                        Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">Pulse</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Real-time insights across India's most important indices. <br className="hidden md:block" />Beautifully visualized for the modern investor.
                    </p>
                </motion.div>


                {/* TABS (Dark Glassmorphism) */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-900/20 ring-1 ring-white/5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    relative px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300
                    flex items-center gap-2 overflow-hidden
                    ${isActive
                                            ? 'text-white shadow-lg shadow-indigo-500/20 scale-105 z-10'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }
                  `}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-700`}
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                                        {tab.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CONTENT CARD */}
                <motion.div
                    layout
                    className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-700/50 ring-1 ring-white/10 overflow-hidden relative"
                >
                    {/* TOP BAR */}
                    <div className="p-8 border-b border-slate-800/50 flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-slate-900/50 to-indigo-950/20">

                        {/* Search */}
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/50 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner font-medium"
                                placeholder={`Search ${currentTabConfig.name}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {/* Stats Pill */}
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Updated</span>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-sm font-bold text-slate-300 tabular-nums">
                                        {lastUpdated ? new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => fetchStocks(activeTab)}
                                disabled={loading}
                                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center gap-2 group"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="relative">
                        {/* Loading Overlay */}
                        <AnimatePresence>
                            {loading && stocks.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4"
                                >
                                    <Activity className="w-12 h-12 text-indigo-400 animate-bounce" />
                                    <p className="font-bold text-indigo-300">Fetching live data...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        {error && (
                            <div className="p-8 text-center text-rose-400 bg-rose-950/30 border-b border-rose-900/50">
                                <p className="font-bold">{error}</p>
                            </div>
                        )}

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-slate-950/30 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                            <div className="col-span-3 hover:text-indigo-400 cursor-pointer flex items-center gap-1 transition-colors" onClick={() => toggleSort('symbol')}>Symbol <ArrowUpDown className="w-3 h-3" /></div>
                            <div className="col-span-2 text-right">Open</div>
                            <div className="col-span-2 text-right">High</div>
                            <div className="col-span-2 text-right">Low</div>
                            <div className="col-span-1 text-right">Price</div>
                            <div className="col-span-2 text-right hover:text-indigo-400 cursor-pointer flex items-center justify-end gap-1 transition-colors" onClick={() => toggleSort('change')}>Change <ArrowUpDown className="w-3 h-3" /></div>
                        </div>

                        {/* Table Rows */}
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar-dark">
                            {filteredStocks.length === 0 && !loading ? (
                                <div className="p-20 text-center text-slate-600">
                                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No stocks found for "{searchQuery}"</p>
                                </div>
                            ) : (
                                filteredStocks.map((stock, i) => {
                                    const isPositive = stock.change >= 0;
                                    return (
                                        <motion.div
                                            key={stock.symbol}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                // Fix visibility delay: cap delay at 0.5s or reduce multiplier
                                                delay: Math.min(i * 0.01, 0.5),
                                                duration: 0.3
                                            }}
                                            onClick={() => handleStockClick(stock)}
                                            className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-800/50 hover:bg-white/5 transition-colors cursor-pointer group items-center"
                                        >
                                            {/* Symbol */}
                                            <div className="col-span-3 flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/20 transition-transform group-hover:scale-110 bg-gradient-to-br from-${currentTabConfig.color}-600 to-${currentTabConfig.color}-700`}>
                                                    {stock.symbol[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{stock.symbol}</h3>
                                                    <p className="text-xs text-slate-400 font-medium truncate max-w-[120px]">{stock.name}</p>
                                                </div>
                                            </div>

                                            <div className="col-span-2 text-right font-medium text-slate-400">₹{stock.open.toFixed(2)}</div>
                                            <div className="col-span-2 text-right font-medium text-emerald-400">₹{stock.high.toFixed(2)}</div>
                                            <div className="col-span-2 text-right font-medium text-rose-400">₹{stock.low.toFixed(2)}</div>

                                            <div className="col-span-1 text-right font-bold text-white text-base">₹{stock.price.toFixed(2)}</div>

                                            <div className="col-span-2 flex justify-end">
                                                <span className={`
                                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold w-24 justify-center shadow-lg
                                  ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}
                                `}>
                                                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {stock.changePercent.toFixed(2)}%
                                                </span>
                                            </div>

                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                    </div>
                </motion.div>
            </div>

            <StockDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStock(null);
                }}
                stock={selectedStock}
            />
        </div>
    );
}

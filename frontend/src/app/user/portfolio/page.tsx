"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Loader2,
    Brain,
    Clock,
    ArrowUp,
    ArrowDown,
    Wallet,
    PieChart,
    Activity,
    DollarSign,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tradingApi } from "@/lib/api/trading.api";
import { useTradingWebSocket } from "@/hooks/useTradingWebSocket";
import {
    Portfolio,
    PortfolioHolding,
    Trade,
} from "@/lib/types/trading.types";

export default function PortfolioPage() {
    // ------------------------------------------------------------------
    // State Management (Explicit & Full)
    // ------------------------------------------------------------------
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // AI Section State
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Trades Section State
    const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
    const [tradesLoading, setTradesLoading] = useState(false);

    // ------------------------------------------------------------------
    // WebSocket & Data Fetching Logic
    // ------------------------------------------------------------------
    const { isConnected, subscribeToPortfolio } = useTradingWebSocket({
        autoConnect: true,
        onPortfolioUpdate: (data) => {
            // Background update - do not trigger full page loader
            fetchPortfolio(true);
        },
        onTradeExecuted: (data) => {
            fetchPortfolio(true);
            fetchRecentTrades();
        },
    });

    // Fetch Portfolio Data
    const fetchPortfolio = async (isBackground = false) => {
        if (!isBackground) {
            setRefreshing(true);
        }
        try {
            const response = await tradingApi.getPortfolio();
            if (response.success) {
                setPortfolio(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
        } finally {
            if (!isBackground) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    };

    // Fetch AI Analysis
    const fetchAIAnalysis = async () => {
        setAiLoading(true);
        try {
            const response = await tradingApi.getAIPortfolioAnalysis();
            if (response.success) {
                setAiAnalysis(response.data.analysis);
            }
        } catch (error) {
            console.error("Failed to fetch AI analysis:", error);
        } finally {
            setAiLoading(false);
        }
    };

    // Fetch Recent Trades History
    const fetchRecentTrades = async () => {
        setTradesLoading(true);
        try {
            const response = await tradingApi.getTradeHistory({ limit: 10, page: 1 });
            if (response.success) {
                setRecentTrades(response.data.trades);
            }
        } catch (error) {
            console.error("Failed to fetch trades:", error);
        } finally {
            setTradesLoading(false);
        }
    };

    // Initial Load Effect
    useEffect(() => {
        fetchPortfolio();
        fetchRecentTrades();

        if (isConnected) {
            subscribeToPortfolio();
        }
    }, [isConnected]);

    // ------------------------------------------------------------------
    // Helper Logic & Calculations
    // ------------------------------------------------------------------
    const totalPL = portfolio?.summary?.totalPL || 0;
    const totalInvested = portfolio?.summary?.totalInvested || 0;

    // Calculate percentage safely
    const totalPLPercent = totalInvested > 0
        ? (totalPL / totalInvested) * 100
        : 0;

    const isProfitable = totalPL >= 0;

    // ------------------------------------------------------------------
    // Components (Internal for styling)
    // ------------------------------------------------------------------

    // 1. Loading Pulse for Numbers
    const ValueSkeleton = () => (
        <div className="h-8 w-32 bg-white/10 animate-pulse rounded-lg" />
    );

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* Background Gradients (Ambient) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Main Content Container 
                NOTE: pt-24 added to prevent Navbar overlap
            */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-8 pt-24 pb-12 space-y-8">

                {/* Top Bar: Actions */}
                <div className="flex justify-end items-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fetchPortfolio(false)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-cyan-400 rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg"
                    >
                        <RefreshCw size={18} className={cn("transition-transform duration-700", refreshing && "animate-spin")} />
                        <span className="font-medium text-sm">Sync Data</span>
                    </motion.button>
                </div>

                {/* ==========================================================================
                   SECTION 1: HIGH-LEVEL METRICS (The Cards)
                   ==========================================================================
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* CARD 1: TOTAL PORTFOLIO VALUE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="relative overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group hover:border-cyan-500/50 transition-all duration-500"
                    >
                        {/* Background Gradient Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <Wallet className="h-6 w-6 text-cyan-400" />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 border border-cyan-500/20 px-2 py-1 rounded-full">
                                    <Activity size={10} /> Live
                                </span>
                            </div>

                            <div className="space-y-1">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Total Value</span>
                                <div className="text-4xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {portfolio ? (
                                        <>
                                            <span className="text-2xl text-slate-500">₹</span>
                                            {portfolio.totalValue.toLocaleString()}
                                        </>
                                    ) : <ValueSkeleton />}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CARD 2: TOTAL INVESTED */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group hover:border-purple-500/50 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <PieChart className="h-6 w-6 text-purple-400" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Invested Amount</span>
                                <div className="text-4xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {portfolio?.summary ? (
                                        <>
                                            <span className="text-2xl text-slate-500">₹</span>
                                            {portfolio.summary.totalInvested.toLocaleString()}
                                        </>
                                    ) : <ValueSkeleton />}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CARD 3: PROFIT & LOSS (Interactive Arrows) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className={cn(
                            "relative overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-xl border rounded-3xl p-6 group transition-all duration-500",
                            isProfitable
                                ? "border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
                                : "border-red-500/30 hover:border-red-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]"
                        )}
                    >
                        {/* Dynamic Background Gradient */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            isProfitable ? "from-emerald-500/10" : "from-red-500/10"
                        )} />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                {/* The "Beautiful Arrow" Container */}
                                <div className={cn(
                                    "p-3 rounded-2xl border group-hover:scale-110 transition-transform duration-300 shadow-inner",
                                    isProfitable
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                )}>
                                    {isProfitable ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                                </div>

                                {/* Graphical Pill Indicator */}
                                {portfolio?.summary && (
                                    <div className={cn(
                                        "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border",
                                        isProfitable
                                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                                            : "bg-red-500/20 border-red-500/30 text-red-400"
                                    )}>
                                        {isProfitable ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                                        {totalPLPercent.toFixed(2)}%
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Overall Returns</span>
                                <div className={cn(
                                    "text-4xl font-bold tracking-tight flex items-center gap-2",
                                    isProfitable ? "text-emerald-400 drop-shadow-sm" : "text-red-400 drop-shadow-sm"
                                )}>
                                    {portfolio?.summary ? (
                                        <>
                                            <span className={cn("text-2xl opacity-70")}>{isProfitable ? "+" : ""}₹</span>
                                            {Math.abs(portfolio.summary.totalPL).toLocaleString()}
                                        </>
                                    ) : <ValueSkeleton />}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CARD 4: AVAILABLE BALANCE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group hover:border-amber-500/50 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <DollarSign className="h-6 w-6 text-amber-400" />
                                </div>
                                <div className="p-2 bg-white/5 rounded-full">
                                    <Zap size={12} className="text-amber-400 fill-amber-400" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Buying Power</span>
                                <div className="text-4xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {portfolio ? (
                                        <>
                                            <span className="text-2xl text-slate-500">₹</span>
                                            {portfolio.availableBalance.toLocaleString()}
                                        </>
                                    ) : <ValueSkeleton />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ==========================================================================
                   SECTION 2: HOLDINGS TABLE (Graphical & Interactive)
                   ==========================================================================
                */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                >
                    {/* Table Header */}
                    <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/20">
                                <Briefcase className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Current Holdings</h2>
                                <p className="text-slate-400 text-sm">Real-time market updates</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Asset</th>
                                    <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Qty</th>
                                    <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Price</th>
                                    <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">LTP</th>
                                    <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Current Val</th>
                                    <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">P&L</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading && !portfolio ? (
                                    // Loading Rows
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-10 w-40 bg-white/5 rounded-lg" /></td>
                                            <td className="px-8 py-6"><div className="h-6 w-12 bg-white/5 rounded ml-auto" /></td>
                                            <td className="px-8 py-6"><div className="h-6 w-20 bg-white/5 rounded ml-auto" /></td>
                                            <td className="px-8 py-6"><div className="h-6 w-20 bg-white/5 rounded ml-auto" /></td>
                                            <td className="px-8 py-6"><div className="h-6 w-24 bg-white/5 rounded ml-auto" /></td>
                                            <td className="px-8 py-6"><div className="h-8 w-24 bg-white/5 rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : (portfolio?.holdings || []).length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-50">
                                                <Briefcase size={48} className="mb-4 text-slate-600" />
                                                <p className="text-lg font-medium text-slate-400">No active positions</p>
                                                <p className="text-sm text-slate-600">Buy stocks to see them here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    // Explicit mapping for full control
                                    portfolio!.holdings.map((holding) => {
                                        const isProfit = holding.unrealizedPL >= 0;
                                        return (
                                            <motion.tr
                                                key={holding.symbol}
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                                                className="transition-colors duration-200"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-[#111] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-cyan-500/30 transition-colors">
                                                            <span className="font-bold text-sm text-white tracking-tighter">
                                                                {holding.symbol.substring(0, 2)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-base text-white">{holding.symbol}</div>
                                                            <div className="text-xs text-slate-500 font-medium">{holding.stockName}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="font-mono text-white text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                                        {holding.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right text-slate-400 font-mono text-sm">
                                                    ₹{holding.averageBuyPrice.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-white font-mono font-medium">₹{holding.currentPrice.toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-white font-bold font-mono text-base tracking-tight">
                                                        ₹{holding.currentValue.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={cn(
                                                            "font-bold font-mono text-base flex items-center gap-1",
                                                            isProfit ? "text-emerald-400" : "text-red-400"
                                                        )}>
                                                            {isProfit ? '+' : ''}₹{holding.unrealizedPL.toLocaleString()}
                                                        </span>

                                                        {/* Graphical % Pill */}
                                                        <span className={cn(
                                                            "text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border",
                                                            isProfit
                                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                                : "bg-red-500/10 border-red-500/20 text-red-400"
                                                        )}>
                                                            {isProfit ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                                                            {holding.unrealizedPLPercent.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* ==========================================================================
                   SECTION 3: AI & TRADES (Grid Layout)
                   ==========================================================================
                */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* AI ANALYSIS PANEL */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden flex flex-col min-h-[400px]"
                    >
                        {/* Decorative background blurs */}
                        <div className="absolute top-0 right-0 p-40 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-900/20 rounded-2xl border border-cyan-500/20">
                                    <Brain className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">AI Portfolio Analysis</h2>
                                    <p className="text-slate-400 text-sm">Powered by Advanced Models</p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={fetchAIAnalysis}
                                disabled={aiLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg shadow-cyan-900/20"
                            >
                                {aiLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Brain className="h-4 w-4" />
                                        <span>Generate Insights</span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        <div className="flex-1 bg-black/40 rounded-2xl p-8 border border-white/5 relative z-10 overflow-y-auto">
                            {aiAnalysis ? (
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-slate-300 leading-8 font-light text-lg whitespace-pre-wrap">
                                        {aiAnalysis}
                                    </p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                    <Brain className="h-16 w-16 mb-4 text-slate-700" />
                                    <h3 className="text-xl font-medium text-slate-300">AI is ready to analyze</h3>
                                    <p className="text-slate-500 max-w-sm mt-2">
                                        Click the generate button to get a detailed breakdown of your portfolio performance and suggestions.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* RECENT TRADES PANEL */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-full min-h-[400px]"
                    >
                        <div className="p-8 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-purple-400" />
                                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {tradesLoading && recentTrades.length === 0 ? (
                                <div className="flex items-center justify-center h-40">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                                </div>
                            ) : (recentTrades || []).length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                                    <Clock className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No recent trades found</p>
                                </div>
                            ) : (
                                recentTrades.map((trade) => (
                                    <div
                                        key={trade._id}
                                        className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-white text-sm bg-black/50 px-2 py-1 rounded-md border border-white/10">
                                                {trade.symbol}
                                            </span>
                                            <span className={cn(
                                                "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                                                trade.type === "BUY"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                {trade.type === "BUY" ? <ArrowDown size={8} /> : <ArrowUp size={8} />}
                                                {trade.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                            <span>{trade.quantity} shares @ <span className="text-white font-mono">₹{trade.price.toLocaleString()}</span></span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                                            <span className="text-[10px] font-mono text-slate-600">
                                                {new Date(trade.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className={cn(
                                                "text-[10px] font-bold tracking-wider",
                                                trade.status === "EXECUTED" ? "text-cyan-400" : "text-amber-400"
                                            )}>
                                                {trade.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
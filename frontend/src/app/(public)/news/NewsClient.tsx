"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Filter, Newspaper, TrendingUp, Zap, Globe, Hash, ArrowUpRight } from "lucide-react";
import { newsApi } from "@/lib/api";
import { NewsArticle } from "@/lib/types/news.types";
import NewsCard from "./_components/NewsCard";
import { motion, AnimatePresence } from "framer-motion";

// Filter Categories
const CATEGORIES = [
    { id: 'ALL', name: 'All News', icon: Newspaper },
    { id: 'MARKET', name: 'Market', icon: TrendingUp },
    { id: 'STOCKS', name: 'Stocks', icon: Zap },
    { id: 'ECONOMY', name: 'Economy', icon: Globe },
];

export default function NewsClient() {
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");

    // Fetch News
    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await newsApi.getLatestNews({ limit: 50 });
            setNews(response.data);
            setFilteredNews(response.data);
            setLastUpdated(new Date().toISOString());
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNews();
        const interval = setInterval(fetchNews, 300000); // Auto-refresh 5 mins
        return () => clearInterval(interval);
    }, []);

    // Handle Filtering
    useEffect(() => {
        let result = news;
        if (activeCategory !== 'ALL') {
            result = result.filter(item => item.category === activeCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.relatedSymbols.some(sym => sym.toLowerCase().includes(query))
            );
        }
        setFilteredNews(result);
    }, [activeCategory, searchQuery, news]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchNews();
    };

    // Calculate Trending Symbols from News Data
    const trendingSymbols = useMemo(() => {
        const counts: Record<string, number> = {};
        news.forEach(article => {
            article.relatedSymbols.forEach(sym => {
                counts[sym] = (counts[sym] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Sort by frequency
            .slice(0, 5); // Top 5
    }, [news]);

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-indigo-500/30">
            
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                 <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">

                {/* HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                     <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        Market Pulse
                    </h1>
                    <p className="text-slate-400">Real-time financial intelligence curated for you.</p>
                </div>

                {/* 3-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* --- LEFT SIDEBAR (Sticky) --- */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
                        {/* Search Widget */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search news..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-2 overflow-hidden">
                             <div className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Feeds</div>
                             <div className="space-y-1">
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                                isActive 
                                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                            {cat.name}
                                        </button>
                                    );
                                })}
                             </div>
                        </div>
                    </div>

                    {/* --- CENTER FEED (Scrollable) --- */}
                    <div className="lg:col-span-6 space-y-8">
                        
                        {/* Mobile Controls (Visible only on small screens) */}
                        <div className="lg:hidden flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${activeCategory === cat.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Status Bar */}
                        <div className="flex items-center justify-between px-2">
                             <div className="flex items-center gap-2">
                                <div className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </div>
                                <span className="text-xs font-medium text-slate-400">
                                    Live Updates {lastUpdated && `• ${new Date(lastUpdated).toLocaleTimeString()}`}
                                </span>
                             </div>
                             <button onClick={handleRefresh} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                             </button>
                        </div>

                        {/* Feed Content */}
                        <div className="space-y-8 min-h-[500px]">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="h-64 rounded-3xl bg-slate-900/50 animate-pulse border border-white/5" />
                                ))
                            ) : filteredNews.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Filter className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white">No stories found</h3>
                                </div>
                            ) : (
                                <AnimatePresence mode='popLayout'>
                                    {filteredNews.map((article, index) => (
                                        <NewsCard key={article._id} article={article} index={index} />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT SIDEBAR (Sticky) --- */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
                        
                        {/* Trending Symbols Widget */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trending Assets</h3>
                            </div>
                            
                            <div className="space-y-3">
                                {trendingSymbols.length > 0 ? trendingSymbols.map(([symbol, count], i) => (
                                    <div key={symbol} className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/50 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:text-white">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-400">{symbol}</div>
                                                <div className="text-[10px] text-slate-500">{count} mentions</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                )) : (
                                    <div className="text-xs text-slate-500 italic py-2">No trending data yet...</div>
                                )}
                            </div>
                        </div>

                        {/* Newsletter / Promo Widget */}
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-5 text-center">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">Go Premium</h3>
                            <p className="text-xs text-slate-400 mb-4">Get AI-powered insights and real-time alerts.</p>
                            <button className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors">
                                Upgrade Now
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, Filter, Newspaper, TrendingUp, Zap, Globe } from "lucide-react";
import { newsApi } from "@/lib/api";
import { NewsArticle } from "@/lib/types/news.types";
import NewsCard from "./_components/NewsCard";
import Market3DBackground from "../_components/Market3DBackground";
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
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, []);

    // Handle Filtering
    useEffect(() => {
        let result = news;

        // 1. Filter by Category
        if (activeCategory !== 'ALL') {
            result = result.filter(item => item.category === activeCategory);
        }

        // 2. Filter by Search
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

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-indigo-500/30">
            <Market3DBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">

                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Live News Feed
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                        Market Insights
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Stay ahead with real-time updates from NSE, Moneycontrol, and Economic Times.
                        Curated, categorized, and delivered instantly.
                    </p>
                </motion.div>

                {/* CONTROLS BAR */}
                <div className="sticky top-24 z-30 mb-10">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-center">

                        {/* Category Tabs - FIXED */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = activeCategory === cat.id;
                                if (cat.id !== 'ALL' && !news.some(n => n.category === cat.id)) {
                                    return null;
                                }
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`
          px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
          ${isActive
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105'
                                                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent hover:border-slate-600'}
        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>


                        {/* Right Side Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-grow md:flex-grow-0 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search news or symbols..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:text-white active:scale-95 disabled:opacity-50"
                                title="Refresh News"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT GRID */}
                {loading ? (
                    // SKELETON LOADER
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-slate-800/20 animate-pulse border border-slate-800/30"></div>
                        ))}
                    </div>
                ) : filteredNews.length === 0 ? (
                    // EMPTY STATE
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No news found</h3>
                        <p className="text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    // NEWS GRID
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {filteredNews.map((article, index) => (
                                <NewsCard key={article._id} article={article} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* FOOTER STATS */}
                <div className="mt-12 text-center text-slate-500 text-xs font-medium">
                    Showing {filteredNews.length} articles • Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '--:--'}
                </div>

            </div>
        </div>
    );
}

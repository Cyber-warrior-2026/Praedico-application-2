"use client";

import { useState, useEffect } from "react";
import { newsApi } from "@/lib/api";
import { NewsArticle } from "@/lib/types/news.types";
import NewsDashboardCard from "./_components/NewsDashboardCard";

import { Search, RefreshCw, Filter, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";

export default function UserNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch News
  const fetchNews = async () => {
    try {
      const response = await newsApi.getLatestNews({ limit: 50 });
      setNews(response.data);
      setFilteredNews(response.data);
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = news;
    if (activeTab !== 'ALL') {
      result = result.filter(n => n.category === activeTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
      );
    }
    setFilteredNews(result);
  }, [activeTab, searchQuery, news]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNews();
  };

  const tabs = [
    { id: 'ALL', label: 'All Updates' },
    { id: 'MARKET', label: 'Market Pulse' },
    { id: 'STOCKS', label: 'Stocks' },
    { id: 'IPO', label: 'IPO Watch' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Market News</h1>
            <p className="text-slate-500 mt-1">Real-time insights tailored for your portfolio</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 w-full md:w-64 shadow-sm transition-all"
              />
            </div>

            <button
              onClick={handleRefresh}
              className={`p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm transition-all ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 shadow-sm'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No news found</h3>
            <p className="text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article, index) => (
              <NewsDashboardCard key={article._id} article={article} index={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

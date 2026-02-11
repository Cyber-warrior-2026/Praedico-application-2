"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, RefreshCw, Activity, Layers, Sparkles, ArrowUpDown } from "lucide-react";
import { stockApi } from "@/lib/api/stock.api";
import { Stock } from "@/lib/types/stock.types";
import StockDetailModal from "@/app/user/_components/StockDetailModal";

import AIChatButton from '@/app/user/_components/chat/AIChatButton';

export default function ETFPage() {
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

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stockApi.getETFStocks();

      // ✅ FIX: Access response.data (not response directly)
      setStocks(response.data);
      setFilteredStocks(response.data);
      setLastUpdated(response.lastUpdated || new Date().toISOString());
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch ETFs");
      console.error("Error fetching ETF stocks:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
  }, [searchQuery, stocks, sortBy, sortOrder]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-background dark:via-background dark:to-background pt-24 pb-12 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              {/* Badge with Layers Icon */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30
                             border border-purple-200 dark:border-purple-800 mb-3 animate-pulse">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">ETF MARKET</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Layers className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400 animate-bounce" />
                ETF Market Data
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-sm md:text-lg">Exchange Traded Funds from NSE India</p>
            </div>

            <button
              onClick={fetchStocks}
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 
                       hover:from-purple-600 hover:to-purple-700 text-white font-semibold
                       transition-all duration-300 flex items-center justify-center gap-2 shadow-lg 
                       hover:shadow-xl hover:scale-105 disabled:opacity-50 
                       disabled:cursor-not-allowed group"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : "group-hover:rotate-180"} 
                                    transition-transform duration-500`} />
              Refresh
            </button>
          </div>

          {/* Search & Stats Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between 
                         animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            {/* Enhanced Search Bar */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 
                               group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search ETFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/50 backdrop-blur-md border-2 border-gray-200 dark:border-white/10
                         text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 
                         focus:ring-purple-100 dark:focus:ring-purple-900/30 focus:border-purple-500 transition-all duration-300 
                         shadow-sm hover:shadow-md"
              />
            </div>

            {/* Stats Cards */}
            <div className="w-full md:w-auto flex flex-row items-center justify-between md:justify-end gap-3">
              <div className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900
                             border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all 
                             flex items-center justify-center gap-2 text-center md:text-left">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-slate-400">Total: </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{filteredStocks.length}</span>
              </div>

              {lastUpdated && (
                <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-5 py-3 rounded-xl bg-gradient-to-r 
                               from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 shadow-sm 
                               hover:shadow-md transition-all animate-pulse">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  </div>
                  <span className="text-sm text-green-700 dark:text-green-400 font-semibold">
                    {new Date(lastUpdated).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 
                         animate-in fade-in shake duration-500">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && stocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Activity className="w-16 h-16 text-purple-500 animate-bounce mb-4" />
            <p className="text-gray-600 dark:text-slate-400 text-lg">Loading ETF data...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 dark:border-white/10 overflow-hidden 
                         animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 
                         hover:shadow-2xl transition-shadow">

            {/* Scrollable Container */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900
                                border-b-2 border-purple-200 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-slate-400">
                  <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400
                                    transition-colors" onClick={() => toggleSort('symbol')}>
                    SYMBOL
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                  <div className="col-span-2 text-right">OPEN</div>
                  <div className="col-span-2 text-right">HIGH</div>
                  <div className="col-span-2 text-right">LOW</div>
                  <div className="col-span-1 text-right">PRICE</div>
                  <div className="col-span-2 text-right flex items-center justify-end gap-2 
                                    cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => toggleSort('change')}>
                    CHANGE
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredStocks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-slate-500">
                      No ETFs found matching &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    filteredStocks.map((stock, index) => {
                      const isPositive = stock.change >= 0;
                      const changeColor = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
                      const bgColor = isPositive ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10";

                      return (
                        <div
                          key={stock._id}
                          onClick={() => handleStockClick(stock)}
                          className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gradient-to-r 
                                    hover:from-purple-50 hover:to-pink-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 
                                    cursor-pointer group animate-in fade-in slide-in-from-left 
                                    duration-500 hover:scale-[1.02]"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          {/* Symbol with Purple Gradient */}
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 
                                            to-purple-500 flex items-center justify-center font-bold 
                                            text-white text-sm shadow-md group-hover:scale-110 
                                            group-hover:rotate-6 transition-all duration-300">
                              {stock.symbol.charAt(0)}
                              <div className="absolute inset-0 bg-purple-300 rounded-xl opacity-0 
                                                group-hover:opacity-30 group-hover:scale-150 
                                                transition-all duration-500" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400
                                                transition-colors">
                                {stock.symbol}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-slate-500">{stock.name}</div>
                            </div>
                          </div>

                          <div className="col-span-2 flex items-center justify-end text-gray-700 dark:text-slate-300 font-medium">
                            ₹{stock.open.toFixed(2)}
                          </div>

                          <div className="col-span-2 flex items-center justify-end text-green-600 dark:text-green-400 font-bold">
                            ₹{stock.high.toFixed(2)}
                          </div>

                          <div className="col-span-2 flex items-center justify-end text-red-600 dark:text-red-400 font-bold">
                            ₹{stock.low.toFixed(2)}
                          </div>

                          <div className="col-span-1 flex items-center justify-end text-gray-900 dark:text-white font-bold 
                                            text-lg">
                            ₹{stock.price.toFixed(2)}
                          </div>

                          <div className="col-span-2 flex items-center justify-end">
                            <div className={`px-4 py-2 rounded-xl ${bgColor} ${changeColor} font-bold 
                                            text-sm flex items-center gap-1.5 shadow-sm 
                                            group-hover:scale-110 transition-transform`}>
                              {isPositive ? (
                                <TrendingUp className="w-4 h-4 animate-bounce" />
                              ) : (
                                <TrendingDown className="w-4 h-4 animate-bounce" />
                              )}
                              <span>{stock.changePercent.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <StockDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStock(null);
        }}
        stock={selectedStock}
      />
      {/* AI Chatbot */}
      <AIChatButton />

    </div>
  );
}
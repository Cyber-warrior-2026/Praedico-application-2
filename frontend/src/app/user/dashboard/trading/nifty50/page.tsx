"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, RefreshCw, Activity, Zap, ArrowUpDown } from "lucide-react";
import { stockApi } from "@/lib/api";
import { Stock } from "@/lib/types/stock.types";
import StockDetailModal from "@/app/user/_components/StockDetailModal";
import AIChatButton from '@/app/user/_components/chat/AIChatButton';


export default function Nifty50Page() {
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
    const response = await stockApi.getNifty50Stocks();
    
    // ✅ FIX: Access response.data
    setStocks(response.data);
    setFilteredStocks(response.data);
    setLastUpdated(response.lastUpdated || new Date().toISOString());
    setError("");
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch Nifty 50 stocks");
    console.error("Error fetching Nifty 50 stocks:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 
                             border border-blue-200 mb-3 animate-pulse">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">NIFTY 50</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                Nifty 50 Market Data
                <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
              </h1>
              <p className="text-gray-600 text-lg">Real-time data from NSE India</p>
            </div>

            <button
              onClick={fetchStocks}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 
                       hover:from-blue-600 hover:to-blue-700 text-white font-semibold
                       transition-all duration-300 flex items-center gap-2 shadow-lg 
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
                               group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border-2 border-gray-200 
                         text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 
                         focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 
                         shadow-sm hover:shadow-md"
              />
            </div>

            {/* Stats Cards */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 
                             border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="text-sm font-bold text-gray-900">{filteredStocks.length}</span>
              </div>

              {lastUpdated && (
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r 
                               from-green-50 to-emerald-50 border border-green-200 shadow-sm 
                               hover:shadow-md transition-all animate-pulse">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  </div>
                  <span className="text-sm text-green-700 font-semibold">
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
            <Activity className="w-16 h-16 text-blue-500 animate-bounce mb-4" />
            <p className="text-gray-600 text-lg">Loading Nifty 50 stocks...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden 
                         animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 
                         hover:shadow-2xl transition-shadow">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 
                           border-b-2 border-gray-200 text-sm font-bold text-gray-700">
              <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-blue-600 
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
            <div className="divide-y divide-gray-100">
              {filteredStocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No stocks found matching "{searchQuery}"
                </div>
              ) : (
                filteredStocks.map((stock, index) => {
                  const isPositive = stock.change >= 0;
                  const changeColor = isPositive ? "text-green-600" : "text-red-600";
                  const bgColor = isPositive ? "bg-green-50" : "bg-red-50";

                  return (
                    <div
                      key={stock._id}
                      onClick={() => handleStockClick(stock)}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gradient-to-r 
                               hover:from-blue-50 hover:to-purple-50 transition-all duration-300 
                               cursor-pointer group animate-in fade-in slide-in-from-left 
                               duration-500 hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Symbol */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 
                                       to-blue-500 flex items-center justify-center font-bold 
                                       text-white text-sm shadow-md group-hover:scale-110 
                                       group-hover:rotate-6 transition-all duration-300">
                          {stock.symbol.charAt(0)}
                          <div className="absolute inset-0 bg-blue-300 rounded-xl opacity-0 
                                         group-hover:opacity-30 group-hover:scale-150 
                                         transition-all duration-500" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-blue-600 
                                         transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-xs text-gray-500">{stock.name}</div>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center justify-end text-gray-700 font-medium">
                        ₹{stock.open.toFixed(2)}
                      </div>

                      <div className="col-span-2 flex items-center justify-end text-green-600 font-bold">
                        ₹{stock.high.toFixed(2)}
                      </div>

                      <div className="col-span-2 flex items-center justify-end text-red-600 font-bold">
                        ₹{stock.low.toFixed(2)}
                      </div>

                      <div className="col-span-1 flex items-center justify-end text-gray-900 font-bold 
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
        )}
      </div>

      <StockDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStock(null);
        }}
        stock={selectedStock}
        theme="light"
      />
         {/* AI Chatbot */}
      <AIChatButton />
    </div>
  );
}

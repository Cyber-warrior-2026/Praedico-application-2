"use client";

import { X, TrendingUp, TrendingDown, Activity, BarChart3, Clock, Sparkles, Zap } from "lucide-react";
import { Stock } from "@/lib/types/stock.types";
import { useEffect, useState } from "react";

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
}

export default function StockDetailModal({ isOpen, onClose, stock }: StockDetailModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      setIsAnimating(true);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      setIsAnimating(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !stock) return null;

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const bgChangeColor = isPositive ? "bg-green-50" : "bg-red-50";
  const borderChangeColor = isPositive ? "border-green-200" : "border-red-200";

  // Calculate price position in day's range
  const priceRangePercent = ((stock.price - stock.low) / (stock.high - stock.low)) * 100;

  return (
    <>
      {/* Enhanced Backdrop with Animation */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md 
                   z-[200] transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Container - Higher z-index to avoid navbar */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none 
                     pt-20">
        <div
          className={`relative bg-white rounded-3xl shadow-2xl border-2 border-gray-200 
                     w-full max-w-4xl max-h-[85vh] overflow-y-auto pointer-events-auto 
                     transition-all duration-500 transform
                     ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}
                     scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2.5 rounded-full bg-gray-100 hover:bg-red-100 
                       transition-all duration-300 group z-10 hover:scale-110 hover:rotate-90 
                       shadow-lg hover:shadow-xl"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
          </button>

          {/* Header Section with Enhanced Gradient & Animations */}
          <div className="relative p-8 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 
                         via-purple-50 to-pink-50 overflow-hidden">
            {/* Floating Particles Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
              <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              <div className="absolute top-8 right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse" 
                   style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-6 left-16 w-2 h-2 bg-pink-400 rounded-full animate-bounce" 
                   style={{ animationDelay: '0.8s' }} />
            </div>

            <div className="flex items-start justify-between relative z-10">
              {/* Stock Symbol & Name with Animation */}
              <div className="flex items-center gap-4 animate-in slide-in-from-left duration-500">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 
                                 flex items-center justify-center font-bold text-white text-2xl 
                                 shadow-lg animate-in zoom-in duration-500 hover:scale-110 
                                 hover:rotate-12 transition-all">
                    {stock.symbol.charAt(0)}
                  </div>
                  {/* Pulse Ring Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-0 
                                 animate-ping" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-1 flex items-center gap-2 
                                animate-in slide-in-from-left duration-500 delay-100">
                    {stock.symbol}
                    <Zap className="w-6 h-6 text-yellow-500 animate-bounce" />
                  </h2>
                  <p className="text-sm text-gray-600 font-medium animate-in fade-in duration-500 
                               delay-200">
                    {stock.name}
                  </p>
                </div>
              </div>

              {/* Current Price & Change with Enhanced Animation */}
              <div className="text-right animate-in slide-in-from-right duration-500">
                <div className="text-5xl font-bold text-gray-900 mb-2 animate-in zoom-in 
                               duration-700 delay-100">
                  ₹{stock.price.toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className={`flex items-center justify-end gap-2 ${changeColor} font-bold 
                               text-xl animate-in slide-in-from-right duration-500 delay-200`}>
                  {isPositive ? (
                    <TrendingUp className="w-6 h-6 animate-bounce" />
                  ) : (
                    <TrendingDown className="w-6 h-6 animate-bounce" />
                  )}
                  <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                  <span>({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Category Badges with Stagger Animation */}
            <div className="mt-6 flex items-center gap-3 relative z-10">
              <span className={`px-5 py-2 rounded-full text-sm font-bold ${bgChangeColor} 
                             ${changeColor} border-2 ${borderChangeColor} animate-in zoom-in 
                             duration-500 delay-300 hover:scale-110 transition-transform 
                             shadow-md`}>
                {stock.category}
              </span>
              <span className="px-5 py-2 rounded-full text-sm font-bold bg-blue-50 text-blue-600 
                             border-2 border-blue-200 animate-in zoom-in duration-500 delay-400 
                             hover:scale-110 transition-transform shadow-md">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 animate-spin-slow" />
                EQUITY
              </span>
            </div>
          </div>

          {/* Price Information Section */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center gap-2 mb-6 animate-in fade-in duration-500">
              <BarChart3 className="w-6 h-6 text-blue-600 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900">Price Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Current Price Card with Hover Effect */}
              <div className={`bg-white rounded-2xl p-5 border-2 ${borderChangeColor} 
                             hover:shadow-xl transition-all duration-300 group
                             animate-in slide-in-from-bottom duration-500 delay-100 
                             hover:scale-105`}>
                <div className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Current Price
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 
                               transition-colors">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${changeColor} font-bold mt-2 flex items-center gap-1`}>
                  {isPositive ? "▲" : "▼"}
                  <span>{Math.abs(stock.changePercent).toFixed(2)}%</span>
                </div>
              </div>

              {/* Day's Range with Animated Progress Bar */}
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 
                             hover:shadow-xl transition-all duration-300 group
                             animate-in slide-in-from-bottom duration-500 delay-150 
                             hover:scale-105">
                <div className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Day's Range
                </div>
                <div className="text-base font-bold text-gray-900 mb-3">
                  ₹{stock.low.toFixed(2)} - ₹{stock.high.toFixed(2)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 
                              rounded-full transition-all duration-1000 shadow-lg relative
                              animate-in slide-in-from-left duration-1000 delay-500"
                    style={{ width: `${priceRangePercent}%` }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent 
                                   via-white/40 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  Current at {priceRangePercent.toFixed(0)}% of range
                </div>
              </div>

              {/* Open Price */}
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 
                             hover:shadow-xl transition-all duration-300 group
                             animate-in slide-in-from-bottom duration-500 delay-200 
                             hover:scale-105">
                <div className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Open
                </div>
                <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 
                               transition-colors">
                  ₹{stock.open.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 mt-2">Today's opening</div>
              </div>

              {/* Previous Close */}
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 
                             hover:shadow-xl transition-all duration-300 group
                             animate-in slide-in-from-bottom duration-500 delay-250 
                             hover:scale-105">
                <div className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Previous Close
                </div>
                <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 
                               transition-colors">
                  ₹{stock.previousClose.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 mt-2">Yesterday's close</div>
              </div>

              {/* Day High with Green Theme */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 
                             border-2 border-green-200 hover:border-green-300 hover:shadow-xl 
                             transition-all duration-300 group animate-in slide-in-from-bottom 
                             duration-500 delay-300 hover:scale-105">
                <div className="text-xs text-green-700 mb-2 font-semibold uppercase tracking-wide 
                               flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                  Day High
                </div>
                <div className="text-2xl font-bold text-green-700 group-hover:text-green-800 
                               transition-colors">
                  ₹{stock.high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-green-600 mt-2 font-medium">Peak price today</div>
              </div>

              {/* Day Low with Red Theme */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5 
                             border-2 border-red-200 hover:border-red-300 hover:shadow-xl 
                             transition-all duration-300 group animate-in slide-in-from-bottom 
                             duration-500 delay-350 hover:scale-105">
                <div className="text-xs text-red-700 mb-2 font-semibold uppercase tracking-wide 
                               flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 animate-bounce" />
                  Day Low
                </div>
                <div className="text-2xl font-bold text-red-700 group-hover:text-red-800 
                               transition-colors">
                  ₹{stock.low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-red-600 mt-2 font-medium">Lowest price today</div>
              </div>
            </div>
          </div>

          {/* Trading Information Section */}
          <div className="p-8 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center gap-2 mb-6 animate-in fade-in duration-500">
              <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900">Trading Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Total Volume with Purple Theme */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 
                             border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl 
                             transition-all duration-300 group animate-in zoom-in duration-500 
                             delay-100 hover:scale-105">
                <div className="text-xs text-purple-700 mb-3 font-bold uppercase tracking-wide 
                               flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Total Volume
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 
                               transition-colors">
                  {(stock.volume / 100000).toFixed(2)} Lakh
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stock.volume.toLocaleString('en-IN')} shares traded
                </div>
              </div>

              {/* Total Traded Value with Blue Theme */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 
                             border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl 
                             transition-all duration-300 group animate-in zoom-in duration-500 
                             delay-200 hover:scale-105">
                <div className="text-xs text-blue-700 mb-3 font-bold uppercase tracking-wide 
                               flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 animate-pulse" />
                  Total Traded Value
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 
                               transition-colors">
                  ₹{(stock.marketCap / 10000000).toFixed(2)} Cr
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  ₹{stock.marketCap.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Last Updated with Animation */}
          <div className="p-5 bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-200 
                         rounded-b-3xl">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 
                           animate-in fade-in duration-500 delay-300">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span className="font-semibold">
                Last Updated: {new Date(stock.timestamp).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  hour12: true,
                })}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}

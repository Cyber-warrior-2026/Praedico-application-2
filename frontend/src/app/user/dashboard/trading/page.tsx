"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, Layers, ArrowRight, Activity, Sparkles, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function TradingPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const tradingOptions = [
    {
      id: "nifty50",
      title: "Nifty 50",
      description: "India's top 50 blue-chip companies",
      count: "50 Stocks",
      icon: TrendingUp,
      route: "/user/dashboard/trading/nifty50",
      gradient: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      hoverTextColor: "hover:text-blue-600 dark:hover:text-blue-400",
      iconBg: "bg-blue-500 dark:bg-blue-600",
      borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
      shadowColor: "shadow-blue-200 dark:shadow-blue-900/20",
    },
    {
      id: "etf",
      title: "ETF",
      description: "Exchange Traded Funds portfolio",
      count: "300+ Funds",
      icon: Layers,
      route: "/user/dashboard/trading/etf",
      gradient: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
      hoverTextColor: "hover:text-purple-600 dark:hover:text-purple-400",
      iconBg: "bg-purple-500 dark:bg-purple-600",
      borderHover: "hover:border-purple-300 dark:hover:border-purple-700",
      shadowColor: "shadow-purple-200 dark:shadow-purple-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-24 pb-12 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header Section */}
        <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r 
                         from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 mb-4 
                         animate-in zoom-in duration-500">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Live Market Data</span>
          </div>

          {/* Title with Gradient */}
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 
                         bg-clip-text text-transparent mb-3 animate-in slide-in-from-bottom-3 
                         duration-700 delay-100">
            Stock Market Trading
          </h1>

          <p className="text-gray-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto animate-in fade-in 
                       slide-in-from-bottom-2 duration-700 delay-200">
            Access real-time market data from NSE India • Updated every 2 minutes
          </p>
        </div>

        {/* Trading Options Grid with Stagger Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {tradingOptions.map((option, index) => {
            const Icon = option.icon;
            const isHovered = hoveredCard === option.id;

            return (
              <div
                key={option.id}
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push(option.route)}
                className={`group relative ${option.bgColor} rounded-3xl p-6 md:p-8 cursor-pointer 
                           transition-all duration-500 border-2 ${option.borderHover}
                           ${isHovered ? 'scale-105 -translate-y-2 shadow-2xl' : 'scale-100 border-transparent shadow-lg'}
                           animate-in fade-in slide-in-from-bottom-6 duration-700`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} 
                               opacity-0 group-hover:opacity-10 rounded-3xl transition-all 
                               duration-500 blur-xl`} />

                {/* Floating Particles Effect */}
                {isHovered && (
                  <>
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-400 
                                   animate-ping" />
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-purple-400 
                                   animate-ping" style={{ animationDelay: '0.1s' }} />
                    <div className="absolute top-1/2 right-8 w-1 h-1 rounded-full bg-pink-400 
                                   animate-ping" style={{ animationDelay: '0.2s' }} />
                  </>
                )}

                {/* Icon with Bounce Animation */}
                <div className={`relative w-16 h-16 md:w-20 md:h-20 ${option.iconBg} rounded-2xl flex items-center 
                               justify-center mb-6 shadow-lg ${option.shadowColor}
                               group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:scale-110 transition-transform 
                                  duration-300" />

                  {/* Pulse Ring Effect */}
                  <div className={`absolute inset-0 ${option.iconBg} rounded-2xl opacity-0 
                                 group-hover:opacity-20 group-hover:scale-150 transition-all 
                                 duration-500`} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 ${option.hoverTextColor}
                               transition-colors duration-300`}>
                    {option.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-400 mb-5 leading-relaxed text-sm md:text-base">
                    {option.description}
                  </p>

                  {/* Stats Badge with Pulse */}
                  <div className="flex items-center gap-2 mb-6 animate-pulse">
                    <Activity className={`w-4 h-4 ${option.textColor}`} />
                    <span className={`text-sm font-bold ${option.textColor}`}>
                      {option.count}
                    </span>
                    <Sparkles className="w-3 h-3 text-yellow-500 animate-spin-slow" />
                  </div>

                  {/* CTA with Slide Animation */}
                  <div className={`flex items-center gap-2 ${option.textColor} font-bold text-base md:text-lg
                                 group-hover:gap-4 transition-all duration-300`}>
                    <span className="relative">
                      View Stocks
                      {/* Underline Animation */}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${option.iconBg} 
                                      group-hover:w-full transition-all duration-300`} />
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform 
                                          duration-300" />
                  </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-yellow-200 
                               to-orange-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 
                               transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Live Data Indicator with Pulse */}
        <div className="flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 
                       duration-700 delay-500">
          <div className="bg-white dark:bg-slate-900 rounded-2xl px-6 py-4 md:px-8 shadow-lg border-2 border-gray-200 dark:border-slate-800 
                         flex flex-col md:flex-row items-center gap-3 md:gap-4 hover:shadow-xl hover:scale-105 transition-all 
                         duration-300 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping" />
              </div>
              <span className="md:hidden text-sm font-bold text-gray-800 dark:text-white">Live Data Active</span>
            </div>
            <span className="text-xs md:text-sm text-gray-700 dark:text-slate-300 font-semibold">
              Updates every 2 minutes during market hours
            </span>
            <div className="hidden md:block w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
          </div>
        </div>
      </div>

    </div>
  );
}
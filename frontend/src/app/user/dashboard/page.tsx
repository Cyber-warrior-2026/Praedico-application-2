"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PriceRangeSlider from "@/app/user/_components/PriceRangeSlider";
import { useTheme } from "@/context/ThemeContext"; // 👈 Import Theme Context
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Plus
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { authApi } from "@/lib/api"; 

// --- MOCK DATA ---
const portfolioData = [
  { name: 'Mon', value: 14000 },
  { name: 'Tue', value: 13500 },
  { name: 'Wed', value: 14200 },
  { name: 'Thu', value: 13800 },
  { name: 'Fri', value: 14500 },
  { name: 'Sat', value: 14100 },
  { name: 'Sun', value: 14032 },
];

const mainChartData = [
  { time: '10 am', value: 11550 },
  { time: '10:30', value: 11600 },
  { time: '11 am', value: 11580 },
  { time: '11:30', value: 11620 },
  { time: '12 pm', value: 11650 },
  { time: '12:30', value: 11600 },
  { time: '1 pm', value: 11680 },
  { time: '1:30', value: 11690 },
  { time: '2 pm', value: 11670 },
];

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { theme } = useTheme(); // 👈 Get current theme

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getMe();
        if (response.success) {
          setUser(response.user);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthorized) return null;

  // --- THEME CONSTANTS FOR CHARTS ---
  const isDark = theme === 'dark';
  const gridColor = isDark ? "#1e293b" : "#F1F5F9";
  const axisColor = isDark ? "#64748b" : "#94A3B8";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipText = isDark ? "#F8FAFC" : "#1E293B";

  // Common styles
  const cardBase = "bg-white dark:bg-[#0B1121]/60 border border-slate-100 dark:border-white/5 rounded-[24px] shadow-sm backdrop-blur-xl transition-all duration-300";
  const textMain = "text-slate-800 dark:text-slate-100";
  const textSub = "text-slate-400 dark:text-slate-500";

  return (
    <div className="px-4 md:px-8 lg:px-10 pb-10 max-w-[1920px] mx-auto">
      {/* SPACER */}
      <div className="h-24 md:h-28 w-full" />

      {/* SECTION 1: MY STOCKS */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-lg font-bold ${textMain}`}>My Stocks</h2>
          <button className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] dark:hover:text-indigo-400 transition-colors">View All</button>
        </div>
        {/* Responsive Grid: 1 col on mobile -> 5 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StockCard symbol="NVDA" name="Nvidia" price="203.65" change="+5.63" bg="bg-[#D1FAE5] dark:bg-emerald-900/20" text="text-[#065F46] dark:text-emerald-400" chartColor="#059669" isDark={isDark} />
          <StockCard symbol="META" name="Meta" price="151.74" change="-4.44" bg="bg-[#E0E7FF] dark:bg-indigo-900/20" text="text-[#3730A3] dark:text-indigo-400" isNegative chartColor="#4F46E5" isDark={isDark} />
          <StockCard symbol="TSLA" name="Tesla Inc" price="177.90" change="+17.63" bg="bg-[#FEF3C7] dark:bg-amber-900/20" text="text-[#92400E] dark:text-amber-400" chartColor="#D97706" isDark={isDark} />
          <StockCard symbol="AAPL" name="Apple Inc" price="145.93" change="+23.41" bg="bg-[#DCFCE7] dark:bg-green-900/20" text="text-[#166534] dark:text-green-400" chartColor="#16A34A" isDark={isDark} />
          <StockCard symbol="AMD" name="AMD" price="75.40" change="+5.40" bg="bg-[#FCE7F3] dark:bg-pink-900/20" text="text-[#9D174D] dark:text-pink-400" chartColor="#DB2777" isDark={isDark} />
        </div>
      </section>

      {/* SECTION 2: MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">

        {/* COLUMN 1: STATS */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Total Balance */}
          <div className="bg-[#6366F1] dark:bg-indigo-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2">Total Balance</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold tracking-tight">$14,032.56</h3>
                <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  +5.63% <TrendingUp size={12} />
                </span>
              </div>
            </div>
          </div>

          {/* Invested Value */}
          <div className="bg-[#1E293B] dark:bg-[#0F172A] rounded-[24px] p-6 text-white shadow-xl shadow-slate-900/10 dark:border dark:border-white/10 relative flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Invested Value</p>
              <h3 className="text-2xl font-bold tracking-tight">$7,532.21</h3>
            </div>
            <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-45 transition-transform duration-300">
              <ChevronRight size={20} />
            </div>
          </div>

          {/* Top Stock Card */}
          <div className={`${cardBase} p-6 flex-1 flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className={`text-[10px] ${textSub} font-bold uppercase tracking-wider mb-2`}>Top Performing Stock</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-sm shadow-sm border border-red-100 dark:border-red-900/20">T</div>
                  <div>
                    <h3 className={`font-bold ${textMain} text-sm`}>Tesla Inc</h3>
                    <span className={`text-[10px] bg-slate-100 dark:bg-white/5 ${textSub} px-1.5 py-0.5 rounded`}>TSLA</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1"><TrendingUp size={12} /> +17.63%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                <p className={`text-[10px] ${textSub} mb-1`}>Invested</p>
                <p className={`font-bold ${textMain}`}>$29.34</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                <p className={`text-[10px] ${textSub} mb-1`}>Current</p>
                <p className={`font-bold ${textMain}`}>$177.90</p>
              </div>
            </div>
            <div className="h-12 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{ v: 10 }, { v: 20 }, { v: 15 }, { v: 25 }, { v: 30 }, { v: 25 }, { v: 35 }]}>
                  <defs>
                    <linearGradient id="miniGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2} fill="url(#miniGreen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <button className="w-full py-3 bg-[#6366F1] text-white rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              View Details
            </button>
          </div>
        </div>

        {/* COLUMN 2: MAIN CHART */}
        <div className={`xl:col-span-6 ${cardBase} p-6 flex flex-col h-full min-h-[450px]`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50 dark:border-white/5">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#6366F1] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-transform active:scale-95">NASDAQ</button>
              <button className={`px-4 py-2 ${textSub} hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold rounded-xl transition-colors`}>SSE</button>
              <button className={`px-4 py-2 ${textSub} hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold rounded-xl transition-colors`}>Euronext</button>
            </div>
            <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-lg">
              {['1D', '5D', '1M', '6M', '1Y'].map(time => (
                <button key={time} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${time === '1D' ? 'bg-white dark:bg-white/10 text-[#6366F1] dark:text-white shadow-sm' : `${textSub} hover:text-slate-600 dark:hover:text-slate-300`}`}>{time}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mainChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor }} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
                    backgroundColor: tooltipBg,
                    color: tooltipText
                  }}
                  cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fill="url(#mainChartColor)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Footer Stats for Chart */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-white/5">
            {[
                { label: "High", val: "11,691.89" },
                { label: "Low", val: "11,470.47" },
                { label: "Prev Close", val: "11,512.41" },
                { label: "Open", val: "11,690.11" }
            ].map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                    <p className={`text-[10px] ${textSub} uppercase tracking-wider mb-1`}>{stat.label}</p>
                    <p className={`font-bold ${textMain} text-sm`}>{stat.val}</p>
                </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: SLIDER */}
        <div className="xl:col-span-3 h-full min-h-[400px]">
          <PriceRangeSlider />
        </div>
      </div>

      {/* 4. BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Analytics */}
        <div className={`lg:col-span-8 ${cardBase} p-6 relative overflow-hidden h-[350px]`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold ${textMain} text-lg`}>Portfolio Analytics</h3>
            <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-lg">
              {['1D', '1W', '1M', '1Y'].map(time => (
                <button key={time} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${time === '1D' ? 'bg-white dark:bg-white/10 text-[#6366F1] dark:text-white shadow-sm' : `${textSub}`}`}>{time}</button>
              ))}
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: tooltipBg, color: tooltipText }}
                />
                <Line type="monotone" dataKey="value" stroke="#818CF8" strokeWidth={3} dot={{ r: 4, fill: isDark ? "#0F172A" : "#fff", stroke: "#6366F1", strokeWidth: 2 }} activeDot={{ r: 8, fill: "#6366F1", stroke: "#fff", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watchlist */}
        <div className={`lg:col-span-4 ${cardBase} p-6 flex flex-col h-[350px]`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold ${textMain} text-lg`}>Watchlist</h3>
            <button className="w-8 h-8 bg-[#6366F1] rounded-lg text-white flex items-center justify-center hover:bg-[#4F46E5] shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar-dark">
            <WatchlistItem name="Amazon" ticker="AMZN" price="102.24" change="+3.02" isDark={isDark} />
            <WatchlistItem name="Coca-Cola" ticker="KO" price="60.49" change="-0.32" isNegative isDark={isDark} />
            <WatchlistItem name="BMW" ticker="BMW" price="92.94" change="+0.59" isDark={isDark} />
            <WatchlistItem name="McDonald's" ticker="MCD" price="266.32" change="+1.24" isDark={isDark} />
            <WatchlistItem name="Google" ticker="GOOGL" price="132.32" change="+2.12" isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS (Updated for Theme)
// ==========================================

function StockCard({ symbol, name, price, change, bg, text, chartColor, isNegative, isDark }: any) {
  return (
    <div className={`p-5 rounded-[24px] ${bg} transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group border border-transparent dark:border-white/5`}>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <span className={`text-[10px] font-bold ${text}`}>{symbol[0]}</span>
          </div>
          <span className={`text-sm font-bold ${text}`}>{name}</span>
        </div>
        <span className={`text-[10px] font-bold ${text} opacity-70`}>{symbol}</span>
      </div>
      <p className={`text-[10px] font-semibold opacity-60 mb-1 ${text}`}>Current Value</p>
      <div className="flex justify-between items-end relative z-10">
        <p className={`text-xl font-bold ${text}`}>${price}</p>
        <span className={`text-xs font-bold ${isNegative ? 'text-red-500' : 'text-green-600 dark:text-emerald-400'}`}>{change}</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 group-hover:scale-110 transition-transform origin-bottom">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 22 }]}>
            <Line type="monotone" dataKey="v" stroke={chartColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function WatchlistItem({ name, ticker, price, change, isNegative, isDark }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
          <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{ticker[0]}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{name}</p>
          <p className="text-[10px] font-bold text-slate-400">{ticker}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">${price}</p>
        <p className={`text-xs font-bold ${isNegative ? 'text-red-500' : 'text-green-500'} flex items-center justify-end gap-0.5`}>
          {isNegative ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {change}
        </p>
      </div>
    </div>
  );
}
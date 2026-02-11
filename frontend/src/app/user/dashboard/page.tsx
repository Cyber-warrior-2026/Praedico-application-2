"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PriceRangeSlider from "@/app/user/_components/PriceRangeSlider";
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
// Use your centralized API handler (ensure it points to /api or uses the proxy)
import { authApi } from "@/lib/api";
// OR if you want to use axios directly for now, ensure it points to relative path
import axios from 'axios';

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ FIXED: Use relative path (Proxy will handle the rest)
        // This works on Localhost AND Vercel automatically
        const response = await authApi.getMe();



        // Alternative (Better): If authApi is configured with axiosInstance
        // const response = await authApi.getMe(); 

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

  if (!isAuthorized) return null; // Or a loading spinner

  return (
    <div className="px-6 md:px-8 lg:px-10 pb-10">
      {/* SPACER: Pushes content down so Navbar floats above */}
      <div className="h-28 w-full" />

      {/* SECTION 1: MY STOCKS */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">My Stocks</h2>
          <button className="text-xs font-bold text-[#6366F1] hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StockCard symbol="NVDA" name="Nvidia" price="203.65" change="+5.63" bg="bg-[#D1FAE5] dark:bg-emerald-900/30" text="text-[#065F46] dark:text-emerald-400" chartColor="#059669" />
          <StockCard symbol="META" name="Meta" price="151.74" change="-4.44" bg="bg-[#E0E7FF] dark:bg-indigo-900/30" text="text-[#3730A3] dark:text-indigo-400" isNegative chartColor="#4F46E5" />
          <StockCard symbol="TSLA" name="Tesla Inc" price="177.90" change="+17.63" bg="bg-[#FEF3C7] dark:bg-amber-900/30" text="text-[#92400E] dark:text-amber-400" chartColor="#D97706" />
          <StockCard symbol="AAPL" name="Apple Inc" price="145.93" change="+23.41" bg="bg-[#DCFCE7] dark:bg-green-900/30" text="text-[#166534] dark:text-green-400" chartColor="#16A34A" />
          <StockCard symbol="AMD" name="AMD" price="75.40" change="+5.40" bg="bg-[#FCE7F3] dark:bg-pink-900/30" text="text-[#9D174D] dark:text-pink-400" chartColor="#DB2777" />
        </div>
      </section>

      {/* SECTION 2: MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

        {/* COLUMN 1: STATS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#6366F1] rounded-[24px] p-6 text-white shadow-md relative overflow-hidden transition-all duration-300">

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

          <div className="bg-[#1E293B] dark:bg-slate-800 rounded-[24px] p-6 text-white shadow-xl shadow-slate-900/10 relative flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Invested Value</p>
              <h3 className="text-2xl font-bold tracking-tight">$7,532.21</h3>
            </div>
            <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-45 transition-transform duration-300">
              <ChevronRight size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[24px] p-6 border border-slate-100 dark:border-white/10 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Top Performing Stock</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-sm shadow-sm border border-red-100 dark:border-red-800/50">T</div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Tesla Inc</h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">TSLA</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-bold flex items-center justify-end gap-1"><TrendingUp size={12} /> +17.63%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 mb-1">Invested Value</p>
                <p className="font-bold text-slate-800 dark:text-white">$29.34</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 mb-1">Current Price</p>
                <p className="font-bold text-slate-800 dark:text-white">$177.90</p>
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
              View Stock Details
            </button>
          </div>
        </div>

        {/* COLUMN 2: MAIN CHART */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[24px] p-6 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col h-full">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50 dark:border-white/10">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#6366F1] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-transform active:scale-95">NASDAQ</button>
              <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors">SSE</button>
              <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors">Euronext</button>
            </div>
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
              {['1D', '5D', '1M', '6M', '1Y'].map(time => (
                <button key={time} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${time === '1D' ? 'bg-white dark:bg-slate-700 text-[#6366F1] shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{time}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mainChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" className="dark:stroke-slate-800" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fill="url(#mainChartColor)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-white/10">
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">High</p><p className="font-bold text-slate-800 dark:text-white text-sm">11,691.89</p></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Low</p><p className="font-bold text-slate-800 dark:text-white text-sm">11,470.47</p></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Prev Close</p><p className="font-bold text-slate-800 dark:text-white text-sm">11,512.41</p></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Open</p><p className="font-bold text-slate-800 dark:text-white text-sm">11,690.11</p></div>
          </div>
        </div>

        {/* COLUMN 3: SLIDER */}
        <div className="lg:col-span-3 h-full">
          <PriceRangeSlider />
        </div>
      </div>

      {/* 4. BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[24px] p-6 border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Portfolio Analytics</h3>
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
              {['1D', '1W', '1M', '1Y'].map(time => (
                <button key={time} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${time === '1D' ? 'bg-white dark:bg-slate-700 text-[#6366F1] shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{time}</button>
              ))}
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#6366F1] text-white text-xs p-3 rounded-xl shadow-xl shadow-indigo-500/30">
                          <p className="font-medium opacity-80 mb-1">Jan 30, 01:12 AM</p>
                          <p className="text-xl font-bold">${payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#818CF8" strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: "#6366F1", strokeWidth: 2 }} activeDot={{ r: 8, fill: "#6366F1", stroke: "#fff", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watchlist */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[24px] p-6 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Watchlist</h3>
            <button className="w-8 h-8 bg-[#6366F1] rounded-lg text-white flex items-center justify-center hover:bg-[#4F46E5] shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <WatchlistItem name="Amazon.com, Inc." ticker="AMZN" price="102.24" change="+3.02" logo="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" />
            <WatchlistItem name="Coca-Cola Co" ticker="KO" price="60.49" change="-0.32" isNegative logo="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" />
            <WatchlistItem name="BMW" ticker="BMW" price="92.94" change="+0.59" logo="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" />
            <WatchlistItem name="McDonald's Corp" ticker="MCD" price="266.32" change="+1.24" logo="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function StockCard({ symbol, name, price, change, bg, text, chartColor, isNegative }: any) {
  return (
    <div className={`p-5 rounded-[24px] ${bg} transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <span className={`text-[10px] font-bold ${text}`}>{symbol[0]}</span>
          </div>
          <span className={`text-sm font-bold ${text}`}>{name}</span>
        </div>
        <span className={`text-[10px] font-bold ${text} opacity-70`}>{symbol}</span>
      </div>
      <p className={`text-[10px] font-semibold opacity-60 mb-1 ${text}`}>Current Value</p>
      <div className="flex justify-between items-end relative z-10">
        <p className={`text-xl font-bold ${text}`}>${price}</p>
        <span className={`text-xs font-bold ${isNegative ? 'text-red-500' : 'text-green-600'}`}>{change}</span>
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

function WatchlistItem({ name, ticker, price, change, isNegative, logo }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
          <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{ticker[0]}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white">{name}</p>
          <p className="text-[10px] font-bold text-slate-400">{ticker}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-800 dark:text-white">${price}</p>
        <p className={`text-xs font-bold ${isNegative ? 'text-red-500' : 'text-green-500'} flex items-center justify-end gap-0.5`}>
          {isNegative ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {change}
        </p>
      </div>
    </div>
  );
}
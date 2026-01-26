"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PriceRangeSlider from "@/components/user/PriceRangeSlider"; // Ensure this path matches where you saved the slider
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Wallet,
  ArrowRightLeft,
  BookOpen,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
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
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setIsAuthorized(true);
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans text-slate-800">
      
      {/* =======================
          LEFT SIDEBAR
         ======================= */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex-shrink-0 hidden xl:flex flex-col p-8 fixed h-full z-20">
        
        {/* Logo / Header */}
        <div className="mb-12 px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Panel</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-3">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={Briefcase} label="Portfolio" onClick={() => setActiveTab("Portfolio")} />
          <NavItem icon={BarChart2} label="Trading & Market" onClick={() => setActiveTab("Trading")} />
          <NavItem icon={Wallet} label="Research Portal" onClick={() => setActiveTab("Research")} />
          <NavItem icon={Wallet} label="Wallet Transfer Pay" onClick={() => setActiveTab("Wallet")} />
          <NavItem icon={ArrowRightLeft} label="Reporting & Transact" onClick={() => setActiveTab("Reporting")} />
          <NavItem icon={BookOpen} label="Tutorial" onClick={() => setActiveTab("Tutorial")} />
        </nav>

        {/* "Thoughts Time" Card */}
        <div className="mt-8 bg-[#F0FDF4] p-6 rounded-3xl relative overflow-visible border border-green-100">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-green-100 ring-4 ring-[#F0FDF4]">
             <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center">
                <Lightbulb size={20} className="text-yellow-500 fill-yellow-500 animate-pulse" />
             </div>
          </div>
          <div className="mt-4 text-center">
            <h4 className="font-bold text-slate-700 text-sm mb-3">Thoughts Time</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              "If you aren't willing to own a stock for 10 years, don't even think about owning it for 10 minutes."
            </p>
          </div>
        </div>
      </aside>

      {/* =======================
          MAIN DASHBOARD CONTENT
         ======================= */}
      <main className="flex-1 xl:ml-[280px] p-8 lg:p-10 overflow-x-hidden">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Welcome back, {user?.email?.split('@')[0]} 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#6366F1] transition-colors" />
              <input 
                type="text" 
                placeholder="Search stocks..." 
                className="pl-12 pr-4 py-3 rounded-full bg-white border border-slate-200 text-sm w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all shadow-sm" 
              />
            </div>
            <button className="w-11 h-11 bg-white rounded-full border border-slate-200 text-slate-600 hover:text-[#6366F1] hover:border-[#6366F1]/30 flex items-center justify-center transition-all shadow-sm relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={handleLogout} className="w-11 h-11 bg-red-50 rounded-full border border-red-100 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all shadow-sm" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* SECTION 1: MY STOCKS (Horizontal Scrollable Grid) */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">My Stocks</h2>
            <button className="text-xs font-bold text-[#6366F1] hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <StockCard 
              symbol="NVDA" name="Nvidia" price="203.65" change="+5.63" 
              bg="bg-[#D1FAE5]" text="text-[#065F46]" chartColor="#059669" 
            />
            <StockCard 
              symbol="META" name="Meta" price="151.74" change="-4.44" 
              bg="bg-[#E0E7FF]" text="text-[#3730A3]" isNegative chartColor="#4F46E5"
            />
            <StockCard 
              symbol="TSLA" name="Tesla Inc" price="177.90" change="+17.63" 
              bg="bg-[#FEF3C7]" text="text-[#92400E]" chartColor="#D97706"
            />
            <StockCard 
              symbol="AAPL" name="Apple Inc" price="145.93" change="+23.41" 
              bg="bg-[#DCFCE7]" text="text-[#166534]" chartColor="#16A34A"
            />
            <StockCard 
              symbol="AMD" name="AMD" price="75.40" change="+5.40" 
              bg="bg-[#FCE7F3]" text="text-[#9D174D]" chartColor="#DB2777"
            />
          </div>
        </section>

        {/* SECTION 2: MAIN GRID (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* COLUMN 1: STATS & TOP STOCK (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Total Balance */}
            <div className="bg-[#6366F1] rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
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
            <div className="bg-[#1E293B] rounded-[24px] p-6 text-white shadow-xl shadow-slate-900/10 relative flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Invested Value</p>
                <h3 className="text-2xl font-bold tracking-tight">$7,532.21</h3>
              </div>
              <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-45 transition-transform duration-300">
                <ChevronRight size={20} />
              </div>
            </div>

            {/* Top Stock Details Card */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Top Performing Stock</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shadow-sm border border-red-100">T</div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Tesla Inc</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">TSLA</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-bold flex items-center justify-end gap-1"><TrendingUp size={12}/> +17.63%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 mb-1">Invested Value</p>
                  <p className="font-bold text-slate-800">$29.34</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 mb-1">Current Price</p>
                  <p className="font-bold text-slate-800">$177.90</p>
                </div>
              </div>

              <div className="h-12 w-full mb-4">
                 {/* Mini Area Chart Placeholder */}
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{v:10},{v:20},{v:15},{v:25},{v:30},{v:25},{v:35}]}>
                      <defs>
                        <linearGradient id="miniGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
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

          {/* COLUMN 2: MAIN CHART (Span 6) */}
          <div className="lg:col-span-6 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col h-full">
             <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50">
               <div className="flex gap-2">
                 <button className="px-4 py-2 bg-[#6366F1] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-transform active:scale-95">NASDAQ</button>
                 <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors">SSE</button>
                 <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors">Euronext</button>
               </div>
               <div className="flex bg-slate-50 p-1 rounded-lg">
                  {['1D', '5D', '1M', '6M', '1Y'].map(time => (
                    <button key={time} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${time === '1D' ? 'bg-white text-[#6366F1] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{time}</button>
                  ))}
               </div>
             </div>

             <div className="flex-1 min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mainChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mainChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'}} 
                      cursor={{stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '5 5'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fill="url(#mainChartColor)" activeDot={{r: 6, strokeWidth: 0}} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-50">
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">High</p>
                  <p className="font-bold text-slate-800 text-sm">11,691.89</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Low</p>
                  <p className="font-bold text-slate-800 text-sm">11,470.47</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Prev Close</p>
                  <p className="font-bold text-slate-800 text-sm">11,512.41</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Open</p>
                  <p className="font-bold text-slate-800 text-sm">11,690.11</p>
                </div>
             </div>
          </div>

          {/* COLUMN 3: SNAPSHOT SLIDER (Span 3) */}
          <div className="lg:col-span-3 h-full">
             <PriceRangeSlider />
          </div>

        </div>

        {/* SECTION 3: BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Portfolio Analytics Chart (Span 8) */}
          <div className="lg:col-span-8 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Portfolio Analytics</h3>
              <div className="flex bg-slate-50 p-1 rounded-lg">
                 {['1D', '1W', '1M', '1Y'].map(time => (
                    <button key={time} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${time === '1D' ? 'bg-white text-[#6366F1] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{time}</button>
                  ))}
              </div>
            </div>
            
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
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

          {/* Watchlist (Span 4) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Watchlist</h3>
              <button className="w-8 h-8 bg-[#6366F1] rounded-lg text-white flex items-center justify-center hover:bg-[#4F46E5] shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <WatchlistItem 
                name="Amazon.com, Inc." ticker="AMZN" price="102.24" change="+3.02" 
                logo="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
              />
              <WatchlistItem 
                name="Coca-Cola Co" ticker="KO" price="60.49" change="-0.32" isNegative 
                logo="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" 
              />
              <WatchlistItem 
                name="BMW" ticker="BMW" price="92.94" change="+0.59" 
                logo="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" 
              />
              <WatchlistItem 
                name="McDonald's Corp" ticker="MCD" price="266.32" change="+1.24" 
                logo="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg" 
              />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 text-sm font-bold
        ${active 
          ? "bg-[#6366F1] text-white shadow-xl shadow-indigo-500/30 translate-x-1" 
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"}
      `}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      {label}
    </button>
  );
}

function StockCard({ symbol, name, price, change, bg, text, chartColor, isNegative }: any) {
  return (
    <div className={`p-5 rounded-[24px] ${bg} transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
             {/* Icon Placeholder - would use Image in real app */}
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

      {/* Mini Sparkline Background */}
      <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 group-hover:scale-110 transition-transform origin-bottom">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[{v:10},{v:15},{v:12},{v:20},{v:18},{v:25},{v:22}]}>
               <Line type="monotone" dataKey="v" stroke={chartColor} strokeWidth={2} dot={false} />
            </LineChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}

function WatchlistItem({ name, ticker, price, change, isNegative, logo }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
           {/* Fallback to text if no image logic implemented */}
           <span className="font-bold text-xs text-slate-700">{ticker[0]}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{name}</p>
          <p className="text-[10px] font-bold text-slate-400">{ticker}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-800">${price}</p>
        <p className={`text-xs font-bold ${isNegative ? 'text-red-500' : 'text-green-500'} flex items-center justify-end gap-0.5`}>
          {isNegative ? <TrendingDown size={10}/> : <TrendingUp size={10}/>} {change}
        </p>
      </div>
    </div>
  );
}
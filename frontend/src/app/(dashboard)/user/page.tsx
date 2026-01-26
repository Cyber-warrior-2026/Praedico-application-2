"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  FileText,
  CreditCard,
  RefreshCw,
  BookOpen,
  LightbulbIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Menu,
  X
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function UserDashboard() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Chart Data
  const chartData = [
    { name: "Jan", value: 9000 },
    { name: "Feb", value: 9500 },
    { name: "Mar", value: 11000 },
    { name: "Apr", value: 10500 },
    { name: "May", value: 12000 },
    { name: "Jun", value: 12051 },
  ];

  // Navigation Items
  const navItems = [
    { href: "/user", label: "Dashboard", icon: LayoutDashboard },
    { href: "/user/portfolio", label: "Portfolio", icon: Briefcase },
    { href: "/user/trading", label: "Trading & Market", icon: TrendingUp },
    { href: "/user/research", label: "Research Portal", icon: FileText },
    { href: "/user/wallet", label: "Wallet Transfer Pay", icon: CreditCard },
    { href: "/user/reporting", label: "Reporting & Transact", icon: RefreshCw },
    { href: "/user/tutorial", label: "Tutorial", icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen ? (
            <>
              <div>
                <h1 className="text-xl font-bold text-gray-800">USER PANEL</h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mx-auto p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={!isSidebarOpen ? item.label : ""}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Thoughts Time Card - Only when open */}
        {isSidebarOpen && (
          <div className="p-4 mx-2 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-3 mx-auto">
              <LightbulbIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 text-center mb-2">
              Thoughts Time
            </h3>
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              "If you aren't willing to own a stock for 10 years, don't even think about owning it for 10 minutes."
            </p>
          </div>
        )}
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            {/* Mobile Sidebar Content (same as desktop) */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">USER PANEL</h1>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          {/* Left: Mobile Menu + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                Welcome back, <span className="font-semibold">sjkivines4</span> 👋
              </p>
            </div>
          </div>

          {/* Right: Search + Icons + Profile */}
          <div className="flex items-center gap-3">
            {/* Search - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout Button */}
         {/* Logout Button */}
<button 
  onClick={() => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }}
  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500 hover:bg-red-50"
  title="Logout"
>
  <LogOut className="w-5 h-5" />
</button>

          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {/* My Stocks Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">My Stocks</h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>

            {/* Stock Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Nvidia Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                    N
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Nvidia</h3>
                    <p className="text-xs text-gray-500">NVDA</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">$203.65</p>
                  <span className="text-sm font-semibold text-green-600">+5.63</span>
                </div>
              </div>

              {/* Meta Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                    M
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Meta</h3>
                    <p className="text-xs text-gray-500">META</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">$151.74</p>
                  <span className="text-sm font-semibold text-red-600">-4.44</span>
                </div>
              </div>

              {/* Tesla Card */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    T
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Tesla Inc</h3>
                    <p className="text-xs text-gray-500">TSLA</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">$177.90</p>
                  <span className="text-sm font-semibold text-green-600">+17.63</span>
                </div>
              </div>

              {/* Apple Card */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Apple Inc</h3>
                    <p className="text-xs text-gray-500">AAPL</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">$145.93</p>
                  <span className="text-sm font-semibold text-green-600">+23.41</span>
                </div>
              </div>

              {/* AMD Card */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">AMD</h3>
                    <p className="text-xs text-gray-500">AMD</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">$75.40</p>
                  <span className="text-sm font-semibold text-green-600">+5.40</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Balance Cards + Chart + Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Balance Cards */}
            <div className="space-y-4">
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                <p className="text-sm opacity-90 mb-1">TOTAL BALANCE</p>
                <div className="flex items-end justify-between mb-2">
                  <h2 className="text-3xl font-bold">$14,032.56</h2>
                  <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded-lg">
                    +5.63%
                  </span>
                </div>
              </div>

              {/* Invested Value Card */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <p className="text-sm text-gray-400 mb-1">INVESTED VALUE</p>
                <h2 className="text-3xl font-bold">$7,532.21</h2>
              </div>

              {/* Top Performing Stock */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500 mb-3">TOP PERFORMING STOCK</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    T
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Tesla Inc</h3>
                    <p className="text-xs text-gray-500">TSLA</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-semibold text-green-600">+17.63%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Invested Value</p>
                    <p className="font-semibold text-gray-800">$29.34</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Current Price</p>
                    <p className="font-semibold text-gray-800">$177.90</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 lg:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4">Portfolio Analytics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column: Snapshot */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Snapshot</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Prev Close</span>
                  <span className="font-semibold text-gray-800">12,051.48</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Open</span>
                  <span className="font-semibold text-gray-800">12,000.21</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Day Low</span>
                  <span className="font-semibold text-gray-800">11,999.87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Day High</span>
                  <span className="font-semibold text-gray-800">12,248.15</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">52 Week Low</span>
                    <span className="font-semibold text-gray-800">10,440.64</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">52 Week High</span>
                  <span className="font-semibold text-gray-800">15,265.42</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  LayoutDashboard, Briefcase, BarChart2, Wallet,
  ArrowRightLeft, LogOut, Bell, Search, User, Settings, ChevronDown,
  Newspaper, Menu, X, Sun, Moon
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/shared-components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared-components/ui/avatar";
import { useTheme } from "next-themes";

export function UserNavbar() {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("Loading...");
  const [currentPlan, setCurrentPlan] = useState("Free"); // Added state
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // 1. Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getMe();

        if (data.success && data.user) {
          // 👇 CHANGE THIS PART
          // If data.user.name is empty, fallback to the part of the email before '@'
          const nameFromEmail = data.user.email?.split('@')[0];
          setUserName(data.user.name || nameFromEmail);
          setUserEmail(data.user.email);
          setCurrentPlan(data.user.currentPlan || "Free"); // Set plan
        }
      } catch (e) { console.error("Guest mode"); }
    };
    fetchProfile();

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Navigation Items
  const navItems = [
    { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { label: "Portfolio", href: "/user/portfolio", icon: Briefcase },
    { label: "Trading", href: "/user/dashboard/trading", icon: BarChart2 },
    { label: "News", href: "/user/news", icon: Newspaper }, // ✨ Added News Tab
    { label: "Premium", href: "/user/premium", icon: Wallet },
    { label: "Reports", href: "/user/reports", icon: ArrowRightLeft },
  ];

  // 3. Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* GLOBAL KEYFRAMES */}
      <style jsx global>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mobileMenuSlide {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-mobile-menu { animation: mobileMenuSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 animate-slide-down ${scrolled || mobileMenuOpen
          ? "bg-white/70 dark:bg-background/80 backdrop-blur-2xl border-b border-indigo-100/50 dark:border-white/[0.02] shadow-sm shadow-indigo-500/5"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-8 h-20 flex items-center justify-between relative z-50">

          {/* LEFT: LOGO */}
          <div className="flex items-center gap-12">
            <Link href="/user/dashboard" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative h-10 w-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-xl border border-white/10 group-hover:scale-105 transition-transform duration-300">
                  P
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 hidden md:block tracking-tight drop-shadow-sm">
                Praedico
              </span>
            </Link>

            {/* DESKTOP NAV - Premium Pills */}
            <nav className="hidden xl:flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/40 dark:border-slate-700/40 shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isActive
                      ? "text-white shadow-md shadow-indigo-500/25"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full -z-10 animate-fade-in" />
                    )}
                    <Icon size={18} className={isActive ? "stroke-[2.5px]" : "stroke-[2px] opacity-70"} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-4">

            {/* Search Bar (Hidden on Mobile) */}
            <div className="relative hidden lg:block group">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-md group-hover:bg-indigo-500/10 transition-colors duration-300"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="h-11 pl-11 pr-6 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 transition-all w-64 backdrop-blur-md shadow-sm dark:text-slate-200 dark:placeholder-slate-500"
                />
              </div>
            </div>



            {/* Bell Notification */}
            <button className="relative h-11 w-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 hover:scale-105 shadow-sm transition-all duration-300 group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>

            {/* MOBILE TOGGLE BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden h-11 w-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all active:scale-95"
            >
              {/* Lucide Menu/X icons will need to be imported if not already */}
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
              )}
            </button>


            {/* PROFILE DROPDOWN (Desktop Only - Mobile version in Menu) */}
            <div className="hidden xl:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 group backdrop-blur-sm">
                    <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-700 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
                      <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{userName}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{currentPlan} Account</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-60 mt-4 p-2 rounded-2xl border-slate-100 dark:border-white/10 shadow-xl shadow-indigo-500/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl" align="end">
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-slate-800 dark:text-white">{userName}</p>
                      <p className="text-xs leading-none text-slate-500 dark:text-slate-400 font-medium">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem className="cursor-pointer rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:text-indigo-700 dark:focus:text-indigo-300 py-2.5 font-medium transition-colors">
                    <User className="mr-3 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:text-indigo-700 dark:focus:text-indigo-300 py-2.5 font-medium transition-colors">
                    <Settings className="mr-3 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:text-indigo-700 dark:focus:text-indigo-300 py-2.5 font-medium transition-colors"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun className="mr-3 h-4 w-4" /> : <Moon className="mr-3 h-4 w-4" />}
                    <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-xl py-2.5 font-bold cursor-pointer transition-colors"
                    onClick={async () => {
                      try {
                        await authApi.logout();
                        window.location.href = "/";
                      } catch (e) { }
                    }}
                  >
                    <LogOut className="mr-3 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>

        {/* --- BEAUTIFUL MOBILE TOP TOGGLE MENU --- */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white/80 dark:bg-background/80 backdrop-blur-2xl border-b border-indigo-100/50 dark:border-white/10/50 shadow-2xl shadow-indigo-500/10 p-6 flex flex-col gap-4 animate-mobile-menu zl:hidden origin-top scale-y-100">

            {/* Mobile Profile Snippet */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 mb-2">
              <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-700 shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
                <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200 border ${isActive
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200"
                      }`}
                  >
                    <Icon size={24} className={isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="h-px bg-slate-200/60 dark:bg-slate-700/60 my-2" />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>

            <button
              onClick={async () => {
                try { await authApi.logout(); window.location.href = "/"; } catch (e) { }
              }}
              className="w-full py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        )}

      </header>
    </>
  );
}
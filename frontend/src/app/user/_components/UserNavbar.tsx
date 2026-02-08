"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  LayoutDashboard, Briefcase, BarChart2, Wallet,
  ArrowRightLeft, LogOut, Bell, Search, User, Settings, ChevronDown,
  Newspaper, Sun, Moon, Menu, X
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/shared-components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared-components/ui/avatar";
import { useTheme } from "@/context/ThemeContext";

export function UserNavbar() {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("Loading...");
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Fetch User Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getMe();
        if (data.success && data.user) {
          const nameFromEmail = data.user.email?.split('@')[0];
          setUserName(data.user.name || nameFromEmail);
          setUserEmail(data.user.email);
          setCurrentPlan(data.user.currentPlan || "Free");
        }
      } catch (e) { console.error("Guest mode"); }
    };
    fetchProfile();

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { label: "Portfolio", href: "/user/portfolio", icon: Briefcase },
    { label: "Trading", href: "/user/dashboard/trading", icon: BarChart2 },
    { label: "News", href: "/user/news", icon: Newspaper },
    { label: "Premium", href: "/user/premium", icon: Wallet },
    { label: "Reports", href: "/user/reports", icon: ArrowRightLeft },
  ];

  // Theme-Aware Styles
  const navClasses = scrolled 
    ? "bg-white/80 dark:bg-[#0B1121]/90 backdrop-blur-xl border-b border-indigo-100/50 dark:border-white/5 shadow-sm"
    : "bg-transparent border-transparent";

  const mobileMenuClasses = theme === 'dark' 
    ? "bg-[#0B1121] border-b border-white/10" 
    : "bg-white border-b border-slate-100";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${navClasses}`}>
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

        {/* --- LEFT SECTION: LOGO & MOBILE TOGGLE --- */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/user/dashboard" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 md:h-10 md:w-10">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative h-full w-full bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-xl border border-white/10">
                P
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 hidden md:block">
              Praedico
            </span>
          </Link>

          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-white/5 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-white/40 dark:border-white/10 shadow-sm ml-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md shadow-indigo-500/25"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full -z-10 animate-fade-in" />
                  )}
                  <Icon size={16} className={isActive ? "stroke-[2.5px]" : "stroke-[2px] opacity-70"} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* --- RIGHT SECTION: ACTIONS --- */}
        <div className="flex items-center gap-3 md:gap-5">

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-yellow-400 transition-all shadow-sm active:scale-95"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Search (Desktop Only) */}
          <div className="relative hidden xl:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search assets..."
              className="h-11 pl-11 pr-6 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all w-64 backdrop-blur-md shadow-sm"
            />
          </div>

          {/* Notifications */}
          <button className="relative h-11 w-11 flex items-center justify-center rounded-full bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
            <Bell size={20} />
            <span className="absolute top-2.5 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B1121]"></span>
          </button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-1.5 pr-1.5 md:pr-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all group backdrop-blur-sm">
                <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-white/10 shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
                  <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{userName}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{currentPlan}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            
            {/* Dropdown Content */}
            <DropdownMenuContent className="w-60 mt-4 p-2 rounded-2xl border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#1a1f2e]/95 backdrop-blur-xl" align="end">
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-slate-800 dark:text-white">{userName}</p>
                    <p className="text-xs leading-none text-slate-500">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/10" />
                <DropdownMenuItem className="cursor-pointer rounded-xl dark:text-slate-300 focus:bg-indigo-50 dark:focus:bg-white/10 py-2.5 font-medium">
                  <User className="mr-3 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-xl dark:text-slate-300 focus:bg-indigo-50 dark:focus:bg-white/10 py-2.5 font-medium">
                  <Settings className="mr-3 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/10" />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-xl py-2.5 font-bold cursor-pointer"
                  onClick={async () => {
                    try { await authApi.logout(); window.location.href = "/"; } catch (e) { }
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4" /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden absolute top-20 left-0 w-full ${mobileMenuClasses} shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-5 z-40`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                  ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  );
}
"use client";

import { UserNavbar } from "@/app/user/_components/UserNavbar";
import Footer from "@/shared-components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* bg-slate-50 is Light Mode
         dark:bg-[#020617] is Dark Mode
      */}
      <div className="flex flex-col min-h-screen bg-[#F8F9FE] dark:bg-[#020617] font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 relative transition-colors duration-500">

        {/* 1. DYNAMIC BACKGROUND LAYER (Fixed) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 mix-blend-soft-light"></div>
        </div>

        {/* 2. NAVIGATION LAYER */}
        <div className="fixed top-0 left-0 w-full z-50">
          <UserNavbar />
        </div>

        {/* 3. MAIN CONTENT */}
        <main className="relative z-10 flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>

        {/* 4. FOOTER */}
        <div className="relative z-10 mt-auto border-t border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
          <Footer />
        </div>

      </div>
    </ThemeProvider>
  );
}
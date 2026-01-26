"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/shared/Footer";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- 🔒 SECURITY CHECK ---
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // --- ⏳ PREMIUM LOADING STATE ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="relative">
          {/* Glowing Ring */}
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/70 animate-pulse">
              Authenticating
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- ✨ THE FULLSCREEN DYNAMIC LAYOUT ---
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FE] font-sans text-slate-800 selection:bg-indigo-500/30 relative">
      
      {/* 1. DYNAMIC BACKGROUND LAYER (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Gradient Mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-100/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light"></div>
      </div>

      {/* 2. MAIN CONTENT (Fullscreen Edge-to-Edge) */}
      {/* Removed all padding and max-widths so the Child (Sidebar/Dashboard) controls the layout */}
      <main className="relative z-10 flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
         {children}
      </main>

      {/* 3. FOOTER */}
      <div className="relative z-10 mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-md">
        <Footer />
      </div>

    </div>
  );
}
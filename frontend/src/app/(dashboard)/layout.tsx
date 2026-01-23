"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import Footer from "@/components/shared/Footer";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- 🔒 THE SECURITY GATEKEEPER ---
  useEffect(() => {
    // 1. Check for the Key
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // 2. If no key, kick them out immediately
      router.replace("/login");
    } else {
      // 3. If key exists, let them in
      setIsAuthorized(true);
    }
  }, [router]);

  // --- ⏳ LOADING STATE (Prevents Content Flash) ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-12 w-12 bg-zinc-200 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Verifying Access...</p>
        </div>
      </div>
    );
  }

  // --- ✨ THE SECURE & BEAUTIFUL LAYOUT ---
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* Background Pattern (Subtle Dot Grid) */}
      <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* 1. The Top Menu */}
      <div className="relative z-10">
        <DashboardNavbar />
      </div>
      
      {/* 2. The Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>

      {/* 3. The Footer */}
      <div className="relative z-10 mt-auto border-t border-zinc-200 bg-white/50 backdrop-blur-sm">
        <Footer />
      </div>

    </div>
  );
}
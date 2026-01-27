"use client";

import { useEffect, useState } from "react";

import Footer from "@/shared-components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- 1. DYNAMIC SCROLL TRACKER ---
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- 2. GLOBAL PROGRESS BAR --- */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[100] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* --- 3. AMBIENT BACKGROUND (Fixed) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grain Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        
        {/* Deep Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* --- 4. NAVIGATION --- */}
      {/* We wrap Navbar in a z-index div to ensure it floats above the background */}
      <div className="relative z-50">
      </div>
      
      {/* --- 5. MAIN CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col animate-in fade-in duration-700 slide-in-from-bottom-4">
        {children}
      </main>

      {/* --- 6. FOOTER --- */}
      <div className="relative z-10 mt-auto border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl">
        <Footer />
      </div>

    </div>
  );
}
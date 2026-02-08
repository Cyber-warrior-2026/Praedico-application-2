"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Zap, Home, Box, Layers, BarChart2, Newspaper, 
  Mail, FileText, X, ChevronUp, Lock, ArrowRight, ScanLine
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import LoginModal from "@/app/user/_components/LoginModal";
import RegisterModal from "@/app/user/_components/RegisterModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Login Params
  useEffect(() => {
    if (searchParams.get("openLogin") === "true") {
      setIsLoginModalOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const handleSignIn = () => setIsLoginModalOpen(true);
  const handleGetStarted = () => setIsRegisterModalOpen(true);

  // --- NAV ITEMS ---
  const navItems = [
    { name: "Home", icon: Home, link: "/" },
    { name: "Product", icon: Box, link: "/product" },
    { name: "Solutions", icon: Layers, link: "/solutions" },
    { name: "Markets", icon: BarChart2, link: "/markets" },
    { name: "News", icon: Newspaper, link: "/news" },
    { name: "Contact", icon: Mail, link: "/contacts" },
    { name: "Docs", icon: FileText, link: "/docs" },
    { name: "Login", icon: Lock, action: handleSignIn },
  ];

  return (
    <>
      {/* =========================================================
          1. DESKTOP NAVBAR (Unchanged)
      ========================================================= */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 hidden md:block ${
          isScrolled
            ? "bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Praedico<span className="font-light text-slate-500">Global</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navItems.filter(i => !i.action).map((item) => (
              <Link
                key={item.name}
                href={item.link!}
                className="px-4 lg:px-5 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 relative group"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSignIn} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign in
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 rounded-full font-semibold text-sm bg-white text-slate-950 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================
          2. MOBILE TOP BAR
      ========================================================= */}
      <nav className="fixed top-0 w-full z-40 md:hidden px-6 py-6 flex items-center justify-between pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 backdrop-blur-md bg-black/40 px-3 py-2 rounded-full border border-white/10 shadow-xl">
           <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
           </div>
           <span className="font-bold text-sm text-white">Praedico</span>
        </Link>
      </nav>

      {/* =========================================================
          3. MOBILE ROTARY MENU (Precision Instrument Theme)
      ========================================================= */}
      <div className="fixed inset-0 z-50 md:hidden pointer-events-none">
        
        {/* Full Screen Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl pointer-events-auto flex items-center justify-center overflow-hidden"
            >
                {/* Background Ambient Glows */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full" />

                <RotaryDial 
                    items={navItems} 
                    onClose={() => setIsMobileMenuOpen(false)} 
                />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button (Floating FAB) */}
        {!isMobileMenuOpen && (
            <motion.button
                layoutId="menu-trigger"
                onClick={() => setIsMobileMenuOpen(true)}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute bottom-8 right-8 pointer-events-auto w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/10 z-50"
            >
                {/* Inner Gradient Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                </div>
            </motion.button>
        )}

      </div>

      {/* MODALS */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}

// ============================================================================
//  THE PRECISION ROTARY DIAL ENGINE
// ============================================================================

function RotaryDial({ items, onClose }: { items: any[], onClose: () => void }) {
    const radius = 135; 
    const N = items.length;
    const step = 360 / N;
    
    // Rotation State
    const rotation = useMotionValue(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Snap to Top (-90deg position)
    const snapToIndex = (index: number) => {
        const targetRotation = -index * step;
        animate(rotation, targetRotation, {
            type: "spring",
            stiffness: 150,
            damping: 20
        });
        setActiveIndex(index);
    };

    // Calculate nearest index on drag end
    const handleDragEnd = () => {
        setIsDragging(false);
        const currentRot = rotation.get();
        const normalizedRot = Math.round(currentRot / step) * step;
        
        // Complex math to handle infinite spinning logic in both directions
        const rawIndex = Math.round(-currentRot / step); 
        const normalizedIndex = ((rawIndex % N) + N) % N; // Wraps correctly 0 to N-1

        snapToIndex(normalizedIndex);
        setActiveIndex(normalizedIndex);
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* Top Indicator (HUD Style) */}
            <div className="absolute top-[18%] flex flex-col items-center z-10 w-64 text-center">
                <div className="mb-4">
                    <ScanLine className="w-8 h-8 text-indigo-400 animate-pulse mx-auto opacity-50" />
                </div>
                <motion.h2 
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight"
                >
                    {items[activeIndex].name}
                </motion.h2>
                <motion.div 
                    key={`desc-${activeIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 mt-2 text-indigo-400 text-xs font-medium uppercase tracking-[0.2em]"
                >
                    <span>Tap to Open</span>
                    <ArrowRight className="w-3 h-3" />
                </motion.div>
            </div>

            {/* THE WHEEL CONTAINER */}
            <div className="relative w-[340px] h-[340px] flex items-center justify-center mt-24">
                
                {/* --- BACKGROUND GRAPHICS (The "Tech" Look) --- */}
                
                {/* 1. Outer Glow Ring */}
                <div className="absolute inset-[-20px] rounded-full border border-indigo-500/10" />
                
                {/* 2. Top "Active Zone" Spotlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                
                {/* 3. Static Tick Marks Ring */}
                <div className="absolute inset-0 rounded-full border border-white/5" />
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="49" fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="1 3" />
                </svg>

                {/* --- ROTATING INTERACTIVE LAYER --- */}
                <motion.div
                    className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                    style={{ rotate: rotation }}
                    drag="x" // Horizontal drag rotates the wheel
                    dragConstraints={{ left: 0, right: 0 }} 
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDrag={(_, info) => {
                        const delta = info.delta.x * 0.8; // Sensitivity
                        rotation.set(rotation.get() + delta);
                    }}
                    onDragEnd={handleDragEnd}
                >
                    {items.map((item, index) => {
                        const angle = index * step;
                        // Start at top (-90deg), distribute items
                        const rotate = `rotate(${angle}deg)`; 
                        const translateY = `translateY(-${radius}px)`;
                        const isActive = index === activeIndex;

                        return (
                            <motion.div
                                key={item.name}
                                className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 flex items-center justify-center"
                                style={{ transform: `${rotate} ${translateY}` }}
                                onClick={() => !isDragging && snapToIndex(index)}
                            >
                                {/* Counter-rotate so icons stay upright */}
                                <ItemIcon 
                                    item={item} 
                                    isActive={isActive} 
                                    parentRotation={rotation} 
                                    angle={angle}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* --- CENTER HUB (Static) --- */}
                <motion.button
                    layoutId="menu-trigger"
                    onClick={onClose}
                    className="absolute w-20 h-20 rounded-full flex items-center justify-center z-20 bg-[#0f172a] border border-white/10 shadow-2xl"
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <X className="w-8 h-8 text-slate-400" />
                </motion.button>

                {/* --- SELECTION TRIGGER (Invisible Click Area at Top) --- */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 w-32 h-32 flex items-start justify-center pt-4 pointer-events-none">
                    <Link 
                        href={items[activeIndex].link || "#"}
                        className="pointer-events-auto w-20 h-20 rounded-full"
                        onClick={(e) => {
                            if (items[activeIndex].action) {
                                e.preventDefault();
                                items[activeIndex].action();
                                onClose();
                            } else {
                                onClose();
                            }
                        }}
                    />
                </div>

            </div>

            {/* Bottom Instructional Text */}
            <div className="absolute bottom-16 text-center pointer-events-none opacity-50">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Drag to Rotate</p>
                <div className="w-1 h-8 bg-gradient-to-b from-slate-800 to-transparent mx-auto mt-2" />
            </div>

        </div>
    );
}

// Sub-component to handle counter-rotation cleanly
function ItemIcon({ item, isActive, parentRotation, angle }: any) {
    // FIX: Return only the number. Framer Motion adds 'deg' automatically.
    const counterRotate = useTransform(parentRotation, (r: number) => -r - angle);

    return (
        <motion.div 
            style={{ rotate: counterRotate }}
            className={`
                relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                ${isActive 
                    ? 'bg-gradient-to-b from-indigo-500 to-violet-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-125 border border-white/20' 
                    : 'bg-[#1a1f35]/80 backdrop-blur-md border border-white/5 text-slate-500 scale-100 grayscale hover:grayscale-0'}
            `}
        >
            {isActive && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
            )}
            <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        </motion.div>
    );
}
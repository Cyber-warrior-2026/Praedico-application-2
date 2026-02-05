// app/user/_components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Zap, Menu, X } from "lucide-react";
import LoginModal from "@/app/user/_components/LoginModal";
import RegisterModal from "@/app/user/_components/RegisterModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const searchParams = useSearchParams();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Query Params for Login
  useEffect(() => {
    if (searchParams.get("openLogin") === "true") {
      setIsLoginModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleSignIn = () => setIsLoginModalOpen(true);
  const handleGetStarted = () => setIsRegisterModalOpen(true);

  // Define navigation items
  const navItems = ["Home", "Product", "Solutions", "Markets","News","Contacts", "Docs"];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled
            ? "bg-[#020617]/80 backdrop-blur-xl border-slate-800 py-4 shadow-lg shadow-indigo-500/5"
            : "bg-transparent border-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Praedico<span className="font-light text-slate-500">GlobalResearch</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/10">
            {navItems.map((item) => (
              <Link
                key={item}
                // If item is 'Home', link to '/', otherwise link to '/itemname'
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={handleSignIn} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign in
            </button>
            <button
              onClick={handleGetStarted}
              className="group relative px-5 py-2.5 rounded-full font-semibold text-sm bg-white text-slate-950 overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-3 text-lg font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-all"
              >
                {item}
              </Link>
            ))}
            <div className="h-px bg-slate-800 my-2" />
            <button onClick={handleSignIn} className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium">
              Sign In
            </button>
            <button onClick={handleGetStarted} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium">
              Get Started
            </button>
          </div>
        )}
      </nav>

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
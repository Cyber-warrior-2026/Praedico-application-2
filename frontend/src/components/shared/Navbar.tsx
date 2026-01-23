"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  return (
    // Sticky Header with Blur Effect & Subtle Border
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      
      {/* CHANGED: Removed "max-w-7xl mx-auto". 
         Added "w-full px-6 md:px-10" to push content to the edges while maintaining professional spacing.
      */}
      <div className="w-full px-6 md:px-10">
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. LEFT: Brand Identity (Sticking to Left Edge) */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg shadow-sm border border-slate-200 group-hover:border-slate-300 transition-colors">
                <Image 
                  src="/praedico.jpg" 
                  alt="Praedico Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span className="hidden md:block text-lg font-bold tracking-tight text-slate-900">
                Praedico Global Research
              </span>
            </Link>
          </div>

          {/* 2. CENTER: Navigation Links (Floating in Middle) */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/solutions">Solutions</NavLink>
            <NavLink href="/enterprise">Enterprise</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/About">About</NavLink>
          </nav>

          {/* 3. RIGHT: Search & Actions (Sticking to Right Edge) */}
          <div className="flex items-center gap-4">
            
            {/* High-Quality Search Bar */}
            <div className="hidden xl:flex items-center">
              <button className="relative inline-flex h-9 w-64 items-center justify-start rounded-[0.5rem] border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                <Search className="mr-2 h-4 w-4" />
                <span>Search documentation...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-medium">
                  Start Building
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

// Micro-Component for Links
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
    >
      {children}
    </Link>
  );
}
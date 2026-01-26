"use client";

import Link from "next/link";
import { 
  Github, Twitter, Linkedin, Instagram, 
  Heart, Zap, Mail, ArrowRight, Send
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#020617] pt-20 pb-10 overflow-hidden border-t border-slate-800">
      
      {/* 1. AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.8)]"></div>
      <div className="absolute -top-24 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -top-24 right-1/4 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* BRAND COLUMN (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Praedico
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              Empowering the next generation of digital research with advanced security, real-time analytics, and beautiful interfaces.
            </p>
            
            {/* SOCIAL ICONS */}
            <div className="flex gap-4">
              <SocialIcon icon={Github} href="#" />
              <SocialIcon icon={Twitter} href="#" />
              <SocialIcon icon={Linkedin} href="#" />
              <SocialIcon icon={Instagram} href="#" />
            </div>
          </div>

          {/* LINKS COLUMNS (Span 2 each) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Integrations</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Changelog</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Community</FooterLink>
              <FooterLink href="#">Help Center</FooterLink>
            </ul>
          </div>

          {/* NEWSLETTER COLUMN (Span 4) */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">
              Join our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner"
              />
              <button 
                type="button"
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-xs text-slate-500 font-medium">
            © 2026 Praedico Global Research Systems. All rights reserved.
          </p>

          {/* DESIGN CREDIT WITH ANIMATION */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800/50 hover:border-indigo-500/30 transition-colors group">
            <span className="text-xs text-slate-400">Designed & Built by</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 group-hover:from-indigo-300 group-hover:to-fuchsia-300 transition-all">
                Arjun & Sambhav
              </span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

// ------------------------------------
// HELPER COMPONENTS
// ------------------------------------

function SocialIcon({ icon: Icon, href }: { icon: any, href: string }) {
  return (
    <Link 
      href={href} 
      className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20"
    >
      <Icon size={18} />
    </Link>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm text-slate-400 hover:text-indigo-400 transition-all duration-300 flex items-center gap-1 group"
      >
        <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <ArrowRight size={12} />
        </span>
        {children}
      </Link>
    </li>
  );
}
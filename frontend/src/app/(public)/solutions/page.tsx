"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2, Heart, ShoppingCart, Factory, Cpu, Shield,
  Zap, BarChart3, Brain, Database, ArrowRight, Sparkles,
  Workflow, Globe, Layers, Code2, Server, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";
import { cn } from "@/lib/utils";
import Scene from "./_components/Scene";

// --- SECTIONS ADAPTED FOR 3D OVERLAY ---

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="h-screen w-full flex items-center justify-center relative pointer-events-none">
      {/* Content Centered - Uses standard DOM flow inside the Scroll container */}
      <div className="text-center z-10 p-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 border border-white/10 bg-black/40 px-6 py-2 rounded-full text-xs font-mono text-cyan-300 mb-8 backdrop-blur-xl"
        >
          <Sparkles className="w-3 h-3" />
          <span className="tracking-[0.3em]">PRAEDICO ENGINE V3.0</span>
        </motion.div>

        <h1 className="text-[12vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-transparent leading-[0.8] tracking-tighter mix-blend-overlay opacity-90">
          PURE <br /> INTELLIGENCE
        </h1>

        <p className="mt-8 text-xl text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
          The definitive predictive engine for the post-human era.
        </p>

        <button onClick={onGetStarted} className="mt-10 px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-full font-bold transition-all duration-300 backdrop-blur-md">
          Initialize System
        </button>
      </div>
    </section>
  )
}

const FeatureCard = ({ title, subtitle, desc, icon: Icon, i }: any) => {
  return (
    <div className="w-full max-w-5xl mx-auto my-[20vh] p-10 md:p-16 rounded-[3rem] bg-black/40 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">Module 0{i + 1}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">{subtitle}</h2>
          <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-indigo-500/30 pl-6">{desc}</p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-end h-full pt-10">
          <div className="text-8xl font-black text-white/5 select-none absolute top-10 right-10">0{i + 1}</div>
          <button className="flex items-center gap-3 text-sm font-bold text-white group/btn">
            <span className="group-hover/btn:underline decoration-indigo-500 underline-offset-4">Explore Data</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SolutionsPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleGetStarted = () => setIsRegisterModalOpen(true);
  const handleSwitchToLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); };
  const handleSwitchToRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); };

  const industries = [
    { title: "Finance", subtitle: "Risk Intelligence", desc: "Detect fraud anomalies and forecast market volatility with sub-millisecond latency using our proprietary neural engine.", icon: Building2 },
    { title: "Healthcare", subtitle: "Genomic Prediction", desc: "Analyze genomic datasets to predict readmission risks and optimize treatment pathways tailored to individual biology.", icon: Heart },
    { title: "IoT", subtitle: "Smart Manufacturing", desc: "Predict equipment failure weeks in advance using digital twin technology to simulate production bottlenecks.", icon: Factory },
    { title: "Retail", subtitle: "Hyper Demand", desc: "Optimize supply chains with hyper-local demand prediction models that adjust to micro-trends instantly.", icon: ShoppingCart }
  ];

  return (
    <>
      <Scene>
        <main className="w-full px-6 md:px-20 pb-40 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">

          {/* 1. HERO - First 'Page' of Scroll */}
          <HeroSection onGetStarted={handleGetStarted} />

          {/* 2. GAP FOR 3D TRANSITION */}
          <div className="h-[50vh]" />

          {/* 3. VERTICAL CARDS */}
          <section className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-sm font-mono text-indigo-400 mb-4 tracking-widest uppercase">Vertical Solutions</h2>
              <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Sector Intelligence</h3>
            </div>
            {industries.map((ind, i) => (
              <FeatureCard key={i} i={i} {...ind} />
            ))}
          </section>

          {/* 4. TECH SPECS GRID */}
          <section className="mt-[20vh] max-w-7xl mx-auto bg-black/50 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-10 border-b border-white/10">
              <h2 className="text-4xl font-bold text-white">System Architecture</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                { label: "Core", val: "Rust + WASM", icon: Layers },
                { label: "Latency", val: "< 5ms", icon: Zap },
                { label: "Security", val: "AES-256", icon: Lock },
                { label: "Scale", val: "Infinite", icon: Globe },
                { label: "API", val: "GraphQL", icon: Code2 },
                { label: "Uptime", val: "99.999%", icon: Server },
              ].map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div key={i} className="p-10 hover:bg-white/5 transition-colors">
                    <Icon className="w-8 h-8 text-slate-500 mb-4" />
                    <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{spec.label}</div>
                    <div className="text-2xl font-bold text-white">{spec.val}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 5. FOOTER CTA */}
          <section className="h-[80vh] flex flex-col items-center justify-center text-center mt-20">
            <h2 className="text-6xl md:text-9xl font-bold text-white tracking-tighter mb-10">
              Start Now.
            </h2>
            <button onClick={handleGetStarted} className="px-12 py-5 bg-white text-black rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.4)]">
              Launch Console
            </button>
          </section>

        </main>
      </Scene>

      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={handleSwitchToRegister} />
    </>
  );
}
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Building2,
  Heart,
  ShoppingCart,
  Factory,
  Cpu,
  Shield,
  Zap,
  BarChart3,
  Brain,
  Database,
  ArrowRight,
  Sparkles,
  Workflow,
  Globe,
  Layers,
  Code2,
  Server, // ✅ Fixed: Imported Server icon
  Lock    // ✅ Fixed: Imported Lock icon
} from "lucide-react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionTemplate, 
  useMotionValue
} from "framer-motion";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";
import { cn } from "@/lib/utils"; 

// --- 1. CINEMATIC HERO COMPONENT ---
const CinematicHero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Text Scaling Effect (Zoom through)
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.4], [1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0.3, 0.4], ["0px", "20px"]);
  
  // UI Reveal Effect
  const uiOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const uiScale = useTransform(scrollYProgress, [0.4, 0.6], [0.8, 1]);
  const uiY = useTransform(scrollYProgress, [0.4, 0.6], [100, 0]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        
        <motion.div 
          style={{ scale, opacity, filter: `blur(${blur})` }} 
          className="relative z-20 text-center origin-center"
        >
          <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-1.5 rounded-full text-xs font-mono text-white mb-8 backdrop-blur-md">
             <Sparkles className="w-3 h-3 text-indigo-400" />
             <span>PRAEDICO ENGINE V3.0</span>
          </div>
          <h1 className="text-[12vw] font-bold text-white leading-[0.8] tracking-tighter">
            PURE <br/> INTELLIGENCE
          </h1>
        </motion.div>

        <motion.div 
          style={{ opacity: uiOpacity, scale: uiScale, y: uiY }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none md:pointer-events-auto"
        >
           <div className="relative w-[90%] max-w-6xl h-[80%] rounded-3xl border border-white/10 bg-[#0B1121]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="absolute top-0 left-0 w-full h-16 border-b border-white/10 flex items-center px-8 gap-4">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 </div>
              </div>
              
              <div className="p-20 flex flex-col items-center justify-center h-full text-center">
                 <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Future.</span>
                 </h2>
                 <p className="text-xl text-slate-400 max-w-2xl mb-10">
                    The world's most advanced predictive engine is ready.
                 </p>
                 <button onClick={onGetStarted} className="px-10 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform pointer-events-auto">
                    Initialize System
                 </button>
              </div>
           </div>
        </motion.div>

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest uppercase animate-bounce"
        >
           Scroll to Enter
        </motion.div>
      </div>
    </section>
  );
};

// --- 2. CARD STACK COMPONENT ---
const Card = ({
  i,
  title,
  subtitle,
  desc,
  icon: Icon,
  color,
  accent,
  border,
  progress,
  range,
  targetScale,
}: any) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }} 
        className={cn(
          "relative -top-[25%] flex flex-col md:flex-row h-[600px] w-full max-w-6xl rounded-[3rem] border border-white/10 p-10 md:p-16 shadow-2xl origin-top overflow-hidden bg-black",
          border
        )}
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light pointer-events-none" />
        <div className={cn("absolute top-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none", accent.replace('text', 'bg'))} />

        <div className="relative z-20 flex flex-col justify-between w-full md:w-[50%] h-full">
           <div>
              <div className={cn("flex items-center gap-3 mb-6 uppercase tracking-widest text-xs font-bold font-mono", accent)}>
                 {/* ✅ Fixed: Icon component is passed and rendered correctly */}
                 <Icon className="w-4 h-4" />
                 <span>0{i + 1} — {title}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[0.9] tracking-tighter">{subtitle}</h2>
              <p className="text-lg text-slate-300 leading-relaxed max-w-md">{desc}</p>
           </div>
           
           <div className="flex items-center gap-4 text-sm font-bold text-white cursor-pointer group w-fit mt-8">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                 <ArrowRight className="w-5 h-5" />
              </div>
              <span>Explore Module</span>
           </div>
        </div>

        <div className="relative h-full w-full md:w-[50%] rounded-3xl overflow-hidden mt-8 md:mt-0 md:ml-12 border border-white/5 bg-[#050505]">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("w-32 h-32 border-2 rounded-full animate-[spin_10s_linear_infinite]", accent.replace('text', 'border'))} />
              <div className={cn("absolute w-64 h-64 border border-dashed rounded-full animate-[spin_20s_linear_infinite_reverse] opacity-30", accent.replace('text', 'border'))} />
           </div>
        </div>
      </motion.div>
    </div>
  )
}

const CardStack = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  const industries = [
    {
      id: "finance",
      title: "Finance",
      subtitle: "Risk Intelligence",
      desc: "Detect fraud anomalies and forecast market volatility with sub-millisecond latency using our proprietary neural engine.",
      color: "#0f172a", 
      accent: "text-blue-400",
      border: "border-blue-500/20",
      icon: Building2
    },
    {
      id: "healthcare",
      title: "Healthcare",
      subtitle: "Genomic Prediction",
      desc: "Analyze genomic datasets to predict readmission risks and optimize treatment pathways tailored to individual biology.",
      color: "#1e1b4b",
      accent: "text-rose-400",
      border: "border-rose-500/20",
      icon: Heart
    },
    {
      id: "manufacturing",
      title: "IoT",
      subtitle: "Smart Manufacturing",
      desc: "Predict equipment failure weeks in advance using digital twin technology to simulate production bottlenecks.",
      color: "#312e81", 
      accent: "text-amber-400",
      border: "border-amber-500/20",
      icon: Factory
    },
    {
      id: "retail",
      title: "Retail",
      subtitle: "Hyper Demand",
      desc: "Optimize supply chains with hyper-local demand prediction models that adjust to micro-trends instantly.",
      color: "#020617",
      accent: "text-purple-400",
      border: "border-purple-500/20",
      icon: ShoppingCart
    }
  ];

  return (
    <div ref={container} className="relative mt-[10vh]">
      {industries.map((project, i) => {
        const targetScale = 1 - ( (industries.length - i) * 0.05);
        return (
          <Card 
            key={i} 
            i={i} 
            {...project} 
            progress={scrollYProgress}
            range={[i * .25, 1]}
            targetScale={targetScale}
          />
        )
      })}
    </div>
  )
}

// --- 3. HORIZONTAL PARALLAX CAPABILITIES ---
const CapabilitiesSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  const caps = [
    { title: "Real-Time Ingestion", desc: "5ms Latency", icon: Zap, color: "bg-blue-500" },
    { title: "Neural Analysis", desc: "Transformer Models", icon: Brain, color: "bg-purple-500" },
    { title: "Vector Database", desc: "Semantic Search", icon: Database, color: "bg-rose-500" },
    { title: "Edge Inference", desc: "On-Device AI", icon: Cpu, color: "bg-amber-500" },
    { title: "Auto-Scaling", desc: "Infinite Throughput", icon: BarChart3, color: "bg-emerald-500" },
    { title: "Military Security", desc: "Zero Trust", icon: Shield, color: "bg-cyan-500" },
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pl-10 md:pl-20">
        <div className="absolute top-20 left-10 md:left-20 z-10">
           <h2 className="text-6xl font-bold text-white mb-2">Core Capabilities</h2>
           <p className="text-slate-400">The engine behind the magic.</p>
        </div>
        <motion.div style={{ x }} className="flex gap-10">
          {caps.map((cap, i) => {
            const CapIcon = cap.icon; // ✅ Fixed: Assign to capitalized variable
            return (
              <div key={i} className="flex-shrink-0 h-[500px] w-[350px] rounded-[3rem] border border-white/10 bg-[#0B1121] p-10 flex flex-col justify-between relative overflow-hidden group hover:border-white/30 transition-all">
                 <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-20 ${cap.color}`} />
                 <CapIcon className="w-12 h-12 text-white opacity-80" />
                 <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{cap.title}</h3>
                    <p className="text-lg text-slate-400">{cap.desc}</p>
                 </div>
                 <div className="w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// --- 4. APPLE-STYLE GRID (TECH SPECS) ---
const TechGrid = () => {
  const specs = [
    { label: "Architecture", val: "Transformer", icon: Layers },
    { label: "Encryption", val: "AES-256", icon: Lock },
    { label: "API Protocol", val: "GraphQL", icon: Code2 },
    { label: "Deployment", val: "Global Edge", icon: Globe },
    { label: "Integrations", val: "Webhooks", icon: Workflow },
    { label: "Uptime", val: "99.99%", icon: Server },
  ];

  return (
    <section className="py-40 px-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-24 border-b border-white/10 pb-10 flex items-end justify-between">
           <h2 className="text-7xl font-bold text-white tracking-tighter">System <br/> Specs</h2>
           <div className="text-right hidden md:block">
              <div className="text-sm font-mono text-indigo-400 mb-2">ARCHITECTURE</div>
              <div className="text-xl text-white">Rust / C++ / WASM</div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
           {specs.map((item, i) => {
             const ItemIcon = item.icon; // ✅ Fixed: Assign to capitalized variable
             return (
               <div key={i} className="bg-black p-12 group hover:bg-white/5 transition-colors">
                  <ItemIcon className="w-8 h-8 text-slate-500 mb-6 group-hover:text-white transition-colors" />
                  <div className="text-sm text-slate-500 mb-2 uppercase tracking-widest">{item.label}</div>
                  <div className="text-3xl font-bold text-white">{item.val}</div>
               </div>
             );
           })}
        </div>
      </div>
    </section>
  );
};

export default function SolutionsPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Dynamic Background Color for the whole page
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ["#000000", "#000000", "#050505", "#000000"]
  );

  const handleGetStarted = () => setIsRegisterModalOpen(true);
  const handleSwitchToLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); };
  const handleSwitchToRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); };

  return (
    <motion.div 
      style={{ backgroundColor }} 
      className="text-slate-200 selection:bg-indigo-500/30 selection:text-white font-sans overflow-x-hidden"
    >
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed top-0 left-0 right-0 h-1 bg-white mix-blend-difference origin-left z-[100]" />

      {/* 1. HERO */}
      <CinematicHero onGetStarted={handleGetStarted} />

      {/* 2. CAPABILITIES (HORIZONTAL) */}
      <CapabilitiesSection />

      {/* 3. VERTICAL SOLUTIONS (STACK) */}
      <section className="relative z-10 bg-black pt-20">
         <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
            <h2 className="text-5xl md:text-8xl font-bold text-white mb-6">Vertical Solutions</h2>
            <p className="text-xl text-slate-400">Tailored intelligence for every sector.</p>
         </div>
         <CardStack />
      </section>

      {/* 4. TECH SPECS */}
      <TechGrid />

      {/* 5. FINAL CTA */}
      <section className="h-[80vh] flex items-center justify-center bg-black relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
         <div className="text-center z-10 px-6">
            <h2 className="text-7xl md:text-[12rem] font-bold text-white tracking-tighter mb-10 leading-none">
               Start <br/> Now.
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
               <button onClick={handleGetStarted} className="px-12 py-5 bg-white text-black rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                  Start Free Trial
               </button>
               <Link href="/contacts" className="px-12 py-5 border border-white/20 rounded-full text-xl font-bold hover:bg-white/10 transition-colors">
                  Contact Sales
               </Link>
            </div>
         </div>
      </section>

      {/* MODALS */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={handleSwitchToRegister} />
    </motion.div>
  );
}
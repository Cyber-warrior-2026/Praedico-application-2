"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
// 1. Import your component
import IntegrationsMarquee from "@/user/components/IntegrationsMarquee"; 
import { 
  ArrowRight, CheckCircle2, Play, Menu, X, 
  Shield, Zap, Globe, BarChart3, Lock, Smartphone, Check
} from "lucide-react";
import LoginModal from "@/user/components/LoginModal";
import RegisterModal from "@/user/components/RegisterModal";


export default function UserPortal() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);


  
  // PRICING STATE
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const router = useRouter(); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const handleSignIn = () => setIsLoginModalOpen(true);

const handleGetStarted = () => setIsRegisterModalOpen(true);


  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans pb-20">
      
      {/* GLOBAL STYLES (Only for Hero/General animations, Marquee styles are inside the component now) */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite 2s; }
        .animate-reveal { animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? "bg-[#020617]/80 backdrop-blur-xl border-slate-800 py-4 shadow-lg shadow-indigo-500/5" 
          : "bg-transparent border-transparent py-6"
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Praedico<span className="font-light text-slate-500">Portal</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
            {['Product', 'Solutions', 'Pricing', 'Docs'].map((item) => (
              <Link key={item} href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={handleSignIn} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign in</button>
            <button onClick={handleGetStarted} className="group relative px-5 py-2.5 rounded-full font-semibold text-sm bg-white text-slate-950 overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
            {['Product', 'Solutions', 'Pricing', 'Docs'].map((item) => (
              <Link key={item} href="#" className="text-lg font-medium text-slate-300">{item}</Link>
            ))}
            <div className="h-px bg-slate-800 my-2" />
            <button onClick={handleSignIn} className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium">Sign In</button>
            <button onClick={handleGetStarted} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium">Get Started</button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 animate-reveal backdrop-blur-md hover:border-indigo-400/50 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>New Feature: AI Security Shield</span>
            <ArrowRight className="w-3 h-3" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-fuchsia-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">Digital Protection</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-reveal" style={{ animationDelay: '0.2s' }}>
            Experience the next generation of security infrastructure. Beautifully designed, highly performant, and completely secure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <button onClick={handleGetStarted} className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0f172a]/50 border border-slate-700 text-white font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:border-slate-500">
              <Play className="w-4 h-4 fill-white" /> Watch Demo
            </button>
          </div>

          <div className="mt-20 relative mx-auto max-w-5xl animate-reveal" style={{ animationDelay: '0.5s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            <div className="relative rounded-2xl bg-[#0f172a]/80 border border-slate-700/50 backdrop-blur-xl p-2 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-[#020617] aspect-[16/9] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="flex gap-8">
                   <div className="w-32 h-32 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 animate-float backdrop-blur-sm flex items-center justify-center">
                      <Shield className="w-12 h-12 text-indigo-400" />
                   </div>
                   <div className="w-32 h-32 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 animate-float-delayed backdrop-blur-sm flex items-center justify-center">
                      <BarChart3 className="w-12 h-12 text-fuchsia-400" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. INTEGRATIONS MARQUEE (IMPORTED COMPONENT)
      ============================================================== */}
      
      <IntegrationsMarquee />

      {/* ============================================================== */}

      {/* LOGO STRIP */}
      <section className="py-10 border-b border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['Acme Corp', 'GlobalTech', 'Nebula', 'Velocity', 'Quantum'].map(logo => (
               <span key={logo} className="text-xl font-bold text-white/40 hover:text-white transition-colors cursor-default">{logo}</span>
             ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Nexus?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our platform provides comprehensive solutions for modern development teams, ensuring security and speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={Globe} color="text-blue-400" bg="from-blue-500/20 to-cyan-500/5" title="Global Network" desc="Deploy your application to our edge network in seconds." delay="0s" />
            <FeatureCard icon={Lock} color="text-fuchsia-400" bg="from-fuchsia-500/20 to-pink-500/5" title="Bank-Grade Security" desc="Enterprise Ready security standards out of the box." delay="0.1s" />
            <FeatureCard icon={Smartphone} color="text-emerald-400" bg="from-emerald-500/20 to-teal-500/5" title="Mobile First" desc="Optimized for every device, providing seamless experiences." delay="0.2s" />
            
            <div className="md:col-span-3 rounded-3xl bg-[#0f172a]/40 border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left max-w-lg">
                  <div className="inline-flex p-3 rounded-xl bg-orange-500/10 text-orange-400 mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Lightning Fast Performance</h3>
                  <p className="text-slate-400">Our engine is written in Rust and optimized for low-latency operations, ensuring your users never wait.</p>
                  
                  <div className="mt-6 flex flex-col gap-3">
                    {['99.99% Uptime SLA', 'Sub-millisecond latency', 'Real-time analytics'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 h-64 bg-slate-900/50 rounded-2xl border border-white/5 relative overflow-hidden flex items-end justify-between px-6 pb-0 pt-10">
                   {[40, 70, 45, 90, 65, 85, 45, 60, 75, 50].map((h, i) => (
                      <div key={i} className="w-full mx-1 bg-gradient-to-t from-indigo-600 to-fuchsia-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 relative overflow-hidden bg-[#020617]/50 border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">Pricing Plans</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Flexible plans and features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Choose the perfect plan for your team. Switch between monthly and yearly billing to save up to 20%.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center mt-8 gap-4">
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 relative p-1 transition-colors hover:border-slate-600"
              >
                <div className={`w-6 h-6 rounded-full bg-indigo-500 shadow-lg transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                Yearly <span className="text-emerald-400 text-xs ml-1">(-20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Basic */}
            <PricingCard 
              plan="Pro"
              price={billingCycle === 'monthly' ? "24" : "19"}
              desc="Perfect for individuals and freelancers."
              features={['100 Social Connections', '4 Custom Domains', 'Unlimited User Roles', '1 External Database']}
              cta="Get Started"
              active={false}
            />

            {/* Card 2: Team (Highlighted) */}
            <PricingCard 
              plan="Team"
              price={billingCycle === 'monthly' ? "49" : "39"}
              desc="Best for growing startups and teams."
              features={['250 Social Connections', 'Unlimited Domains', 'Unlimited User Roles', '5 External Databases', 'Priority Support']}
              cta="Get Started"
              active={true} // This makes it glow
            />

            {/* Card 3: Enterprise */}
            <PricingCard 
              plan="Enterprise"
              price={billingCycle === 'monthly' ? "79" : "69"}
              desc="For large scale organizations."
              features={['Unlimited Connections', 'Unlimited Domains', 'Unlimited User Roles', 'Unlimited Databases', '24/7 Dedicated Support']}
              cta="Contact Sales"
              active={false}
            />

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-12 text-center backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your workflow?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of developers building the future with Nexus Portal today.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your work email" className="flex-1 px-6 py-4 rounded-full bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"/>
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]">Get Access</button>
            </form>
            <p className="text-xs text-slate-500 mt-4">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
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


      {/* FOOTER REMOVED FROM HERE */}
    </div>
  );
}

// -----------------------------
// HELPER COMPONENTS
// -----------------------------

function FeatureCard({ icon: Icon, title, desc, delay, color, bg }: any) {
  return (
    <div 
      className="p-8 rounded-3xl bg-[#0f172a]/40 border border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/10"
      style={{ animationDelay: delay }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${bg} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 mb-6 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-200 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function PricingCard({ plan, price, desc, features, cta, active }: any) {
  return (
    <div className={`
      relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300
      ${active 
        ? 'bg-[#0f172a]/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-105 z-10 ring-1 ring-indigo-500/50' 
        : 'bg-[#0f172a]/40 border-white/5 hover:border-white/10 hover:bg-[#0f172a]/60'}
    `}>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-3xl pointer-events-none" />
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className={`text-lg font-medium mb-2 ${active ? 'text-indigo-400' : 'text-slate-300'}`}>{plan}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold text-white">${price}</span>
          <span className="text-slate-500 text-sm">/mo</span>
        </div>
        <p className="text-sm text-slate-400 mb-8">{desc}</p>
        
        <button className={`
          w-full py-3 rounded-full font-bold text-sm mb-8 transition-all
          ${active 
            ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-indigo-500/25' 
            : 'bg-white text-slate-900 hover:bg-slate-200'}
        `}>
          {cta}
        </button>

        <div className="space-y-4 flex-1">
          {features.map((feat: string, i: number) => (
            <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <Check className={`w-4 h-4 mt-0.5 ${active ? 'text-indigo-400' : 'text-indigo-500'}`} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
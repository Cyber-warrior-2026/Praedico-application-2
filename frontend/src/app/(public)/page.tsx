"use client";

import { useState } from "react";
import Link from "next/link"; // Kept for CTA buttons
import IntegrationsMarquee from "@/app/user/_components/IntegrationsMarquee";
import {
  ArrowRight, CheckCircle2, Play,
  Shield, Zap, Globe, BarChart3, Lock, Smartphone, Check
} from "lucide-react";

export default function UserPortal() {
  // PRICING STATE (Specific to this page content)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // HELPER: Load Razorpay Script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // HANDLER: Initiate Subscription
  const handleSubscribe = async (planName: string, price: string) => {
    // 1. Load Script
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet.");
      return;
    }

    // 2. Call Backend to Create Subscription
    // NOTE: In real app, you'd map planName to actual Razorpay Plan IDs
    const planIdMapping: Record<string, string> = {
      'Pro': 'plan_Pqe9i8G2p6y2i8', 
      'Team': 'plan_Pqe9i8G2p6y2i8',
      'Enterprise': 'plan_Pqe9i8G2p6y2i8'
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Ensure user is logged in
        },
        body: JSON.stringify({ planId: planIdMapping[planName] || 'plan_Pqe9i8G2p6y2i8' }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Subscription creation failed: " + data.message);
        return;
      }

      // 3. Open Razorpay Options
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Praedico Global Research",
        description: `${planName} Subscription`,
        image: "/logo.png", // Add your logo in public folder
        handler: async function (response: any) {
          // 4. Verify Payment on Backend
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              planName: planName
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment Successful! Subscription Active.");
            // Optionally redirect to dashboard
            // router.push('/dashboard');
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "User Name", // Fetch from user context if available
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#6366f1"
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong initializing payment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans pb-20">

      {/* GLOBAL STYLES (Animations) */}
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

      {/* PAGE BACKGROUND (Layered over layout background) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

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
            {/* Replaced handleGetStarted with direct Link since Modals are global now */}
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
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

      {/* INTEGRATIONS MARQUEE */}
      <IntegrationsMarquee />

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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Praedico?</h2>
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
              cta="Subscribe Now"
              active={false}
              onSubscribe={() => handleSubscribe('Pro', "24")}
            />

            {/* Card 2: Team (Highlighted) */}
            <PricingCard
              plan="Team"
              price={billingCycle === 'monthly' ? "49" : "39"}
              desc="Best for growing startups and teams."
              features={['250 Social Connections', 'Unlimited Domains', 'Unlimited User Roles', '5 External Databases', 'Priority Support']}
              cta="Subscribe Now"
              active={true} // This makes it glow
              onSubscribe={() => handleSubscribe('Team', "49")}
            />

            {/* Card 3: Enterprise */}
            <PricingCard
              plan="Enterprise"
              price={billingCycle === 'monthly' ? "79" : "69"}
              desc="For large scale organizations."
              features={['Unlimited Connections', 'Unlimited Domains', 'Unlimited User Roles', 'Unlimited Databases', '24/7 Dedicated Support']}
              cta="Contact Sales"
              active={false}
              onSubscribe={() => handleSubscribe('Enterprise', "79")}
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
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of developers building the future with Praedico Global Research today.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your work email" className="flex-1 px-6 py-4 rounded-full bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]">Get Access</button>
            </form>
            <p className="text-xs text-slate-500 mt-4">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

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

function PricingCard({ plan, price, desc, features, cta, active, onSubscribe }: any) {
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

        <button
          onClick={onSubscribe}
          className={`
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

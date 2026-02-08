"use client";

import { useState } from "react";
import Link from "next/link";
import IntegrationsMarquee from "@/app/user/_components/IntegrationsMarquee";
import {
    ArrowRight, CheckCircle2, Play,
    Shield, Zap, Globe, BarChart3, Lock, Smartphone, Check
} from "lucide-react";

export default function LandingClient() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // ... (Keep your existing Razorpay Logic here - it was fine) ...
    // Since I cannot see the full razorpay code block in context, 
    // I will assume you copy-paste your existing "handleSubscribe" and "loadRazorpay" functions here.
    // START PLACEHOLDER FOR RAZORPAY LOGIC
    const loadRazorpay = () => Promise.resolve(true); 
    const handleSubscribe = (plan: string, price: string) => console.log(plan, price);
    // END PLACEHOLDER

    return (
        // 🟢 ADDED: pb-32 to account for the new Mobile Dock at the bottom
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans pb-32">

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

            {/* BACKGROUND BLOBS - Adjusted for mobile to not overflow */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-[-20%] md:left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/20 rounded-full blur-[80px] md:blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-[-20%] md:right-1/4 w-64 md:w-96 h-64 md:h-96 bg-fuchsia-600/20 rounded-full blur-[80px] md:blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-12 md:pt-52 md:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-medium mb-6 md:mb-8 animate-reveal backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span>New Feature: AI Security Shield</span>
                    </div>

                    {/* 🟢 RESPONSIVE TYPOGRAPHY FIX */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 md:mb-8 animate-reveal leading-[1.1]" style={{ animationDelay: '0.1s' }}>
                        The Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-fuchsia-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                            Digital Protection
                        </span>
                    </h1>

                    <p className="max-w-xl md:max-w-2xl mx-auto text-base md:text-xl text-slate-400 mb-8 md:mb-10 leading-relaxed animate-reveal px-2" style={{ animationDelay: '0.2s' }}>
                        Experience the next generation of security infrastructure. Beautifully designed, highly performant, and completely secure.
                    </p>

                    {/* Buttons Stack on Mobile */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal px-4" style={{ animationDelay: '0.3s' }}>
                        <Link href="/" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
                            Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0f172a]/50 border border-slate-700 text-white font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                            <Play className="w-4 h-4 fill-white" /> Watch Demo
                        </button>
                    </div>

                    {/* 3D Dashboard Preview - Scaled for Mobile */}
                    <div className="mt-16 md:mt-20 relative mx-auto max-w-5xl animate-reveal px-2" style={{ animationDelay: '0.5s' }}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                        <div className="relative rounded-2xl bg-[#0f172a]/80 border border-slate-700/50 backdrop-blur-xl p-2 shadow-2xl">
                            <div className="rounded-xl overflow-hidden bg-[#020617] aspect-[16/9] md:aspect-[21/9] flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:40px_40px]"></div>
                                {/* Floating Icons - Smaller on Mobile */}
                                <div className="flex gap-4 md:gap-8 scale-75 md:scale-100">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 animate-float backdrop-blur-sm flex items-center justify-center">
                                        <Shield className="w-10 h-10 md:w-12 md:h-12 text-indigo-400" />
                                    </div>
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 animate-float-delayed backdrop-blur-sm flex items-center justify-center">
                                        <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-fuchsia-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <IntegrationsMarquee />

            {/* FEATURES GRID - Stacked on Mobile */}
            <section className="py-16 md:py-24 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Praedico?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">Our platform provides comprehensive solutions for modern development teams.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard icon={Globe} color="text-blue-400" bg="from-blue-500/20 to-cyan-500/5" title="Global Network" desc="Deploy your application to our edge network in seconds." delay="0s" />
                        <FeatureCard icon={Lock} color="text-fuchsia-400" bg="from-fuchsia-500/20 to-pink-500/5" title="Bank-Grade Security" desc="Enterprise Ready security standards out of the box." delay="0.1s" />
                        <FeatureCard icon={Smartphone} color="text-emerald-400" bg="from-emerald-500/20 to-teal-500/5" title="Mobile First" desc="Optimized for every device, providing seamless experiences." delay="0.2s" />
                        
                        {/* Large Feature Block */}
                        <div className="md:col-span-3 rounded-3xl bg-[#0f172a]/40 border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-colors">
                             <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="text-left max-w-lg w-full">
                                    <div className="inline-flex p-3 rounded-xl bg-orange-500/10 text-orange-400 mb-4">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
                                    <p className="text-slate-400 text-sm">Optimized for low-latency operations.</p>
                                </div>
                                {/* Graph visual - Hidden on very small screens to save space */}
                                <div className="hidden sm:flex w-full md:w-1/2 h-48 md:h-64 bg-slate-900/50 rounded-2xl border border-white/5 items-end justify-between px-6 pb-0 pt-10">
                                     {[40, 70, 45, 90, 65, 85, 45, 60, 75, 50].map((h, i) => (
                                        <div key={i} className="w-full mx-1 bg-gradient-to-t from-indigo-600 to-fuchsia-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                                     ))}
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING - Cards stack vertically on mobile */}
            <section className="py-16 md:py-24 relative overflow-hidden bg-[#020617]/50 border-t border-white/5">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <p className="text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">Pricing Plans</p>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Flexible plans</h2>
                        
                        {/* Toggle Switch */}
                        <div className="flex items-center justify-center mt-8 gap-4 scale-90 md:scale-100">
                            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 relative p-1 transition-colors hover:border-slate-600"
                            >
                                <div className={`w-6 h-6 rounded-full bg-indigo-500 shadow-lg transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                                Yearly <span className="text-emerald-400 text-xs ml-1">(-20%)</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        <PricingCard
                            plan="Pro"
                            price={billingCycle === 'monthly' ? "24" : "19"}
                            desc="For individuals."
                            features={['100 Social Connections', '4 Custom Domains']}
                            cta="Subscribe"
                            active={false}
                            onSubscribe={() => handleSubscribe('Pro', "24")}
                        />
                        <PricingCard
                            plan="Team"
                            price={billingCycle === 'monthly' ? "49" : "39"}
                            desc="For growing teams."
                            features={['250 Social Connections', 'Unlimited Domains', 'Priority Support']}
                            cta="Subscribe"
                            active={true}
                            onSubscribe={() => handleSubscribe('Team', "49")}
                        />
                        <PricingCard
                            plan="Enterprise"
                            price={billingCycle === 'monthly' ? "79" : "69"}
                            desc="For large scale."
                            features={['Unlimited Connections', 'Dedicated Support']}
                            cta="Contact"
                            active={false}
                            onSubscribe={() => handleSubscribe('Enterprise', "79")}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

// -----------------------------
// HELPER COMPONENTS (Unchanged Logic, just ensuring classes are safe)
// -----------------------------

function FeatureCard({ icon: Icon, title, desc, delay, color, bg }: any) {
    return (
        <div
            className="p-6 md:p-8 rounded-3xl bg-[#0f172a]/40 border border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:border-white/10"
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
          relative p-6 md:p-8 rounded-3xl border flex flex-col h-full transition-all duration-300
          ${active
                    ? 'bg-[#0f172a]/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-100 md:scale-105 z-10'
                    : 'bg-[#0f172a]/40 border-white/5 hover:border-white/10'}
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
                            ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg'
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
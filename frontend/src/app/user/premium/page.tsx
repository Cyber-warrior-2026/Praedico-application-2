"use client";

import { useState, useEffect } from "react";
// ❌ REMOVED: import axios from "axios";
import { Check, Zap, Crown, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Premium3DBackground from "../_components/Premium3DBackground";
// ✅ ADDED: Centralized API imports
import { authApi, paymentApi } from "@/lib/api";

export default function PremiumPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<string>("Free");
    const [expiryDate, setExpiryDate] = useState<string | null>(null);
    const [hasUsedTrial, setHasUsedTrial] = useState(false);
    const [isOnTrial, setIsOnTrial] = useState(false);

    // FETCH CURRENT PLAN
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                // ✅ REFACTORED: Use authApi.getMe()
                const data = await authApi.getMe();

                if (data.success && data.user) {
                    setCurrentPlan(data.user.currentPlan || "Free");
                    setHasUsedTrial(data.user.hasUsedTrial || false);
                    setIsOnTrial(data.user.isOnTrial || false);
                    if (data.user.subscriptionExpiry) {
                        setExpiryDate(new Date(data.user.subscriptionExpiry).toLocaleDateString());
                    }
                }
            } catch (e) {
                console.error("Failed to fetch user plan", e);
            }
        };
        fetchSubscription();
    }, []);

    // LOAD RAZORPAY SCRIPT
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // HANDLE SUBSCRIPTION OR TRIAL
    const handlePayment = async (planName: string, price: string, isTrial: boolean = false) => {
        setLoading(true);
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert("Razorpay SDK failed to load. Check your internet.");
            setLoading(false);
            return;
        }

        // Map Plans to Real Razorpay Plan IDs
        const planIdMapping: Record<string, Record<'monthly' | 'yearly', string>> = {
            'Pro': {
                'monthly': 'plan_SC0iGjpyVbKuAA',
                'yearly': 'plan_SC0qNTPAC32hGZ'
            },
            'Team': {
                'monthly': 'plan_SC0nYjCHBqsBQO',
                'yearly': 'plan_SC0rb0YRRRm0mC'
            },
            'Enterprise': {
                'monthly': 'plan_SC0pAv06iGaP1S',
                'yearly': 'plan_SC0rzziUgLxEjF'
            }
        };

        const selectedPlanId = planIdMapping[planName]?.[billingCycle];

        if (!selectedPlanId) {
            alert(`Plan ID missing for ${planName} (${billingCycle})`);
            setLoading(false);
            return;
        }

        try {
            // 1. Initiate Subscription (Regular or Trial)
            // ✅ REFACTORED: Use paymentApi
            let data;
            if (isTrial) {
                data = await paymentApi.trial(selectedPlanId);
            } else {
                data = await paymentApi.subscribe(selectedPlanId);
            }

            if (!data.success) {
                alert("Subscription creation failed: " + data.message);
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: data.keyId,
                subscription_id: data.subscriptionId,
                name: "Praedico Global Research",
                description: isTrial ? `7-Day Trial for ${planName}` : `Upgrade to ${planName}`,
                image: "https://github.com/shadcn.png",
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        // ✅ REFACTORED: Use paymentApi.verify()
                        const verifyRes = await paymentApi.verify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            planName: planName,
                            isTrial: isTrial
                        });

                        if (verifyRes.success) {
                            alert(isTrial ? "Trial Activated! Enjoy 7 days free." : `Welcome to ${currentPlan}! Your plan has been upgraded.`);
                            window.location.reload();
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Verification Failed");
                    }
                },
                prefill: {
                    name: "Priyank Gupta", // Optional: You might want to pull this from authApi user data too
                    email: "guptapriyank@gmail.com",
                    contact: "9876543210"
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
            setLoading(false);

        } catch (error: any) {
            console.error("Payment Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong initializing payment.";
            alert(`Payment Initialization Failed: ${errorMessage}`);
            setLoading(false);
        }
    };

    // ... Return Statement remains exactly the same ...
    return (
        <div className="min-h-screen bg-[#F8F9FE] dark:bg-background pt-24 md:pt-28 pb-20 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 relative overflow-hidden transition-colors duration-300">
            {/* ... Copy the rest of your JSX exactly as it was ... */}
            {/* To save space I am not repeating the JSX here, but you can paste the Return block from your original code */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Premium3DBackground />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* ... Keep all your JSX code here ... */}

                {/* TRIAL EXPIRED BANNER */}
                {hasUsedTrial && !isOnTrial && currentPlan === 'Free' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="max-w-2xl mx-auto mb-12 relative group"
                    >
                        {/* ... JSX ... */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 rounded-xl shadow-2xl border border-rose-400/30">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                                    <Shield className="h-5 w-5 text-white fill-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        Trial Period Finished
                                        <span className="flex h-2 w-2 rounded-full bg-white/50 animate-pulse"></span>
                                    </p>
                                    <p className="text-orange-50 text-xs mt-0.5 font-medium">Subscribe now to regain premium access</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-white text-rose-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors shadow-sm"
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* TRIAL BANNER */}
                {isOnTrial && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="max-w-2xl mx-auto mb-12 relative group"
                    >
                        {/* ... JSX ... */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-2xl border border-indigo-400/30">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">

                                    <Zap className="h-5 w-5 text-white fill-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        {currentPlan} Trial Active
                                        <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse ring-2 ring-white/20"></span>
                                    </p>
                                    <p className="text-indigo-100/80 text-xs mt-0.5 font-medium">Full functionality unlocked</p>
                                </div>
                            </div>

                            <div className="text-right pl-4 border-l border-white/10">
                                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-0.5">Expires On</p>
                                <p className="text-sm font-bold text-white tabular-nums">{expiryDate}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-default"
                    >
                        <Crown size={14} className="fill-indigo-600 dark:fill-indigo-400" /> Upgrade your experience
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">Pricing</span>
                    </h1>

                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Choose the plan that fits your trading style. Unlock advanced AI analytics, real-time data, and priority support.
                    </p>

                    {/* TOGGLE SWITCH */}
                    <div className="flex items-center justify-center mt-10 gap-4">
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 relative p-1 transition-colors hover:border-indigo-300 focus:outline-none"
                        >
                            <motion.div
                                className="w-6 h-6 rounded-full bg-indigo-600 shadow-md"
                                animate={{ x: billingCycle === 'yearly' ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            Yearly <span className="text-emerald-600 text-xs bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full ml-1 border border-emerald-100 dark:border-emerald-800">Save 20%</span>
                        </span>
                    </div>
                </motion.div>

                {/* CURRENT PLAN STATUS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-6 ring-1 ring-slate-900/5 dark:ring-white/10">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentPlan === 'Free' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'}`}>
                                {currentPlan === 'Free' ? <Shield size={24} /> : <Crown size={24} className="fill-current" />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Plan</p>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentPlan} Membership {isOnTrial && <span className="text-indigo-600 dark:text-indigo-400">(Trial)</span>}</h3>
                            </div>
                        </div>
                        {expiryDate && currentPlan !== 'Free' && (
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Renews On</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{expiryDate}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* PRICING CARDS */}
                <div id="pricing-section" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard
                        title="Pro"
                        price={billingCycle === 'monthly' ? "99" : "999"}
                        billingCycle={billingCycle}
                        desc="Essential tools for serious traders."
                        features={['Real-time AI Alerts', 'Advanced Charting', '50 Social Connections', 'Priority Email Support']}
                        icon={Zap}
                        delay={0.4}
                        currentPlan={currentPlan}
                        hasUsedTrial={hasUsedTrial}
                        onSubscribe={() => handlePayment('Pro', billingCycle === 'monthly' ? "99" : "999")}
                        onTrial={() => handlePayment('Pro', billingCycle === 'monthly' ? "99" : "999", true)}
                    />

                    {/* TEAM PLAN (Popular) */}
                    <PricingCard
                        title="Team"
                        price={billingCycle === 'monthly' ? "169" : "1599"}
                        billingCycle={billingCycle}
                        desc="Collaborate and scale your trading."
                        features={['Everything in Pro', 'Unlimited Connections', 'Shared Workspaces', 'API Access', '24/7 Phone Support']}
                        icon={Rocket}
                        highlight
                        delay={0.5}
                        currentPlan={currentPlan}
                        hasUsedTrial={hasUsedTrial}
                        onSubscribe={() => handlePayment('Team', billingCycle === 'monthly' ? "169" : "1599")}
                        onTrial={() => handlePayment('Team', billingCycle === 'monthly' ? "169" : "1599", true)}
                    />

                    {/* ENTERPRISE PLAN */}
                    <PricingCard
                        title="Enterprise"
                        price={billingCycle === 'monthly' ? "249" : "2599"}
                        billingCycle={billingCycle}
                        desc="Full power for institutions."
                        features={['Everything in Team', 'Dedicated Account Manager', 'Custom AI Models', 'White-label Reports', 'SLA Guarantee']}
                        icon={Crown}
                        delay={0.6}
                        currentPlan={currentPlan}
                        hasUsedTrial={hasUsedTrial}
                        onSubscribe={() => handlePayment('Enterprise', billingCycle === 'monthly' ? "249" : "2599")}
                        onTrial={() => handlePayment('Enterprise', billingCycle === 'monthly' ? "249" : "2599", true)}
                    />
                </div>
            </div>
        </div>
    );
}

// Keep PricingCard exactly the same
function PricingCard({ title, price, billingCycle, desc, features, icon: Icon, highlight, delay, currentPlan, hasUsedTrial, onSubscribe, onTrial }: any) {
    const isCurrent = currentPlan === title;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`
                relative bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-[32px] p-8 border group flex flex-col justify-between
                ${highlight
                    ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20 z-10'
                    : 'border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-indigo-500/10'
                }
            `}
        >
            <div>
                {highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30 ring-4 ring-[#F8F9FE] dark:ring-slate-900">
                        Most Popular
                    </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ml-1 transition-colors duration-300 ${highlight ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    }`}>
                    <Icon size={24} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">{desc}</p>

                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{price}</span>
                    <span className="text-slate-400 font-medium">{billingCycle === 'yearly' ? '/yr' : '/mo'}</span>
                </div>

                {/* Primary Action Button */}
                <motion.button
                    onClick={onSubscribe}
                    disabled={isCurrent}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        w-full py-4 rounded-xl font-bold text-sm mb-3 transition-all shadow-lg
                        ${isCurrent
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default shadow-none'
                            : highlight
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-500/40 hover:brightness-110'
                                : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 hover:shadow-slate-500/20'
                        }
                    `}
                >
                    {isCurrent ? "Current Plan" : "Get Started Now"}
                </motion.button>

                {/* Trial Button */}
                {!hasUsedTrial && !isCurrent && (
                    <motion.button
                        onClick={onTrial}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl font-bold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 mb-6 transition-colors border border-indigo-200 dark:border-indigo-800"
                    >
                        Start 7-Day Free Trial
                    </motion.button>
                )}
            </div>

            <div className="space-y-4 mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                {features.map((feat: string, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + (i * 0.1) + 0.3 }}
                        className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                    >
                        <div className="mt-0.5 p-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                            <Check size={12} strokeWidth={3} />
                        </div>
                        {feat}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
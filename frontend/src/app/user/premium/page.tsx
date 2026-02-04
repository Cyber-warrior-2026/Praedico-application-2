"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Check, Zap, Crown, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Premium3DBackground from "../_components/Premium3DBackground";

export default function PremiumPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<string>("Free");
    const [expiryDate, setExpiryDate] = useState<string | null>(null);

    // FETCH CURRENT PLAN
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const { data } = await axios.get("http://localhost:5001/api/users/me", { withCredentials: true });
                if (data.success && data.user) {
                    setCurrentPlan(data.user.currentPlan || "Free");
                    if (data.user.subscriptionExpiry) {
                        setExpiryDate(new Date(data.user.subscriptionExpiry).toLocaleDateString());
                    }
                }
            } catch (e) {
                console.error("Failed to fetch user plan");
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

    // HANDLE SUBSCRIPTION
    const handleSubscribe = async (planName: string, price: string) => {
        setLoading(true);
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert("Razorpay SDK failed to load. Check your internet.");
            setLoading(false);
            return;
        }

        // Map Plans to Mock IDs (Replace with Real Razorpay Plan IDs in Production)
        // Map Plans to Real Razorpay Plan IDs (Monthly & Yearly)
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
            // 1. Initiate Subscription
            const { data } = await axios.post("http://localhost:5001/api/payments/subscribe",
                { planId: selectedPlanId },
                { withCredentials: true }
            );

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
                description: `Upgrade to ${planName}`,
                image: "https://github.com/shadcn.png", // Replace with your logo
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await axios.post("http://localhost:5001/api/payments/verify", {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            planName: planName
                        }, { withCredentials: true });

                        if (verifyRes.data.success) {
                            alert("Welcome to Premium! Your plan has been upgraded.");
                            window.location.reload(); // Refresh to show new plan status
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        alert("Verification Failed");
                    }
                },
                prefill: {
                    name: "Praedico User",
                    email: "user@praedico.com",
                    contact: ""
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

    return (
        <div className="min-h-screen bg-[#F8F9FE] pt-10 pb-20 font-sans text-slate-900 selection:bg-indigo-100 relative overflow-hidden">

            {/* 1. 3D BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Premium3DBackground />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 hover:bg-indigo-100 transition-colors cursor-default"
                    >
                        <Crown size={14} className="fill-indigo-600" /> Upgrade your experience
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">Pricing</span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Choose the plan that fits your trading style. Unlock advanced AI analytics, real-time data, and priority support.
                    </p>

                    {/* TOGGLE SWITCH */}
                    <div className="flex items-center justify-center mt-10 gap-4">
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 rounded-full bg-slate-200 border border-slate-300 relative p-1 transition-colors hover:border-indigo-300 focus:outline-none"
                        >
                            <motion.div
                                className="w-6 h-6 rounded-full bg-indigo-600 shadow-md"
                                animate={{ x: billingCycle === 'yearly' ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                            Yearly <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-full ml-1 border border-emerald-100">Save 20%</span>
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
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-6 ring-1 ring-slate-900/5">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentPlan === 'Free' ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-600'}`}>
                                {currentPlan === 'Free' ? <Shield size={24} /> : <Crown size={24} className="fill-current" />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Plan</p>
                                <h3 className="text-xl font-bold text-slate-900">{currentPlan} Membership</h3>
                            </div>
                        </div>
                        {expiryDate && (
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Renews On</p>
                                <p className="text-sm font-bold text-slate-800">{expiryDate}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* PRICING CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* PRO PLAN */}
                    <PricingCard
                        title="Pro"
                        price={billingCycle === 'monthly' ? "99" : "999"}
                        desc="Essential tools for serious traders."
                        features={['Real-time AI Alerts', 'Advanced Charting', '50 Social Connections', 'Priority Email Support']}
                        icon={Zap}
                        delay={0.4}
                        currentPlan={currentPlan}
                        onSubscribe={() => handleSubscribe('Pro', billingCycle === 'monthly' ? "99" : "999")}
                    />

                    {/* TEAM PLAN (Popular) */}
                    <PricingCard
                        title="Team"
                        price={billingCycle === 'monthly' ? "169" : "1599"}
                        desc="Collaborate and scale your trading."
                        features={['Everything in Pro', 'Unlimited Connections', 'Shared Workspaces', 'API Access', '24/7 Phone Support']}
                        icon={Rocket}
                        highlight
                        delay={0.5}
                        currentPlan={currentPlan}
                        onSubscribe={() => handleSubscribe('Team', billingCycle === 'monthly' ? "169" : "1599")}
                    />

                    {/* ENTERPRISE PLAN */}
                    <PricingCard
                        title="Enterprise"
                        price={billingCycle === 'monthly' ? "249" : "2599"}
                        desc="Full power for institutions."
                        features={['Everything in Team', 'Dedicated Account Manager', 'Custom AI Models', 'White-label Reports', 'SLA Guarantee']}
                        icon={Crown}
                        delay={0.6}
                        currentPlan={currentPlan}
                        onSubscribe={() => handleSubscribe('Enterprise', billingCycle === 'monthly' ? "249" : "2599")}
                    />

                </div>

            </div>
        </div>
    );
}

// COMPONENT: PRICING CARD
function PricingCard({ title, price, desc, features, icon: Icon, highlight, delay, currentPlan, onSubscribe }: any) {
    const isCurrent = currentPlan === title;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`
                relative bg-white/80 backdrop-blur-md rounded-[32px] p-8 border group
                ${highlight
                    ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20 z-10'
                    : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60'
                }
            `}
        >
            {highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30 ring-4 ring-[#F8F9FE]">
                    Most Popular
                </div>
            )}

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ml-1 transition-colors duration-300 ${highlight ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                <Icon size={24} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">{desc}</p>

            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900 tracking-tight">₹{price}</span>
                <span className="text-slate-400 font-medium">/mo</span>
            </div>

            <motion.button
                onClick={onSubscribe}
                disabled={isCurrent}
                whileTap={{ scale: 0.98 }}
                className={`
                    w-full py-4 rounded-xl font-bold text-sm mb-8 transition-all shadow-lg
                    ${isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-default shadow-none'
                        : highlight
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-500/40 hover:brightness-110'
                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-500/20'
                    }
                `}
            >
                {isCurrent ? "Current Plan" : "Get Started"}
            </motion.button>

            <div className="space-y-4">
                {features.map((feat: string, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + (i * 0.1) + 0.3 }}
                        className="flex items-start gap-3 text-sm text-slate-600"
                    >
                        <div className="mt-0.5 p-0.5 rounded-full bg-indigo-50 text-indigo-600">
                            <Check size={12} strokeWidth={3} />
                        </div>
                        {feat}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

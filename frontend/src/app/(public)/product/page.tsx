"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  Brain,
  Target,
  Rocket,
  ChevronRight,
  Check,
  Star,
  Clock,
  Globe,
  Lock,
  Layers,
  Boxes,
} from "lucide-react";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";

export default function ProductsPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleGetStarted = () => {
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description:
        "Advanced machine learning algorithms that analyze patterns and deliver accurate forecasts.",
      color: "from-purple-500 to-indigo-600",
      benefits: ["99.9% accuracy", "Real-time analysis", "Auto-learning"],
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description:
        "Get ahead of trends with intelligent data analysis and future projections.",
      color: "from-pink-500 to-rose-600",
      benefits: ["Trend forecasting", "Risk analysis", "Market insights"],
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security protocols to keep your data safe.",
      color: "from-blue-500 to-cyan-600",
      benefits: ["256-bit encryption", "ISO certified", "GDPR compliant"],
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work seamlessly with your team with real-time sync and shared workspaces.",
      color: "from-green-500 to-emerald-600",
      benefits: ["Real-time sync", "Role management", "Activity tracking"],
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description:
        "Generate comprehensive reports with stunning visualizations and insights.",
      color: "from-orange-500 to-amber-600",
      benefits: ["Custom reports", "Export options", "Automated delivery"],
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance delivering results in milliseconds, not minutes.",
      color: "from-violet-500 to-purple-600",
      benefits: ["Sub-second response", "99.99% uptime", "Global CDN"],
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for trying out Praedico",
      features: [
        "Up to 1,000 predictions/month",
        "Basic analytics",
        "Email support",
        "7-day data retention",
        "Community access",
      ],
      color: "from-slate-500 to-gray-600",
      popular: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "For growing teams and businesses",
      features: [
        "Unlimited predictions",
        "Advanced analytics",
        "Priority support",
        "90-day data retention",
        "Team collaboration (5 users)",
        "Custom integrations",
        "API access",
      ],
      color: "from-purple-500 to-pink-600",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Dedicated account manager",
        "Custom data retention",
        "SLA guarantee",
        "On-premise deployment",
        "Advanced security",
        "White-label options",
      ],
      color: "from-blue-500 to-cyan-600",
      popular: false,
    },
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Predictions Made", value: "10M+", icon: Target },
    { label: "Accuracy Rate", value: "99.9%", icon: TrendingUp },
    { label: "Countries", value: "150+", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <ArrowLeft className="h-5 w-5 text-purple-400 group-hover:-translate-x-1 transition-transform" />
                <span className="text-white font-semibold">Back to Home</span>
              </Link>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Predictive Analytics
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Harness the power of AI to predict trends, analyze data, and make
            smarter decisions. Built for teams who demand excellence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105"
              >
                <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Everything you need to unlock the power of predictive analytics
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-300`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{feature.description}</p>

                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-slate-300">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`mt-4 flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    Learn more
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, cancel
            anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/5 backdrop-blur-sm border ${
                  plan.popular ? "border-purple-500/50" : "border-white/10"
                } rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 ${
                  plan.popular ? "shadow-2xl shadow-purple-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span
                      className={`text-5xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-slate-400 mb-2">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50`
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />

          <div className="relative">
            <Rocket className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using Praedico to make better
              decisions.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                Start Free Trial
                <ChevronRight className="h-5 w-5" />
              </button>
              <Link
                href="/contacts"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all hover:scale-105"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-slate-400 text-sm">
            © 2026 Praedico. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modals */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  );
}

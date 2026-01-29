"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Building2,
  Heart,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Factory,
  Cpu,
  GraduationCap,
  Plane,
  Home,
  Shield,
  Zap,
  Users,
  BarChart3,
  Globe,
  CheckCircle,
  ArrowRight,
  Rocket,
  Target,
  Brain,
  LineChart,
  Database,
  Lock,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";

export default function SolutionsPage() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const industries = [
    {
      icon: Building2,
      name: "Finance & Banking",
      description: "AI-powered risk assessment and fraud detection",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
      features: [
        "Real-time fraud detection",
        "Credit risk assessment",
        "Market trend prediction",
        "Automated compliance",
      ],
      stats: { accuracy: "99.8%", reduction: "73%", time: "10x faster" },
    },
    {
      icon: Heart,
      name: "Healthcare",
      description: "Predictive analytics for patient outcomes",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-500/10",
      features: [
        "Disease prediction",
        "Treatment optimization",
        "Resource allocation",
        "Patient risk scoring",
      ],
      stats: { accuracy: "94.5%", reduction: "60%", time: "5x faster" },
    },
    {
      icon: ShoppingCart,
      name: "Retail & E-commerce",
      description: "Demand forecasting and inventory optimization",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-500/10",
      features: [
        "Demand forecasting",
        "Dynamic pricing",
        "Customer segmentation",
        "Inventory optimization",
      ],
      stats: { accuracy: "96.2%", reduction: "45%", time: "8x faster" },
    },
    {
      icon: Factory,
      name: "Manufacturing",
      description: "Predictive maintenance and quality control",
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-500/10",
      features: [
        "Equipment failure prediction",
        "Quality assurance",
        "Supply chain optimization",
        "Production forecasting",
      ],
      stats: { accuracy: "97.1%", reduction: "68%", time: "12x faster" },
    },
    {
      icon: Cpu,
      name: "Technology",
      description: "AI infrastructure and scalability solutions",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      features: [
        "System performance prediction",
        "Anomaly detection",
        "Capacity planning",
        "Security threat analysis",
      ],
      stats: { accuracy: "98.3%", reduction: "82%", time: "15x faster" },
    },
    {
      icon: GraduationCap,
      name: "Education",
      description: "Student performance and engagement analytics",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
      features: [
        "Student success prediction",
        "Personalized learning",
        "Dropout prevention",
        "Resource optimization",
      ],
      stats: { accuracy: "91.7%", reduction: "55%", time: "6x faster" },
    },
  ];

  const useCases = [
    {
      icon: TrendingUp,
      title: "Revenue Forecasting",
      description:
        "Predict future revenue with machine learning models trained on historical data.",
      benefit: "+34% accuracy improvement",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Customer Churn Prediction",
      description:
        "Identify at-risk customers before they leave and take proactive action.",
      benefit: "65% churn reduction",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description:
        "Real-time anomaly detection to prevent fraudulent transactions.",
      benefit: "99.8% fraud prevention",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: BarChart3,
      title: "Demand Planning",
      description:
        "Optimize inventory levels with accurate demand forecasting.",
      benefit: "42% cost savings",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Brain,
      title: "Sentiment Analysis",
      description:
        "Understand customer sentiment from reviews and social media.",
      benefit: "87% insight accuracy",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Zap,
      title: "Process Automation",
      description:
        "Automate repetitive tasks with intelligent workflow optimization.",
      benefit: "10x productivity boost",
      color: "from-violet-500 to-purple-500",
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Industry-Specific Models",
      description:
        "Pre-trained models tailored to your industry's unique challenges.",
    },
    {
      icon: Rocket,
      title: "Rapid Deployment",
      description: "Go from proof-of-concept to production in weeks, not months.",
    },
    {
      icon: Globe,
      title: "Scalable Infrastructure",
      description: "Handle millions of predictions per second with ease.",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance certifications.",
    },
  ];

  const activeIndustryData = industries[activeIndustry];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background with Parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-700"
          style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating Grid */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-sm font-medium">
              Industry Solutions
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Solutions Built for
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Your Industry
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Unlock the power of AI-driven predictions tailored to solve your
            specific business challenges. Trusted by industry leaders worldwide.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => setActiveIndustry(index)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeIndustry === index
                    ? `bg-gradient-to-r ${industry.color} text-white shadow-lg scale-105`
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                <industry.icon className="h-5 w-5" />
                <span className="text-sm">{industry.name}</span>
              </button>
            ))}
          </div>

          {/* Active Industry Showcase */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
            {/* Glow Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${activeIndustryData.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-2xl transition-opacity duration-500`}
            />

            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div
                  className={`inline-flex items-center gap-3 ${activeIndustryData.bgColor} backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6`}
                >
                  <div
                    className={`p-3 bg-gradient-to-r ${activeIndustryData.color} rounded-xl`}
                  >
                    <activeIndustryData.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {activeIndustryData.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {activeIndustryData.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {activeIndustryData.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-slate-300 group/feature hover:translate-x-2 transition-transform"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="group-hover/feature:text-white transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGetStarted}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${activeIndustryData.color} text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all`}
                >
                  Explore Solution
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Right Stats */}
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(activeIndustryData.stats).map(
                  ([key, value], i) => (
                    <div
                      key={i}
                      className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p
                        className={`text-4xl font-bold bg-gradient-to-r ${activeIndustryData.color} bg-clip-text text-transparent`}
                      >
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Popular Use Cases
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Discover how leading companies are leveraging predictive analytics
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Animated Border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${useCase.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex p-3 bg-gradient-to-r ${useCase.color} rounded-xl mb-4`}
                  >
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{useCase.description}</p>

                  <div
                    className={`inline-flex px-3 py-1 bg-gradient-to-r ${useCase.color} bg-opacity-10 border border-white/10 rounded-full`}
                  >
                    <span
                      className={`text-sm font-semibold bg-gradient-to-r ${useCase.color} bg-clip-text text-transparent`}
                    >
                      {useCase.benefit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Why Choose Praedico
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 text-center"
              >
                <div className="inline-flex p-4 bg-purple-500/10 rounded-2xl mb-4">
                  <benefit.icon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400">{benefit.description}</p>
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join industry leaders using Praedico to drive data-driven
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
                Talk to Sales
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

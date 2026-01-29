"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Code,
  Zap,
  Database,
  Shield,
  Rocket,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Play,
  FileText,
  Sparkles,
  Globe,
  Lock,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  Layers,
  Package,
  Cloud,
  Github,
  ExternalLink,
} from "lucide-react";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "getting-started",
  ]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const navigation = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      items: [
        { id: "overview", label: "Overview" },
        { id: "installation", label: "Installation" },
        { id: "quick-start", label: "Quick Start" },
        { id: "authentication", label: "Authentication" },
      ],
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: Code,
      items: [
        { id: "predictions", label: "Predictions" },
        { id: "models", label: "Models" },
        { id: "datasets", label: "Datasets" },
        { id: "webhooks", label: "Webhooks" },
      ],
    },
    {
      id: "guides",
      title: "Guides",
      icon: BookOpen,
      items: [
        { id: "building-models", label: "Building Models" },
        { id: "data-preparation", label: "Data Preparation" },
        { id: "deployment", label: "Deployment" },
        { id: "monitoring", label: "Monitoring" },
      ],
    },
    {
      id: "resources",
      title: "Resources",
      icon: Database,
      items: [
        { id: "examples", label: "Examples" },
        { id: "best-practices", label: "Best Practices" },
        { id: "troubleshooting", label: "Troubleshooting" },
        { id: "faq", label: "FAQ" },
      ],
    },
  ];

  const codeExamples = {
    javascript: `// Initialize Praedico SDK
import Praedico from '@praedico/sdk';

const client = new Praedico({
  apiKey: process.env.PRAEDICO_API_KEY,
  environment: 'production'
});

// Make a prediction
const result = await client.predict({
  model: 'revenue-forecast-v2',
  input: {
    historical_data: salesData,
    timeframe: '30d'
  }
});

console.log('Prediction:', result.prediction);
console.log('Confidence:', result.confidence);`,

    python: `# Initialize Praedico SDK
from praedico import Client

client = Client(
    api_key=os.environ.get('PRAEDICO_API_KEY'),
    environment='production'
)

# Make a prediction
result = client.predict(
    model='revenue-forecast-v2',
    input={
        'historical_data': sales_data,
        'timeframe': '30d'
    }
)

print(f"Prediction: {result.prediction}")
print(f"Confidence: {result.confidence}")`,

    curl: `# Make a prediction with cURL
curl -X POST https://api.praedico.com/v1/predict \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "revenue-forecast-v2",
    "input": {
      "historical_data": [...],
      "timeframe": "30d"
    }
  }'`,
  };

  const quickLinks = [
    {
      icon: Zap,
      title: "Quick Start Guide",
      description: "Get up and running in 5 minutes",
      color: "from-yellow-500 to-orange-500",
      link: "#quick-start",
    },
    {
      icon: Terminal,
      title: "API Reference",
      description: "Complete API documentation",
      color: "from-blue-500 to-cyan-500",
      link: "#api-reference",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Best practices for secure integration",
      color: "from-green-500 to-emerald-500",
      link: "#security",
    },
    {
      icon: Github,
      title: "GitHub Examples",
      description: "Sample code and projects",
      color: "from-purple-500 to-pink-500",
      link: "https://github.com/praedico",
    },
  ];

  const features = [
    {
      icon: Globe,
      title: "Global CDN",
      description: "99.99% uptime with edge locations worldwide",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified and GDPR compliant",
    },
    {
      icon: TrendingUp,
      title: "Scalable",
      description: "Handle millions of predictions per second",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-100ms response times",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-700"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        />
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
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/Cyber-warrior-2026/Praedico-application-2"
                target="_blank"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-sm font-medium">
              Developer Documentation
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Build with
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Praedico AI
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Everything you need to integrate powerful predictive analytics into
            your applications. Simple, fast, and developer-friendly.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-300`}
              />

              <div className="relative">
                <div
                  className={`inline-flex p-3 bg-gradient-to-r ${link.color} rounded-xl mb-4`}
                >
                  <link.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  {link.title}
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-slate-400">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <nav className="space-y-2">
                {navigation.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <section.icon className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-semibold text-slate-300 group-hover:text-white">
                          {section.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          expandedSections.includes(section.id)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-3">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                              activeTab === item.id
                                ? "bg-purple-500/20 text-purple-300 font-semibold"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Welcome to Praedico
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      Praedico is a powerful predictive analytics platform that
                      enables developers to integrate AI-driven insights into
                      their applications with just a few lines of code.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <feature.icon className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Getting Started Steps */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-purple-400" />
                      Ready to get started?
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Sign up for a free account",
                        "Get your API key from the dashboard",
                        "Install the SDK in your project",
                        "Make your first prediction",
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleGetStarted}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                      Start Building
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Installation Tab */}
              {activeTab === "installation" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Installation
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      Install the Praedico SDK using your preferred package
                      manager.
                    </p>
                  </div>

                  {/* Code Examples with Tabs */}
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-white/10 pb-2">
                      {["javascript", "python", "curl"].map((lang) => (
                        <button
                          key={lang}
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    {Object.entries(codeExamples).map(([lang, code]) => (
                      <div
                        key={lang}
                        className="relative bg-slate-950/50 border border-white/10 rounded-xl overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-mono text-slate-300 capitalize">
                              {lang}
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(code, lang)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {copiedCode === lang ? (
                              <>
                                <Check className="h-4 w-4 text-green-400" />
                                <span className="text-xs text-green-400">
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                  Copy
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm text-slate-300 font-mono">
                            {code}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Start Tab */}
              {activeTab === "quick-start" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Quick Start Guide
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      Get up and running with Praedico in less than 5 minutes.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Play className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          Video Tutorial
                        </h3>
                        <p className="text-slate-300 mb-4">
                          Watch our 5-minute quickstart video to see Praedico
                          in action.
                        </p>
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Watch Tutorial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs would follow similar patterns */}
              {activeTab !== "overview" &&
                activeTab !== "installation" &&
                activeTab !== "quick-start" && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Documentation Coming Soon
                    </h3>
                    <p className="text-slate-400">
                      We're working on this section. Check back soon!
                    </p>
                  </div>
                )}
            </div>
          </main>
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

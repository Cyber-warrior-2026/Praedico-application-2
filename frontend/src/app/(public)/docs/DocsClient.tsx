"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
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
    Sparkles,
    Globe,
    Lock,
    TrendingUp,
    Github,
    ExternalLink,
    Cpu,
    Layers,
    Box,
    Server,
    Key,
    AlertTriangle,
    FileJson,
    Webhook,
    Activity,
    CreditCard,
    Cloud,
    Settings,
    ArrowRight,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";
import { cn } from "@/lib/utils";

// --- TYPES ---
type DocSection = {
    id: string;
    title: string;
    content: React.ReactNode;
};

// --- ANIMATION VARIANTS ---
const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.05 } }
};

// --- COMPONENTS ---

const CodeBlock = ({ code, language, title }: { code: string, language: string, title?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-2xl my-6 group">
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    {title && <span className="text-xs font-mono text-slate-400">{title}</span>}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-600 uppercase">{language}</span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
            <div className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <pre className="text-sm font-mono leading-relaxed text-slate-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

const Callout = ({ type = "info", title, children }: { type?: "info" | "warning" | "success" | "danger", title?: string, children: React.ReactNode }) => {
    const styles = {
        info: "bg-blue-500/10 border-blue-500/20 text-blue-200",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-200",
        success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
        danger: "bg-red-500/10 border-red-500/20 text-red-200",
    };

    const icons = {
        info: <div className="p-1 bg-blue-500/20 rounded"><Zap className="w-4 h-4 text-blue-400" /></div>,
        warning: <div className="p-1 bg-amber-500/20 rounded"><AlertTriangle className="w-4 h-4 text-amber-400" /></div>,
        success: <div className="p-1 bg-emerald-500/20 rounded"><Check className="w-4 h-4 text-emerald-400" /></div>,
        danger: <div className="p-1 bg-red-500/20 rounded"><Shield className="w-4 h-4 text-red-400" /></div>,
    };

    return (
        <div className={cn("my-6 rounded-lg border p-4 flex gap-4", styles[type])}>
            <div className="shrink-0 mt-0.5">{icons[type]}</div>
            <div className="space-y-1">
                {title && <h4 className="font-bold text-sm">{title}</h4>}
                <div className="text-sm opacity-90 leading-relaxed">{children}</div>
            </div>
        </div>
    );
};

const QuickLinkCard = ({ icon: Icon, title, desc, href }: any) => (
    <motion.div
        variants={fadeIn}
        className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all hover:bg-white/[0.07] cursor-pointer"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative z-10 flex items-start justify-between">
            <div>
                <div className="p-3 bg-white/5 rounded-xl w-fit mb-4 group-hover:bg-indigo-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0" />
        </div>
    </motion.div>
);

const EndpointBadge = ({ method, path }: { method: string, path: string }) => {
    const colors: Record<string, string> = {
        GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        POST: "bg-green-500/20 text-green-400 border-green-500/30",
        PUT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        DELETE: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    return (
        <div className="flex items-center gap-3 font-mono text-sm mb-4 w-full overflow-x-auto">
            <span className={cn("px-2 py-1 rounded border text-xs font-bold", colors[method] || colors.GET)}>{method}</span>
            <span className="text-slate-300">{path}</span>
        </div>
    )
}

const Table = ({ headers, rows }: { headers: string[], rows: string[][] }) => (
    <div className="overflow-x-auto my-8 rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white">
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} className="px-6 py-4 font-semibold border-b border-white/10">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        {row.map((cell, j) => (
                            <td key={j} className="px-6 py-4 text-slate-400">
                                {j === 0 ? <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">{cell}</code> : cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function DocsClient() {
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started", "api-reference", "guides", "resources"]);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const scrollProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // --- NAVIGATION DATA STRUCTURE ---
    const navigation = [
        {
            id: "getting-started",
            title: "Getting Started",
            icon: Rocket,
            items: [
                { id: "overview", label: "Overview" },
                { id: "installation", label: "Installation" },
                { id: "quick-start", label: "Quick Start" },
                { id: "changelog", label: "Changelog" },
            ],
        },
        {
            id: "api-reference",
            title: "Core API",
            icon: Terminal,
            items: [
                { id: "authentication", label: "Authentication" },
                { id: "predict", label: "Predict Endpoint" },
                { id: "train", label: "Train Endpoint" },
                { id: "datasets", label: "Datasets API" },
                { id: "errors", label: "Error Handling" },
            ],
        },
        {
            id: "platform",
            title: "Platform",
            icon: Layers,
            items: [
                { id: "models", label: "Model Registry" },
                { id: "deployments", label: "Deployments" },
                { id: "webhooks", label: "Webhooks" },
                { id: "keys", label: "API Keys" },
            ],
        },
        {
            id: "guides",
            title: "Guides",
            icon: BookOpen,
            items: [
                { id: "rate-limits", label: "Rate Limits" },
                { id: "security", label: "Security Best Practices" },
                { id: "optimization", label: "Latency Optimization" },
                { id: "teams", label: "Team Management" },
            ],
        },
        {
            id: "resources",
            title: "Resources",
            icon: Database,
            items: [
                { id: "glossary", label: "Glossary" },
                { id: "faq", label: "FAQ" },
                { id: "support", label: "Support" },
            ]
        }
    ];

    // --- CONTENT MAPPING ---
    // This is where the massive amount of content resides. 
    // In a real app, this would be MDX files, but here we hardcode it for the single-file requirement.

    const codeExamples = {
        install: `npm install @praedico/sdk\n# or\nyarn add @praedico/sdk\n# or\npnpm add @praedico/sdk`,
        usage: `import { Praedico } from '@praedico/sdk';

const client = new Praedico({
  apiKey: process.env.PRAEDICO_KEY,
});

// Initialize prediction stream
const stream = await client.predict({
  model: 'market-v2',
  interval: '1ms'
});

stream.on('data', (prediction) => {
  console.log('Next Tick:', prediction.value);
});`,
        authHeader: `Authorization: Bearer sk_live_51M...`,
        errorResponse: `{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded the 1000 req/min limit.",
    "documentation_url": "https://docs.praedico.io/errors"
  }
}`,
        webhook: `// Express.js Webhook Handler
app.post('/webhooks/praedico', express.json(), (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'prediction.completed':
      const data = event.data;
      console.log('Prediction ready:', data.id);
      break;
    case 'model.trained':
      console.log('Model training finished:', event.data.model_id);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});`,
        curlPredict: `curl -X POST https://api.praedico.io/v1/predict \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "finance-sentiment-v4",
    "inputs": ["Market is looking bullish today due to recent fed announcements."]
  }'`
    };

    const handleGetStarted = () => setIsRegisterModalOpen(true);
    const handleSwitchToLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); };
    const handleSwitchToRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); };

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    // --- RENDER CONTENT BASED ON TAB ---
    const renderContent = () => {
        switch (activeTab) {
            // --- GETTING STARTED ---
            case 'overview':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-6 border border-indigo-500/20">
                                <Sparkles className="w-3 h-3" /> DOCS V2.4.0
                            </div>
                            <h1 className="text-5xl font-bold text-white mb-6">Praedico Documentation</h1>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
                                Praedico is the first predictive engine designed for the high-frequency era.
                                Integrate industry-agnostic forecasting into your stack in minutes, not months.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickLinkCard icon={Zap} title="Quick Start" desc="Deploy your first model in under 5 minutes." />
                            <QuickLinkCard icon={Layers} title="Architecture" desc="Deep dive into our Neural Engine." />
                            <QuickLinkCard icon={Code} title="SDK Reference" desc="Typescript, Python, and Go libraries." />
                            <QuickLinkCard icon={Shield} title="Security" desc="SOC2 Compliance and Encryption standards." />
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-3xl font-bold text-white mb-4">Why Praedico?</h2>
                            <p className="text-slate-400 text-lg mb-4">
                                Traditional ML pipelines are slow, brittle, and expensive. We built Praedico to solve the "Last Mile" problem of predictive analytics.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                {[
                                    "Isomorphic JS Runtime",
                                    "Zero-Latency Edge Inference",
                                    "Vector Database Built-in",
                                    "Automated Data Normalization"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <Check className="w-5 h-5 text-emerald-400" />
                                        <span className="text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'installation':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-6">Installation</h1>
                            <p className="text-lg text-slate-400 mb-8">
                                Our SDK is isomorphic—it runs on the Edge, in Node.js, or directly in the browser
                                (with limited privileges).
                            </p>
                        </div>
                        <CodeBlock code={codeExamples.install} language="bash" title="Terminal" />
                        <Callout type="info" title="Requirements">
                            <p>Node.js 18.0.0 or later is required. If you are using an older version, you may experience polyfill issues with the fetch API.</p>
                        </Callout>
                    </div>
                );

            case 'quick-start':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-6">Quick Start Guide</h1>
                            <p className="text-lg text-slate-400 mb-8">
                                Go from zero to prediction in under 5 minutes.
                            </p>
                        </div>

                        <div className="relative border-l-2 border-indigo-500/30 ml-3 space-y-12 pb-12">
                            <div className="pl-8 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#020617]" />
                                <h3 className="text-2xl font-bold text-white mb-4">1. Initialize the Client</h3>
                                <p className="text-slate-400 mb-6">
                                    Import the library and initialize it with your secret key. You can find this key in the Dashboard under Settings API Keys.
                                </p>
                                <CodeBlock code={`import { Praedico } from '@praedico/sdk';\n\nconst client = new Praedico({ apiKey: 'sk_live_...' });`} language="typescript" title="index.ts" />
                            </div>

                            <div className="pl-8 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#020617]" />
                                <h3 className="text-2xl font-bold text-white mb-4">2. Prepare your Input</h3>
                                <p className="text-slate-400 mb-6">
                                    Praedico accepts unstructured text, JSON objects, or time-series arrays.
                                </p>
                                <CodeBlock code={`const inputData = {\n  history: [120, 130, 145, 142, 150],\n  metadata: { sector: "tech" }\n};`} language="typescript" />
                            </div>

                            <div className="pl-8 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#020617]" />
                                <h3 className="text-2xl font-bold text-white mb-4">3. Generate Prediction</h3>
                                <CodeBlock code={`const prediction = await client.predict({\n  model: 'financial-forecast-v1',\n  input: inputData\n});\n\nconsole.log(prediction);`} language="typescript" />
                            </div>
                        </div>
                    </div>
                );

            // --- CORE API ---
            case 'authentication':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-6">Authentication</h1>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Praedico uses API keys to authenticate requests. You can view and manage your API keys in the Dashboard.
                            </p>
                        </div>

                        <Callout type="warning" title="Security Notice">
                            Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
                        </Callout>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Bearer Token</h3>
                            <p className="text-slate-400 mb-4">Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password.</p>
                            <CodeBlock code={codeExamples.authHeader} language="http" title="Header" />
                        </div>
                    </div>
                );

            case 'predict':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-6">Predictions Endpoint</h1>
                            <p className="text-lg text-slate-400">The core endpoint for generating forecast vectors.</p>
                        </div>

                        <div className="border-l-4 border-indigo-500 pl-6 py-2">
                            <EndpointBadge method="POST" path="/v1/forecast/stream" />
                            <p className="text-slate-400 mb-6">Initiates a real-time WebSocket stream for high-frequency prediction data.</p>

                            <Table
                                headers={["Parameter", "Type", "Required", "Description"]}
                                rows={[
                                    ["model_id", "string", "Yes", "The unique identifier of the pre-trained model."],
                                    ["input", "object", "Yes", "The data payload to analyze."],
                                    ["confidence", "float", "No", "Threshold 0.0 - 1.0 (Default 0.9)."],
                                    ["callback_url", "string", "No", "Webhook URL for async processing."]
                                ]}
                            />

                            <h3 className="text-xl font-bold text-white mb-4">Example Request</h3>
                            <CodeBlock code={codeExamples.curlPredict} language="bash" title="cURL" />
                        </div>
                    </div>
                );

            case 'webhooks':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-6">Webhooks</h1>
                            <p className="text-lg text-slate-400">
                                Listen for events on your Praedico account so your integration can automatically trigger reactions.
                            </p>
                        </div>

                        <Callout type="success" title="Best Practice">
                            Webhooks are recommended for long-running batch predictions or model training jobs that take more than 30 seconds.
                        </Callout>

                        <h3 className="text-xl font-bold text-white mb-4">Handling Events</h3>
                        <CodeBlock code={codeExamples.webhook} language="javascript" title="server.js" />

                        <h3 className="text-xl font-bold text-white mb-4">Event Types</h3>
                        <Table
                            headers={["Event", "Description"]}
                            rows={[
                                ["prediction.completed", "Triggered when an async prediction is ready."],
                                ["prediction.failed", "Triggered if the inference engine encounters an error."],
                                ["model.trained", "Triggered when fine-tuning completes."],
                                ["billing.alert", "Triggered when usage exceeds 80% of quota."]
                            ]}
                        />
                    </div>
                );

            case 'rate-limits':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-6">Rate Limits</h1>
                            <p className="text-lg text-slate-400">
                                API access is rate-limited to ensure fair usage and stability.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Free Tier</div>
                                <div className="text-3xl font-bold text-white mb-1">1,000</div>
                                <div className="text-sm text-slate-400">Requests / min</div>
                            </div>
                            <div className="bg-indigo-500/10 p-6 rounded-xl border border-indigo-500/20">
                                <div className="text-xs text-indigo-300 uppercase tracking-widest mb-2">Pro Tier</div>
                                <div className="text-3xl font-bold text-white mb-1">50,000</div>
                                <div className="text-sm text-indigo-200">Requests / min</div>
                            </div>
                            <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/20">
                                <div className="text-xs text-purple-300 uppercase tracking-widest mb-2">Enterprise</div>
                                <div className="text-3xl font-bold text-white mb-1">Unlimited</div>
                                <div className="text-sm text-purple-200">Custom Agreement</div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Handling Rate Limits</h3>
                        <p className="text-slate-400">
                            When the rate limit is exceeded, the API responds with a <code className="text-red-400">429 Too Many Requests</code> status code.
                            Your application should implement exponential backoff retry logic.
                        </p>
                        <CodeBlock code={codeExamples.errorResponse} language="json" title="429 Response" />
                    </div>
                );

            // --- FALLBACK ---
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                            <FileJson className="w-10 h-10 text-slate-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Documentation Updating</h2>
                        <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                            This section ({activeTab}) is currently being rewritten by our engineering team for the V3 release.
                        </p>
                        <button onClick={handleGetStarted} className="px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-full font-bold transition-colors shadow-lg shadow-white/10">
                            Contact Support
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans">

            {/* Scroll Progress */}
            <motion.div style={{ scaleX: scrollProgress }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-[100]" />

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                <div className="absolute top-[-20%] left-[-20%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto flex items-start pt-24 pb-20 px-4 md:px-8 gap-12">

                {/* --- MOBILE MENU TOGGLE --- */}
                <button
                    className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* --- SIDEBAR --- */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-40 w-72 bg-[#020617] border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] lg:bg-transparent lg:border-none overflow-y-auto scrollbar-hide p-6 lg:p-0",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="mb-8 lg:pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Operational</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            Praedico <span className="text-slate-600">/</span> Docs
                        </h2>
                    </div>

                    <nav className="space-y-8">
                        {navigation.map((section) => (
                            <div key={section.id}>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors group mb-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <span>{section.title}</span>
                                    </div>
                                    <ChevronDown className={cn("w-3 h-3 transition-transform opacity-50", expandedSections.includes(section.id) ? "rotate-180" : "")} />
                                </button>

                                <AnimatePresence>
                                    {expandedSections.includes(section.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col space-y-0.5 border-l border-white/10 ml-4 pl-4">
                                                {section.items.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            setActiveTab(item.id);
                                                            setMobileMenuOpen(false);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className={cn(
                                                            "relative text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 group flex items-center gap-2",
                                                            activeTab === item.id ? "text-white bg-white/5 font-medium" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                                                        )}
                                                    >
                                                        {activeTab === item.id && <div className="w-1 h-1 rounded-full bg-indigo-500 absolute left-[-21px]" />}
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 min-w-0 lg:max-w-4xl">

                    {/* Search Hero */}
                    <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-[#0B1121] border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                            <Search className="w-5 h-5 text-slate-500 mr-4" />
                            <input
                                type="text"
                                placeholder="Search anything (e.g. 'Webhooks', 'Rate Limits')..."
                                className="w-full bg-transparent border-none outline-none text-base text-white placeholder:text-slate-500 h-6"
                            />
                            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5 font-mono">
                                <span className="text-xs">⌘</span> K
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC CONTENT RENDERING */}
                    <div className="min-h-[60vh]">
                        {renderContent()}
                    </div>

                    {/* --- FOOTER FEEDBACK --- */}
                    <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Was this page helpful?</span>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Check className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <a href="#" className="hover:text-indigo-400 transition-colors">Edit on GitHub</a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">Report an Issue</a>
                        </div>
                    </div>

                </main>

                {/* --- TABLE OF CONTENTS (Right Sidebar) --- */}
                <aside className="hidden xl:block w-64 sticky top-32 shrink-0">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">On this page</h4>
                    <ul className="space-y-3 border-l border-white/10">
                        <li className="pl-4 border-l-2 border-indigo-500 text-indigo-400 text-sm font-medium -ml-[2px]">Introduction</li>
                        <li className="pl-4 border-l-2 border-transparent hover:border-slate-600 text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer -ml-[2px]">Quick Links</li>
                        <li className="pl-4 border-l-2 border-transparent hover:border-slate-600 text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer -ml-[2px]">Installation</li>
                        <li className="pl-4 border-l-2 border-transparent hover:border-slate-600 text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer -ml-[2px]">Code Examples</li>
                    </ul>

                    <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm">
                        <h5 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Live Support
                        </h5>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">Our engineers are available 24/7 to help you integrate.</p>
                        <Link href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
                            Chat Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </aside>

            </div>

            {/* MODALS */}
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={handleSwitchToRegister} />
        </div>
    );
}
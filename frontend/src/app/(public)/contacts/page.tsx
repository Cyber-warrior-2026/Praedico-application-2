"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Sparkles,
  Rocket,
  Award,
  Coffee,
  Heart,
  Code,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue
} from "framer-motion";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";
import { cn } from "@/lib/utils";

// --- 3D TILT CARD COMPONENT ---
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * 32.5;
    const mouseY = (e.clientY - rect.top) * 32.5;
    const rX = (mouseY / height - 32.5 / 2) * -1;
    const rY = mouseX / width - 32.5 / 2;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transform }}
      className={cn("relative h-full w-full rounded-2xl transition-all duration-200 ease-out", className)}
    >
      {children}
    </motion.div>
  );
}

function ScrollHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y, rotateX }}
      className="sticky top-0 h-screen flex flex-col items-center justify-center text-center max-w-7xl mx-auto px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md"
      >
        <Sparkles className="w-3 h-3" />
        <span>THE ARCHITECTS</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-6xl md:text-9xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 drop-shadow-2xl"
      >
        Minds Behind <br /> The Machine.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
      >
        Three passionate developers united by a shared vision: to build
        extraordinary intelligence that reshapes industries.
      </motion.p>
    </motion.div>
  );
}

export default function ContactsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleGetStarted = () => setIsRegisterModalOpen(true);
  const handleSwitchToLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); };
  const handleSwitchToRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); };

  const teamMembers = [
    {
      id: 1,
      name: "Priyank Gupta",
      role: "Team Leader & Core Mastermind",
      title: "The Visionary",
      description: "The heart and soul of Team Praedico. Priyank leads with vision, passion, and innovation, turning ambitious ideas into reality.",
      image: "/team/priyank.jpg",
      skills: ["Leadership", "Strategy", "Innovation", "Product Design"],
      social: {
        email: "priyank@praedico.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com",
        website: "https://priyankgupta.dev",
      },
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-500/30",
      accent: "text-purple-400"
    },
    {
      id: 2,
      name: "Arjun Singh Bhadauriya",
      role: "Core Developer",
      title: "The Architect",
      description: "Master of clean code and scalable architecture. Arjun transforms complex problems into elegant solutions with precision.",
      image: "/team/arjun.jpg",
      skills: ["Full-Stack", "System Design", "Database", "DevOps"],
      social: {
        email: "arjun22august@gmail.com",
        linkedin: "https://www.linkedin.com/in/arjun-singh-bhadauriya/",
        twitter: "https://x.com/ArjunSBhadoriya",
        github: "https://github.com/22Arjun",
        website: "https://arjunbhadoriya.dev",
      },
      gradient: "from-blue-500 to-cyan-600",
      border: "border-blue-500/30",
      accent: "text-cyan-400"
    },
    {
      id: 3,
      name: "Sambhav Jain",
      role: "Core Developer",
      title: "The Innovator",
      description: "Creative problem-solver and tech enthusiast. Sambhav brings cutting-edge solutions and relentless energy to every project.",
      image: "/team/sambhav.jpg",
      skills: ["Frontend", "UI/UX", "Three.js", "Animations"],
      social: {
        email: "sambhav@praedico.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com",
        website: "https://sambhavjain.dev",
      },
      gradient: "from-emerald-500 to-green-600",
      border: "border-emerald-500/30",
      accent: "text-emerald-400"
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 selection:text-white font-sans overflow-x-hidden relative">

      {/* --- GLOBAL AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HERO SECTION WITH 3D ZOOM --- */}
      <div className="relative h-[150vh] flex flex-col items-center justify-start perspective-1000 overflow-hidden">
        <ScrollHero />
      </div>

      {/* --- TEAM GRID (3D TILT CARDS) --- */}
      <section className="relative z-10 py-10 px-6 -mt-[40vh]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {teamMembers.map((member, i) => (
            <div key={member.id} className="h-[700px] w-full perspective-1000">
              <TiltCard className="group overflow-hidden">
                <div className={cn(
                  "relative h-full w-full rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border p-8 flex flex-col items-center text-center transition-all duration-500 group-hover:bg-slate-900/60 shadow-2xl overflow-hidden",
                  member.border
                )}>
                  {/* Background Glow */}
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br", member.gradient)} />

                  {/* Badge */}
                  {member.id === 1 && (
                    <div className="absolute top-6 right-6 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" /> LEADER
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative w-48 h-48 mb-8 mt-4 group-hover:scale-105 transition-transform duration-500">
                    <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-to-br", member.gradient)} />
                    <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-black">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-3xl font-bold text-white mb-1">{member.name}</h3>
                  <p className={cn("text-sm font-bold uppercase tracking-wider mb-4", member.accent)}>{member.role}</p>

                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 bg-white/5 px-3 py-1 rounded-lg">
                    <Rocket className="w-4 h-4" /> {member.title}
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    {member.description}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {member.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-slate-300 hover:bg-white/10 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Dock */}
                  <div className="mt-auto flex items-center gap-4">
                    {[
                      { icon: Mail, href: `mailto:${member.social.email}` },
                      { icon: Linkedin, href: member.social.linkedin },
                      { icon: Github, href: member.social.github },
                      { icon: Globe, href: member.social.website }
                    ].map((item, k) => (
                      <a
                        key={k}
                        href={item.href}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white transition-all hover:scale-110"
                      >
                        <item.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT CTA SECTION --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-12 md:p-24 text-center overflow-hidden relative">

          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          <Code className="absolute top-20 right-20 w-24 h-24 text-white/5 -rotate-12" />
          <Coffee className="absolute bottom-20 left-20 w-24 h-24 text-white/5 rotate-12" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Let's build something impossible.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              We are always looking for ambitious partners. Whether you have a groundbreaking idea
              or a complex problem, we have the engine to solve it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleGetStarted} className="h-16 px-10 rounded-full bg-white text-black font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Start a Project
              </button>
              <a href="mailto:team@praedico.com" className="h-16 px-10 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 group">
                <MessageCircle className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                Chat with Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={handleSwitchToRegister} />
    </div>
  );
}
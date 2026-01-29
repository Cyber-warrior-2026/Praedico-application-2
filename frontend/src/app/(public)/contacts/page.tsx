"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";

import {
  ArrowLeft,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Sparkles,
  Code,
  Rocket,
  Award,
  Coffee,
  Heart,
} from "lucide-react";

export default function ContactsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
  const teamMembers = [
    {
      id: 1,
      name: "Priyank Gupta",
      role: "Team Leader & Core Mastermind",
      title: "The Visionary",
      description:
        "The heart and soul of Team Praedico. Priyank leads with vision, passion, and innovation, turning ambitious ideas into reality.",
      image: "/team/priyank.jpg", // Add your image path
      skills: ["Leadership", "Strategy", "Innovation", "Product Design"],
      social: {
        email: "priyank@praedico.com",
        linkedin: "https://linkedin.com/in/priyankgupta",
        twitter: "https://twitter.com/priyankgupta",
        github: "https://github.com/priyankgupta",
        website: "https://priyankgupta.dev",
      },
      gradient: "from-purple-500 via-pink-500 to-red-500",
      bgGradient: "from-purple-50 to-pink-50",
      accentColor: "purple",
    },
    {
      id: 2,
      name: "Arjun Singh Bhadoriya",
      role: "Core Developer",
      title: "The Architect",
      description:
        "Master of clean code and scalable architecture. Arjun transforms complex problems into elegant solutions with precision and creativity.",
      image: "/team/arjun.jpg", // Add your image path
      skills: ["Full-Stack Dev", "System Design", "Database", "DevOps"],
      social: {
        email: "arjun@praedico.com",
        linkedin: "https://linkedin.com/in/arjunbhadoriya",
        twitter: "https://twitter.com/arjunbhadoriya",
        github: "https://github.com/arjunbhadoriya",
        website: "https://arjunbhadoriya.dev",
      },
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50 to-cyan-50",
      accentColor: "blue",
    },
    {
      id: 3,
      name: "Sambhav Jain",
      role: "Core Developer",
      title: "The Innovator",
      description:
        "Creative problem-solver and tech enthusiast. Sambhav brings cutting-edge solutions and relentless energy to every project.",
      image: "/team/sambhav.jpg", // Add your image path
      skills: ["Frontend", "UI/UX", "React/Next.js", "Animations"],
      social: {
        email: "sambhav@praedico.com",
        linkedin: "https://linkedin.com/in/sambhavjain",
        twitter: "https://twitter.com/sambhavjain",
        github: "https://github.com/sambhavjain",
        website: "https://sambhavjain.dev",
      },
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 to-emerald-50",
      accentColor: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>

        <button
  onClick={handleGetStarted}
  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
>
  Get Started
</button>

        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              Meet the Dream Team
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            The Minds Behind Praedico
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Three passionate developers united by a shared vision to build
            extraordinary products that make a difference.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(member.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${member.gradient} rounded-2xl blur opacity-0 group-hover:opacity-75 transition-all duration-500`}
              />

              {/* Main Card */}
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-all duration-500">
                {/* Leader Badge */}
                {member.id === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      <Award className="w-4 h-4" />
                      <span>Team Leader</span>
                    </div>
                  </div>
                )}

                {/* Image Section */}
                <div className="relative mb-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${member.bgGradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                  />
                  <div className="relative w-48 h-48 mx-auto">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity`}
                    />
                 <img
                     src={member.image}
                     alt={member.name}
                     className="w-full h-full rounded-2xl object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-500 group-hover:scale-105"
                    />

                  </div>
                </div>

                {/* Name & Title */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-purple-200 transition-all">
                    {member.name}
                  </h2>
                  <p
                    className={`text-sm font-semibold text-${member.accentColor}-400 mb-2`}
                  >
                    {member.role}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Rocket className="w-4 h-4" />
                    <span>{member.title}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 text-center">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={`mailto:${member.social.email}`}
                    className={`p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:${member.gradient} hover:border-transparent text-slate-400 hover:text-white transition-all hover:scale-110`}
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-transparent text-slate-400 hover:text-white transition-all hover:scale-110"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-sky-500 hover:border-transparent text-slate-400 hover:text-white transition-all hover:scale-110"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-gray-700 hover:border-transparent text-slate-400 hover:text-white transition-all hover:scale-110"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-transparent text-slate-400 hover:text-white transition-all hover:scale-110"
                    title="Website"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="relative bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 animate-pulse" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-red-400 animate-pulse" />
              <Coffee className="w-6 h-6 text-amber-400" />
              <Code className="w-6 h-6 text-green-400" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Work With Us?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              We're always excited to collaborate on innovative projects. Drop
              us a message and let's build something amazing together!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:team@praedico.com"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                Send Us an Email
              </a>
            <button
  onClick={handleGetStarted}
  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all hover:scale-105"
>
  Get Started
</button>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-slate-400 text-sm">
            © 2026 Praedico. Built with{" "}
            <Heart className="inline w-4 h-4 text-red-400 animate-pulse" /> by
            the Dream Team
          </p>
        </div>
      </div>
           {/* Register Modal */}
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

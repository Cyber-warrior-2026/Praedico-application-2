"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Sparkles, ArrowRight, ChevronDown, ImageIcon, Image, Maximize2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RegisterModal from "@/app/user/_components/RegisterModal";
import LoginModal from "@/app/user/_components/LoginModal";
import { cn } from "@/lib/utils";
import Scene from "./_components/Scene";

// --- SECTIONS ADAPTED FOR 3D OVERLAY ---

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
    return (
        <section className="h-[80vh] w-full flex items-center justify-center relative pointer-events-none">
            {/* Content Centered - Uses standard DOM flow inside the Scroll container */}
            <div className="text-center z-10 p-6 pointer-events-auto mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="inline-flex items-center gap-2 border border-white/10 bg-black/40 px-6 py-2 rounded-full text-xs font-mono text-indigo-300 mb-8 backdrop-blur-xl"
                >
                    <Sparkles className="w-3 h-3" />
                    <span className="tracking-[0.3em]">VISUAL JOURNEY</span>
                </motion.div>

                <h1 className="text-[10vw] md:text-[8vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-transparent leading-[0.8] tracking-tighter mix-blend-overlay opacity-90">
                    OUR <br /> GALLERY
                </h1>

                <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                    Explore the moments that define our journey. A curated collection of excellence, innovation, and celebration.
                </p>
            </div>
        </section>
    )
}

// ─── GALLERY DATA ───

const CATEGORIES = [
    "All Categories",
    "Annual Gatherings",
    "Attended Events",
    "Award Ceremony",
    "Award-winning Moments",
    "Company Events",
    "Festivals Celebrations",
    "Global Recognition",
    "Highlights",
    "Team Retreats",       // Added more
    "Product Launches"     // Added more
];

const GALLERY_IMAGES = [
    { id: 1, category: "Annual Gatherings", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop", title: "Global Summit 2025" },
    { id: 2, category: "Award Ceremony", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop", title: "Excellence Awards" },
    { id: 3, category: "Highlights", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop", title: "Keynote Session" },
    { id: 4, category: "Company Events", url: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800&auto=format&fit=crop", title: "Q3 Townhall" },
    { id: 5, category: "Global Recognition", url: "https://images.unsplash.com/photo-1475721025505-c08974ee03fb?q=80&w=800&auto=format&fit=crop", title: "International Press" },
    { id: 6, category: "Award-winning Moments", url: "https://images.unsplash.com/photo-1561489413-985b06da5bee?q=80&w=800&auto=format&fit=crop", title: "Innovation Trophy" },
    { id: 7, category: "Team Retreats", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop", title: "Leadership Retreat" },
    { id: 8, category: "Festivals Celebrations", url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop", title: "Diwali 2025" },
    { id: 9, category: "Attended Events", url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800&auto=format&fit=crop", title: "Tech Conference" },
    { id: 10, category: "Product Launches", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop", title: "V3.0 Unveiling" },
    { id: 11, category: "Highlights", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "Founders Panel" },
    { id: 12, category: "Company Events", url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop", title: "Hackathon Finals" },
];

export default function GalleryClient() {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleGetStarted = () => setIsRegisterModalOpen(true);
    const handleSwitchToLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); };
    const handleSwitchToRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); };

    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const filteredImages = useMemo(() => {
        if (selectedCategory === "All Categories") return GALLERY_IMAGES;
        return GALLERY_IMAGES.filter(img => img.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <>
            <Scene>
                <main className="w-full px-4 md:px-10 pb-40 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">

                    {/* 1. HERO */}
                    <HeroSection onGetStarted={handleGetStarted} />

                    {/* 2. GALLERY INTERFACE */}
                    <section className="relative z-10 max-w-7xl mx-auto min-h-screen pb-32">

                        {/* Filters Interface */}
                        <div className="sticky top-24 z-50 flex items-center justify-between bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:px-8 shadow-2xl mb-12">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                                    <Image className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm md:text-base tracking-wide">Category Filter</h3>
                                    <p className="text-xs text-slate-500 font-mono hidden md:block">Select an event category</p>
                                </div>
                            </div>

                            {/* Premium Dropdown */}
                            <div className="relative min-w-[200px] md:min-w-[280px]">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0F172A]/80 hover:bg-[#1E293B]/80 transition-colors border border-white/10 rounded-xl text-sm font-medium focus:outline-none"
                                >
                                    <span className="text-slate-200 truncate pr-4">{selectedCategory}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 right-0 mt-3 bg-[#0F172A]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-2 z-50 max-h-[350px] overflow-y-auto no-scrollbar"
                                        >
                                            <div className="flex flex-col gap-1">
                                                {CATEGORIES.map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={cn(
                                                            "text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                                            category === selectedCategory
                                                                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Masonry/Grid Gallery */}
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredImages.map((image) => (
                                    <motion.div
                                        key={image.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                                        className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-[4/3] cursor-pointer"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <span className="text-xs font-mono text-indigo-400 mb-2 uppercase tracking-wider">{image.category}</span>
                                            <h4 className="text-xl font-bold text-white flex justify-between items-center">
                                                {image.title}
                                                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                                    <Maximize2 className="w-4 h-4" />
                                                </div>
                                            </h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredImages.length === 0 && (
                                <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-20 text-center">
                                    <div className="inline-flex w-16 h-16 rounded-2xl bg-white/5 border border-white/10 items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Images Found</h3>
                                    <p className="text-slate-400">We are currently curating content for this category.</p>
                                </div>
                            )}
                        </motion.div>
                    </section>

                    {/* 3. FOOTER CTA */}
                    <section className="h-[60vh] flex flex-col items-center justify-center text-center">
                        <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8">
                            Join the Story.
                        </h2>
                        <button onClick={handleGetStarted} className="px-10 py-4 bg-white text-black rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            Become a Member
                        </button>
                    </section>

                </main>
            </Scene>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-6xl max-h-screen flex flex-col"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                            />
                            <div className="mt-6 text-center">
                                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-mono rounded-full mb-3">
                                    {selectedImage.category}
                                </span>
                                <h3 className="text-3xl font-bold text-white">{selectedImage.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={handleSwitchToRegister} />
        </>
    );
}
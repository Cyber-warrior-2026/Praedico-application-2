"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Download, ExternalLink, Calendar, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { certificateApi, Certificate } from "@/lib/api/certificate.api";

export default function ReportsPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const response = await certificateApi.getMyCertificates();
            if (response.success) {
                setCertificates(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleDownload = (cert: Certificate) => {
        // Create an invisible link to trigger the download
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${cert.certificateUrl}`;
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = `Certificate_${cert.certificateNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Background Gradients (Ambient) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-8 pt-24 pb-12 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Award size={14} /> My Achievements
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Certificates</span></h1>
                        <p className="text-slate-400 mt-2 max-w-xl">View and download your official Praedico subscription and completion certificates.</p>
                    </div>
                </div>

                {/* Certificates Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mb-4" />
                        <p className="text-slate-400 font-medium">Loading your certificates...</p>
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-[#0A0A0A] border border-white/10 rounded-[2rem]">
                        <div className="p-6 bg-white/5 rounded-full mb-6 relative">
                            <FileText size={48} className="text-slate-600" />
                            <div className="absolute bottom-0 right-0 bg-amber-500 p-1.5 rounded-full border-[3px] border-[#0A0A0A]">
                                <Loader2 size={16} className="text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Certificates Found</h2>
                        <p className="text-slate-400 max-w-md text-center">Your personalized certificates will appear here once your plan duration completes. Keep investing in your knowledge!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <motion.div
                                key={cert._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-[#0A0A0A] border border-white/10 hover:border-cyan-500/50 rounded-3xl overflow-hidden transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="p-8 relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                                            <Award size={24} />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold">
                                            <CheckCircle2 size={14} /> Official
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">Certificate of Completion</h3>
                                    <p className="text-sm font-medium text-slate-400 mb-6">{cert.planName} Plan</p>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <Calendar size={16} className="text-slate-500" />
                                            <span>Valid: <span className="font-medium text-white">{new Date(cert.startDate).toLocaleDateString()}</span> - <span className="font-medium text-white">{new Date(cert.endDate).toLocaleDateString()}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <FileText size={16} className="text-slate-500" />
                                            <span>Issued: <span className="font-medium text-white">{new Date(cert.issuedAt).toLocaleDateString()}</span></span>
                                        </div>
                                    </div>

                                    <div className="text-[10px] font-mono text-slate-500 mb-8 tracking-wider bg-white/5 p-2 rounded-lg text-center border border-white/5">
                                        ID: {cert.certificateNumber}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleDownload(cert)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
                                        >
                                            <Download size={16} /> Download
                                        </button>
                                        <button
                                            onClick={() => handleDownload(cert)} // Uses the same preview action with target="_blank"
                                            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-colors shrink-0"
                                            title="Preview PDF"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

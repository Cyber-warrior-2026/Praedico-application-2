"use client";

import React from 'react';
import { X, Brain, AlertCircle, FileText, CheckCircle, Lightbulb } from 'lucide-react';

interface StudentAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
}

export default function StudentAnalysisModal({ isOpen, onClose, student }: StudentAnalysisModalProps) {
    if (!isOpen || !student) return null;

    const hasAnalysis = !!student.portfolioReport?.analysis;
    const hasRemarks = !!student.teacherReview;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/50 scale-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-slate-900/80 via-indigo-950/30 to-slate-900/80 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                            <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                                <Brain className="w-5 h-5 text-indigo-400" />
                            </div>
                            Student Analysis Details
                        </h2>
                        <p className="text-sm text-slate-400 mt-1.5 ml-0.5">
                            Performance review for <span className="text-indigo-300 font-medium">{student.name}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {hasAnalysis ? (
                        <div className="space-y-6">
                            {/* AI Analysis Section */}
                            <div className="bg-gradient-to-br from-indigo-500/5 to-slate-900/50 rounded-2xl border border-indigo-500/10 p-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                    AI Generated Portfolio Analysis
                                </h3>
                                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#020617]/50 rounded-xl p-5 border border-white/5">
                                    {student.portfolioReport?.analysis}
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Generated on {new Date(student.portfolioReport?.generatedAt).toLocaleDateString('en-IN', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            {/* Coordinator Remarks Section */}
                            {hasRemarks && (
                                <div className="bg-gradient-to-br from-emerald-500/5 to-slate-900/50 rounded-2xl border border-emerald-500/10 p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-emerald-400" />
                                            Coordinator Remarks & Review
                                        </h3>
                                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${student.teacherReview.aggregateScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                student.teacherReview.aggregateScore >= 60 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    student.teacherReview.aggregateScore >= 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Score</span>
                                            <span className="text-lg font-bold">{student.teacherReview.aggregateScore}/100</span>
                                        </div>
                                    </div>

                                    {student.teacherReview.suggestions ? (
                                        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#020617]/50 rounded-xl p-5 border border-white/5 border-l-2 border-l-emerald-500/50">
                                            {student.teacherReview.suggestions}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-500 italic bg-[#020617]/50 rounded-xl p-5 border border-white/5">
                                            No additional remarks provided by the coordinator.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Please Reconcile State */
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="h-20 w-20 bg-slate-800/80 rounded-full flex items-center justify-center border border-white/10 relative z-10">
                                    <Brain className="w-10 h-10 text-indigo-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Please Reconcile</h3>
                            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                                No AI analysis has been generated for this student yet. Click the <span className="text-indigo-400 font-semibold px-1">Reconcile</span> button on the main dashboard to generate insights and enable coordinator review.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#0B1120] rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors border border-white/5"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

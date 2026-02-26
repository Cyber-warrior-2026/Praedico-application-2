"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Star, CheckCircle, AlertCircle, RefreshCcw, Send } from 'lucide-react';
import { coordinatorApi } from '@/lib/api';

interface Student {
    _id: string;
    name: string;
    email: string;
    portfolioReport?: {
        analysis: string;
        generatedAt: string;
    };
    teacherReview?: {
        factor1Rating: number;
        factor2Rating: number;
        factor3Rating: number;
        aggregateScore: number;
        suggestions: string;
    };
}

// Helper to parse the 7 sections from the AI text
const parseReportSections = (analysisText: string) => {
    const sections = [
        "Portfolio Health Assessment",
        "Diversification Analysis",
        "Risk Assessment",
        "Recommendations for Rebalancing",
        "Stocks to Consider Selling",
        "Categories to Invest More In",
        "Overall Strategy Suggestions"
    ];

    const result: string[] = new Array(7).fill("No data found.");
    if (!analysisText) return result;

    // Check if it's the fallback AI error message
    if (analysisText.includes("Portfolio analysis unavailable") || analysisText.includes("Unable to generate portfolio analysis")) {
        return new Array(7).fill("Unable to analyze portfolio. Ensure the student has active trades.");
    }

    // Check if it's the empty portfolio message
    if (analysisText.includes("Your portfolio is empty")) {
        return new Array(7).fill("Student has no trades in their portfolio yet.");
    }

    // A more robust regex approach: look for "1. ", " 1. ", "\n1.", "**1.**", etc.
    const parts = analysisText.split(/(?:^|\n)\s*\**[1-7]\.\**\s*(?:\*\*)?[^\n*]*?(?:\*\*)?:?\s*/);

    // parts[0] is usually intro text. parts[1] to parts[7] are the actual content.
    for (let i = 1; i <= 7; i++) {
        if (parts[i] && parts[i].trim() !== "") {
            result[i - 1] = parts[i].trim();
        }
    }

    return result;
};

export default function ReconcileReviewPage() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set());
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Form state (mapped by student ID)
    const [reviews, setReviews] = useState<Record<string, { f1: number, f2: number, f3: number, suggestions: string }>>({});

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await coordinatorApi.getMyStudents();
            if (data.success && data.students) {
                // Only show students who have a report
                const studentsWithReports = data.students.filter((s: Student) => !!s.portfolioReport?.analysis);
                setStudents(studentsWithReports);

                // Initialize form state for those who aren't reviewed yet, or load existing review to edit
                const initialReviews: Record<string, any> = {};
                studentsWithReports.forEach((s: Student) => {
                    initialReviews[s._id] = {
                        f1: s.teacherReview?.factor1Rating || 0,
                        f2: s.teacherReview?.factor2Rating || 0,
                        f3: s.teacherReview?.factor3Rating || 0,
                        suggestions: s.teacherReview?.suggestions || ""
                    };
                });
                setReviews(initialReviews);
            }
        } catch (e: any) {
            console.error(e);
            setNotification({ type: 'error', message: 'Failed to fetch students for review' });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (studentId: string, factor: 'f1' | 'f2' | 'f3', value: number) => {
        setReviews(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [factor]: value }
        }));
    };

    const handleSuggestionChange = (studentId: string, value: string) => {
        setReviews(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], suggestions: value }
        }));
    };

    const handleSubmitReview = async (studentId: string) => {
        const review = reviews[studentId];
        if (!review || review.f1 === 0 || review.f2 === 0 || review.f3 === 0) {
            setNotification({ type: 'error', message: 'Please provide ratings for all 3 factors.' });
            return;
        }

        setSubmittingIds(prev => new Set(prev).add(studentId));
        try {
            const result = await coordinatorApi.submitReview(studentId, {
                factor1Rating: review.f1,
                factor2Rating: review.f2,
                factor3Rating: review.f3,
                suggestions: review.suggestions
            });

            if (result.success) {
                setNotification({ type: 'success', message: 'Review submitted successfully!' });

                // Update local student state to show it's reviewed
                setStudents(prev => prev.map(s => {
                    if (s._id === studentId) {
                        return {
                            ...s,
                            teacherReview: {
                                factor1Rating: review.f1,
                                factor2Rating: review.f2,
                                factor3Rating: review.f3,
                                suggestions: review.suggestions,
                                aggregateScore: result.aggregateScore
                            }
                        };
                    }
                    return s;
                }));
            }
        } catch (e: any) {
            setNotification({ type: 'error', message: e.response?.data?.message || 'Failed to submit review' });
        } finally {
            setSubmittingIds(prev => {
                const next = new Set(prev);
                next.delete(studentId);
                return next;
            });
        }
    };

    const renderStars = (studentId: string, factor: 'f1' | 'f2' | 'f3', currentValue: number) => {
        return (
            <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        onClick={() => handleRatingChange(studentId, factor, star)}
                        className={`transition-colors flex-shrink-0 ${currentValue >= star ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400/50'}`}
                    >
                        <Star className="w-5 h-5 fill-current" />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden p-6 md:p-10">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 w-full mx-auto space-y-8" style={{ maxWidth: '100%' }}>
                {/* Header */}
                <div className="flex items-center gap-4 animate-slide-down border-b border-white/10 pb-6">
                    <button
                        onClick={() => router.push('/organization/coordinator/students')}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            Reconcile Review
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">
                            Evaluate AI Portfolio Reports and provide teacher feedback
                        </p>
                    </div>
                    {loading && <RefreshCcw className="w-5 h-5 text-indigo-500 animate-spin ml-auto" />}
                </div>

                {loading && students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                        <p className="mt-4 text-slate-400 font-medium">Loading reports for review...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="bg-[#0F172A]/80 border border-white/5 rounded-2xl p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Reports Pending Review</h3>
                        <p className="text-slate-400">All students have been reviewed or no students have reports yet. Make sure to run the Reconciliation Engine first.</p>
                    </div>
                ) : (
                    <div className="bg-[#0F172A]/80 border border-white/5 rounded-2xl shadow-2xl overflow-hidden overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[2000px]">
                            <thead>
                                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider bg-[#020617]/50 border-b border-white/10">
                                    <th className="p-4 w-64 border-r border-white/5 sticky left-0 bg-[#020617] z-20 shadow-sm shadow-black/50">Student</th>
                                    <th className="p-4 w-80 border-r border-white/5">1. Health Assessment</th>
                                    <th className="p-4 w-80 border-r border-white/5">2. Diversification</th>
                                    <th className="p-4 w-80 border-r border-white/5">3. Risk Assessment</th>
                                    <th className="p-4 w-64 border-r border-white/5">4. Rebalancing</th>
                                    <th className="p-4 w-64 border-r border-white/5">5. Consider Selling</th>
                                    <th className="p-4 w-64 border-r border-white/5">6. Invest More In</th>
                                    <th className="p-4 w-64 border-r border-white/5">7. Overall Strategy</th>
                                    <th className="p-4 w-80">Teacher Suggestion & Submit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 relative">
                                {students.map((student, idx) => {
                                    const sections = parseReportSections(student.portfolioReport?.analysis || "");
                                    const isReviewed = student.teacherReview?.aggregateScore !== undefined;
                                    const reviewState = reviews[student._id] || { f1: 0, f2: 0, f3: 0, suggestions: '' };
                                    const isSubmitting = submittingIds.has(student._id);

                                    return (
                                        <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                                            {/* Column: Student Info (Sticky) */}
                                            <td className="p-4 border-r border-white/5 sticky left-0 bg-[#0F172A] group-hover:bg-[#151e32] z-10 align-top shadow-sm shadow-black/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        {isReviewed && (
                                                            <div className="absolute -top-1 -right-1 bg-emerald-500 p-[2px] rounded-full border border-white" title="Reviewed">
                                                                <CheckCircle className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-bold text-slate-200 truncate" title={student.name}>{student.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{student.email}</p>
                                                        {isReviewed && (
                                                            <div className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 inline-block px-2 py-0.5 rounded-md">
                                                                Score: {student.teacherReview!.aggregateScore}/100
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Columns 1-3: Ratable Factors */}
                                            {(['f1', 'f2', 'f3'] as const).map((factor, i) => (
                                                <td key={factor} className="p-4 border-r border-white/5 align-top">
                                                    <div className="h-40 overflow-y-auto pr-2 custom-scrollbar text-sm text-slate-400 mb-3 bg-[#020617]/50 border border-white/5 rounded-lg p-3">
                                                        {sections[i]}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rate</span>
                                                        {renderStars(student._id, factor, reviewState[factor])}
                                                    </div>
                                                </td>
                                            ))}

                                            {/* Columns 4-7: Read-only AI recommendations */}
                                            {[3, 4, 5, 6].map(i => (
                                                <td key={`sec-${i}`} className="p-4 border-r border-white/5 align-top">
                                                    <div className="h-52 overflow-y-auto pr-2 custom-scrollbar text-sm text-slate-400 bg-[#020617]/50 border border-white/5 rounded-lg p-3">
                                                        {sections[i]}
                                                    </div>
                                                </td>
                                            ))}

                                            {/* Last Column: Suggestions and Submit */}
                                            <td className="p-4 align-top">
                                                <div className="h-full flex flex-col">
                                                    <textarea
                                                        className="w-full flex-grow h-40 resize-none bg-[#020617] border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none custom-scrollbar"
                                                        placeholder="Provide helpful suggestions based on the AI recommendations..."
                                                        value={reviewState.suggestions}
                                                        onChange={(e) => handleSuggestionChange(student._id, e.target.value)}
                                                    ></textarea>

                                                    <button
                                                        onClick={() => handleSubmitReview(student._id)}
                                                        disabled={isSubmitting || reviewState.f1 === 0 || reviewState.f2 === 0 || reviewState.f3 === 0}
                                                        className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isReviewed
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                                            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {isSubmitting ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : isReviewed ? (
                                                            <CheckCircle className="w-4 h-4" />
                                                        ) : (
                                                            <Send className="w-4 h-4" />
                                                        )}
                                                        {isSubmitting ? "Submitting..." : isReviewed ? "Update Review" : "Submit Review"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Notification Toast */}
                {notification && (
                    <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-[100] ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100">&times;</button>
                    </div>
                )}

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                        height: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                `}} />
            </div>
        </div>
    );
}

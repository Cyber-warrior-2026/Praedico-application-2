"use client";
import React, { useState, useEffect } from "react";
import {
    Building2, PlusCircle, ShieldOff, Sparkles, RefreshCcw, Search,
    Loader2, Globe, Clock, ShieldCheck, Mail, MapPin, Phone
} from "lucide-react";
import axiosInstance from "@/lib/axios";

// ============================================
// TYPES
// ============================================

interface Organization {
    _id: string;
    organizationName: string;
    email: string;
    phone?: string;
    address?: { city?: string; state?: string };
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;

    // Subscription fields
    subscriptionStatus?: 'active' | 'inactive' | 'expired';
    subscriptionPlan?: string;
    subscriptionExpiry?: string;
    maxStudents?: number;

    // Stats
    totalStudents: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function InstitutesManagementPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modals
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [activateModalOpen, setActivateModalOpen] = useState(false);
    const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

    // Form State
    const [planName, setPlanName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [maxStudents, setMaxStudents] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/organization/all', {
                params: { search: searchQuery }
            });
            if (response.data.success) {
                setOrganizations(response.data.organizations);
            }
        } catch (err) {
            console.error("Failed to fetch organizations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, [searchQuery]);

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrg || !planName || !expiryDate) return;

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.patch(`/api/organization/${selectedOrg._id}/subscription/activate`, {
                subscriptionPlan: planName,
                subscriptionExpiry: expiryDate,
                maxStudents: maxStudents || 0
            });

            if (response.data.success) {
                setActivateModalOpen(false);
                fetchOrganizations(); // Refresh list
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to activate subscription.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedOrg) return;

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.patch(`/api/organization/${selectedOrg._id}/subscription/deactivate`);
            if (response.data.success) {
                setDeactivateModalOpen(false);
                fetchOrganizations(); // Refresh list
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to deactivate subscription.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleActive = async (orgId: string) => {
        try {
            await axiosInstance.patch(`/api/organization/${orgId}/toggle-active`);
            fetchOrganizations();
        } catch (err) {
            console.error(err);
        }
    };

    // ============================================
    // HELPERS & STATS
    // ============================================

    const activeSubs = organizations.filter(o => o.subscriptionStatus === 'active').length;
    const expiredSubs = organizations.filter(o => o.subscriptionStatus === 'expired').length;

    const getSubBadge = (org: Organization) => {
        if (org.subscriptionStatus === 'active') {
            return (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Plan
                </span>
            );
        } else if (org.subscriptionStatus === 'expired') {
            return (
                <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-full w-fit">
                    Expired Plan
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-slate-500/10 border border-slate-500/20 text-slate-400 text-xs font-bold rounded-full w-fit">
                Inactive / Free
            </span>
        );
    };

    // ============================================
    // UI RENDERING
    // ============================================

    return (
        <div className="min-h-screen w-full bg-[#030712] text-slate-200 font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-slide-up">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                                Institutes Management
                            </h1>
                            <button onClick={fetchOrganizations} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <p className="text-slate-500 mt-2 text-sm font-medium tracking-wide">
                            Admin Portal • Manage organizational subscriptions and access
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                            <Building2 className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Institutes</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{organizations.length}</h3>
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                            <Sparkles className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Subscriptions</p>
                            <h3 className="text-3xl font-bold text-emerald-300 tracking-tight">{activeSubs}</h3>
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                            <ShieldOff className="h-6 w-6 text-rose-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Expired / Inactive</p>
                            <h3 className="text-3xl font-bold text-rose-300 tracking-tight">{expiredSubs}</h3>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="rounded-[32px] bg-[#0F172A]/80 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-white/5 bg-[#0F172A]/50">
                        <div className="relative w-full lg:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search institutes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 border border-white/5 rounded-2xl bg-[#020617] text-sm text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative min-h-[400px]">
                        {loading && organizations.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/50 z-20">
                                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-[#020617]/50">
                                            <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Organization</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Subscription</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Plan Details</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Students</th>
                                            <th className="px-6 py-5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {organizations.map((org) => (
                                            <tr key={org._id} className={`hover:bg-white/[0.02] transition-colors ${!org.isActive ? 'opacity-60' : ''}`}>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
                                                            {org.organizationName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-200">{org.organizationName}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Mail className="h-3 w-3 text-slate-500" />
                                                                <span className="text-xs text-slate-400 font-medium">{org.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {getSubBadge(org)}
                                                </td>
                                                <td className="px-6 py-5">
                                                    {org.subscriptionPlan ? (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-bold text-indigo-300">{org.subscriptionPlan}</span>
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Clock className="h-3 w-3" />
                                                                Expires: {new Date(org.subscriptionExpiry!).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-600 italic">No plan assigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium text-slate-300">{org.totalStudents}</div>
                                                        {org.maxStudents ? (
                                                            <span className="text-xs text-slate-500">/ {org.maxStudents}</span>
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    {org.subscriptionStatus === 'active' ? (
                                                        <button
                                                            onClick={() => { setSelectedOrg(org); setDeactivateModalOpen(true); }}
                                                            className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold rounded-xl transition-all"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrg(org);
                                                                setPlanName(org.subscriptionPlan || "Institute Pro");
                                                                // Default expiry to 1 year from now if empty
                                                                const nextYear = new Date();
                                                                nextYear.setFullYear(nextYear.getFullYear() + 1);
                                                                setExpiryDate(org.subscriptionExpiry ? new Date(org.subscriptionExpiry).toISOString().split('T')[0] : nextYear.toISOString().split('T')[0]);
                                                                setMaxStudents(org.maxStudents || 0);
                                                                setActivateModalOpen(true);
                                                            }}
                                                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold rounded-xl transition-all"
                                                        >
                                                            Activate Plan
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ACTIVATE MODAL --- */}
            {activateModalOpen && selectedOrg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                        <h3 className="text-xl font-bold text-white mb-2">Activate Subscription</h3>
                        <p className="text-slate-400 text-sm mb-6">Set up the premium plan for <span className="text-white font-semibold">{selectedOrg.organizationName}</span>.</p>

                        <form onSubmit={handleActivate} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Plan Name</label>
                                <input
                                    type="text"
                                    required
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    className="w-full mt-1 bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                    placeholder="e.g. University Standard, Custom Pro"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Expiry Date</label>
                                <input
                                    type="date"
                                    required
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full mt-1 bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none [color-scheme:dark]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Max Students (0 = unlimited)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={maxStudents}
                                    onChange={(e) => setMaxStudents(parseInt(e.target.value))}
                                    className="w-full mt-1 bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setActivateModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 text-sm font-bold">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all disabled:opacity-50">
                                    {isSubmitting ? "Activating..." : "Activate Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DEACTIVATE MODAL --- */}
            {deactivateModalOpen && selectedOrg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <ShieldOff className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Deactivate Plan?</h3>
                        <p className="text-slate-400 text-sm mb-6">Are you sure you want to deactivate the subscription for <span className="text-white font-semibold">{selectedOrg.organizationName}</span>? Students will lose premium access immediately.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeactivateModalOpen(false)} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 text-sm font-bold">Cancel</button>
                            <button onClick={handleDeactivate} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all disabled:opacity-50">
                                {isSubmitting ? "Deactivating..." : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
        </div>
    );
}

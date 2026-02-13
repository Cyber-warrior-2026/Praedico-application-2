"use client";

import { useState, useEffect } from 'react';
import { GraduationCap, UserCheck, TrendingUp, Activity, Clock, ArrowUpRight, ShieldCheck, Users } from 'lucide-react';
import { coordinatorApi } from '@/lib/api';
import Link from 'next/link';

interface Stats {
    totalStudents: number;
    pendingApprovals: number;
}

export default function CoordinatorDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalStudents: 0,
        pendingApprovals: 0,
    });
    const [coordName, setCoordName] = useState('');
    const [deptName, setDeptName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coordData, studentsData, pendingData] = await Promise.all([
                    coordinatorApi.getMe(),
                    coordinatorApi.getMyStudents(),
                    coordinatorApi.getPendingStudents(),
                ]);

                if (coordData.success && coordData.coordinator) {
                    setCoordName(coordData.coordinator.name || 'Coordinator');
                    setDeptName(coordData.coordinator.department?.departmentName || 'Department');
                }

                setStats({
                    totalStudents: studentsData.students?.length || 0,
                    pendingApprovals: pendingData.students?.length || 0,
                });
            } catch (e) {
                console.error('Failed to fetch dashboard data', e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#030712]">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-slate-200">
            {/* HERO BANNER */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-10 shadow-2xl shadow-indigo-900/50 ring-1 ring-white/10 group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-all duration-1000"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-400/40 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md w-fit mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-white/90">{deptName} Department</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">{coordName}</span>!
                        </h1>
                        <p className="text-indigo-100/80 max-w-xl text-lg font-light leading-relaxed">
                            You have <span className="font-bold text-white border-b border-white/30">{stats.pendingApprovals} pending students</span> requiring your approval today.
                        </p>
                    </div>
                </div>
            </div>

            {/* METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DarkMetricCard
                    title="Total Students"
                    value={stats.totalStudents.toString()}
                    sub="Registered in Department"
                    icon={GraduationCap}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    border="group-hover:border-blue-500/50"
                />
                <DarkMetricCard
                    title="Pending Approvals"
                    value={stats.pendingApprovals.toString()}
                    sub="Requires verification"
                    icon={UserCheck}
                    color="text-orange-400"
                    bg="bg-orange-500/10"
                    border="group-hover:border-orange-500/50"
                />
                <DarkMetricCard
                    title="Department Status"
                    value="Active"
                    sub="System Operational"
                    icon={Activity}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    border="group-hover:border-emerald-500/50"
                />
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Pending Approvals</h3>
                                <p className="text-slate-400 text-sm mt-1">Review student registration requests</p>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                <UserCheck className="w-6 h-6 text-orange-400" />
                            </div>
                        </div>

                        <Link href="/organization/coordinator/students/pending">
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                                Review <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{stats.pendingApprovals}</span> Requests <ArrowUpRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Manage Students</h3>
                                <p className="text-slate-400 text-sm mt-1">View all students in your department</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>

                        <Link href="/organization/coordinator/students">
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                                View directory <ArrowUpRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ------------------------------------------
// HELPER COMPONENTS
// ------------------------------------------

function DarkMetricCard({ title, value, sub, icon: Icon, color, bg, border }: any) {
    return (
        <div className={`rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${border}`}>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                <Icon size={64} className={color} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-4 rounded-2xl ${bg} group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <TrendingUp className={`w-5 h-5 ${color} opacity-50`} />
            </div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
                    {sub}
                </p>
            </div>
        </div>
    );
}

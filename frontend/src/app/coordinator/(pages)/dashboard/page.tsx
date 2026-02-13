"use client";

import { useState, useEffect } from 'react';
import { GraduationCap, UserCheck, TrendingUp } from 'lucide-react';
import { coordinatorApi } from '@/lib/api';

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
                const [coordData, allStudentsData, pendingData] = await Promise.all([
                    coordinatorApi.getMe(),
                    coordinatorApi.getMyStudents(),
                    coordinatorApi.getPendingStudents(),
                ]);

                if (coordData.success && coordData.coordinator) {
                    setCoordName(coordData.coordinator.name || 'Coordinator');
                    setDeptName(coordData.coordinator.department?.departmentName || 'Department');
                }

                setStats({
                    totalStudents: allStudentsData.students?.length || 0,
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

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: GraduationCap,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingApprovals,
            icon: UserCheck,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {coordName}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {deptName} - Coordinator Dashboard
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                                </div>
                                <TrendingUp className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                                {card.title}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {card.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="/coordinator/students/pending"
                        className="p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
                    >
                        <UserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Approve Students
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Review and approve pending student registrations
                        </p>
                    </a>
                    <a
                        href="/coordinator/students"
                        className="p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                    >
                        <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            View All Students
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            View and manage all students in your department
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}

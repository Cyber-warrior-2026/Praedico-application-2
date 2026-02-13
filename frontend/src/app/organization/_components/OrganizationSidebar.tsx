"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCheck,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
} from 'lucide-react';
import { organizationApi } from '@/lib/api';

interface MenuItem {
    href: string;
    label: string;
    icon: any;
    badge?: number;
}

interface MenuGroup {
    title: string;
    items: MenuItem[];
}

export default function OrganizationSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [orgName, setOrgName] = useState('Organization');
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const data = await organizationApi.getMe();
                if (data.success && data.organization) {
                    setOrgName(data.organization.organizationName || 'Organization');
                }

                const pendingData = await organizationApi.getPendingStudents();
                if (pendingData.success) {
                    setPendingCount(pendingData.students?.length || 0);
                }
            } catch (e) {
                console.error('Failed to fetch organization data', e);
            }
        };
        fetchOrgData();
    }, []);

    const handleLogout = async () => {
        try {
            await organizationApi.logout();
            router.push('/');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    const MENU_GROUPS: MenuGroup[] = [
        {
            title: 'Overview',
            items: [
                { href: '/organization/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            ],
        },
        {
            title: 'Management',
            items: [
                { href: '/organization/departments', label: 'Departments', icon: Building2 },
                { href: '/organization/coordinators', label: 'Coordinators', icon: Users },
                { href: '/organization/students/pending', label: 'Pending Approvals', icon: UserCheck, badge: pendingCount },
                { href: '/organization/students', label: 'All Students', icon: GraduationCap },
            ],
        },
        {
            title: 'Settings',
            items: [
                { href: '/organization/settings', label: 'Settings', icon: Settings },
            ],
        },
    ];

    return (
        <div
            className={`${isOpen ? 'w-64' : 'w-20'
                } bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 flex flex-col`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                {isOpen && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-[150px]">
                                {orgName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Admin Portal</span>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {isOpen ? (
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {MENU_GROUPS.map((group) => (
                    <div key={group.title}>
                        {isOpen && (
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                {group.title}
                            </h3>
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            {isOpen && (
                                                <>
                                                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                                                    {item.badge !== undefined && item.badge > 0 && (
                                                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer - Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );
}

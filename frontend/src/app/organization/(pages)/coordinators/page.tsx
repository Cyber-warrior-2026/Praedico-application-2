"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Mail, Phone } from 'lucide-react';
import { coordinatorApi, departmentApi } from '@/lib/api';

interface Coordinator {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    designation: string;
    department: {
        _id: string;
        departmentName: string;
    };
    isVerified: boolean;
}

interface Department {
    _id: string;
    departmentName: string;
}

export default function CoordinatorsPage() {
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        departmentId: '',
        name: '',
        email: '',
        mobile: '',
        designation: 'hod' as 'hod' | 'faculty' | 'coordinator' | 'other',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [coordData, deptData] = await Promise.all([
                coordinatorApi.getAllCoordinators(),
                departmentApi.getDepartments(),
            ]);

            if (coordData.success) {
                setCoordinators(coordData.coordinators || []);
            }
            if (deptData.success) {
                setDepartments(deptData.departments || []);
            }
        } catch (e) {
            console.error('Failed to fetch data', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await coordinatorApi.createCoordinator(formData);
            setShowModal(false);
            setFormData({
                departmentId: '',
                name: '',
                email: '',
                mobile: '',
                designation: 'hod',
            });
            fetchData();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to create coordinator');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coordinator?')) return;
        try {
            await coordinatorApi.deleteCoordinator(id);
            fetchData();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Delete failed');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Coordinators
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage department coordinators
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Coordinator
                </button>
            </div>

            {/* Coordinators Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Designation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {coordinators.map((coord) => (
                            <tr key={coord._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {coord.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {coord.department?.departmentName || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {coord.email}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="w-4 h-4" />
                                            {coord.mobile}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                                    {coord.designation}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${coord.isVerified
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}
                                    >
                                        {coord.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(coord._id)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Add Coordinator
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Department *
                                </label>
                                <select
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept._id} value={dept._id}>
                                            {dept.departmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Mobile *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Designation *
                                </label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                >
                                    <option value="hod">HOD</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({
                                            departmentId: '',
                                            name: '',
                                            email: '',
                                            mobile: '',
                                            designation: 'hod',
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

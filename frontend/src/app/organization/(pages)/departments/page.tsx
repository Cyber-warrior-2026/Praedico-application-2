"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { departmentApi } from '@/lib/api';

interface Department {
    _id: string;
    departmentName: string;
    departmentCode: string;
    description?: string;
    isActive: boolean;
    studentCount?: number;
    coordinatorCount?: number;
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState({
        departmentName: '',
        departmentCode: '',
        description: '',
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await departmentApi.getDepartments();
            if (data.success) {
                setDepartments(data.departments || []);
            }
        } catch (e) {
            console.error('Failed to fetch departments', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await departmentApi.updateDepartment(editingDept._id, formData);
            } else {
                await departmentApi.createDepartment(formData);
            }
            setShowModal(false);
            setFormData({ departmentName: '', departmentCode: '', description: '' });
            setEditingDept(null);
            fetchDepartments();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (dept: Department) => {
        setEditingDept(dept);
        setFormData({
            departmentName: dept.departmentName,
            departmentCode: dept.departmentCode,
            description: dept.description || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this department?')) return;
        try {
            await departmentApi.deleteDepartment(id);
            fetchDepartments();
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
                        Departments
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your organization's departments
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingDept(null);
                        setFormData({ departmentName: '', departmentCode: '', description: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Department
                </button>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div
                        key={dept._id}
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept._id)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {dept.departmentName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Code: {dept.departmentCode}
                        </p>
                        {dept.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                {dept.description}
                            </p>
                        )}
                        <div className="flex gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Students: <strong>{dept.studentCount || 0}</strong>
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                                Coordinators: <strong>{dept.coordinatorCount || 0}</strong>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {editingDept ? 'Edit Department' : 'Add Department'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Department Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.departmentName}
                                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Department Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.departmentCode}
                                    onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingDept(null);
                                        setFormData({ departmentName: '', departmentCode: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingDept ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

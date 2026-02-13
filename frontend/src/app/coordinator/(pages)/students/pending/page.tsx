"use client";

import { useState, useEffect } from 'react';
import { Check, X, GraduationCap, Mail, Phone } from 'lucide-react';
import { coordinatorApi } from '@/lib/api';

interface Student {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    registrationNumber?: string;
    createdAt: string;
}

export default function CoordinatorPendingStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    const fetchPendingStudents = async () => {
        try {
            const data = await coordinatorApi.getPendingStudents();
            if (data.success) {
                setStudents(data.students || []);
            }
        } catch (e) {
            console.error('Failed to fetch pending students', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (studentId: string) => {
        setProcessing(studentId);
        try {
            await coordinatorApi.approveStudent({ studentId, action: 'approve' });
            fetchPendingStudents();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Approval failed');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (studentId: string) => {
        if (!confirm('Are you sure you want to reject this student?')) return;
        setProcessing(studentId);
        try {
            await coordinatorApi.approveStudent({ studentId, action: 'reject' });
            fetchPendingStudents();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Rejection failed');
        } finally {
            setProcessing(null);
        }
    };

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
                    Pending Student Approvals
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Review and approve student registrations ({students.length} pending)
                </p>
            </div>

            {/* Students List */}
            {students.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-800">
                    <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Pending Approvals
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        All student registrations have been processed
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <div
                            key={student._id}
                            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                                        {student.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <span>{student.mobile}</span>
                                </div>
                                {student.registrationNumber && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Reg: {student.registrationNumber}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(student._id)}
                                    disabled={processing === student._id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(student._id)}
                                    disabled={processing === student._id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

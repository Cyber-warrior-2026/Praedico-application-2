"use client";

import { useState, useEffect } from 'react';
import { GraduationCap, Search, Filter } from 'lucide-react';
import { organizationApi } from '@/lib/api';

interface Student {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    department: {
        _id: string;
        departmentName: string;
    };
    registrationNumber?: string;
    isApproved: boolean;
    createdAt: string;
}

export default function AllStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await organizationApi.getAllStudents();
            if (data.success) {
                setStudents(data.students || []);
            }
        } catch (e) {
            console.error('Failed to fetch students', e);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        All Students
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Total: {students.length} students
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Registration No.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {filteredStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {student.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {student.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {student.department?.departmentName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {student.mobile}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {student.registrationNumber || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${student.isApproved
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}
                                    >
                                        {student.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

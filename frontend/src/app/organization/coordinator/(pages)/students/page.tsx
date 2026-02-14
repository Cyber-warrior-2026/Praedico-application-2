"use client";

import { useState, useEffect } from 'react';
import {
    GraduationCap, Search, Filter, MoreVertical,
    ChevronRight, Mail, Phone, Calendar,
    RefreshCcw, Loader2, Users, UserPlus, FileSpreadsheet,
    Download, Upload, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { coordinatorApi } from '@/lib/api';

interface Student {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    registrationNumber?: string;
    organizationApprovalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function CoordinatorAllStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Form States
    const [newStudent, setNewStudent] = useState({ name: '', email: '' });
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [importResult, setImportResult] = useState<any>(null); // To store CSV import summary
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await coordinatorApi.getMyStudents();
            if (data.success) {
                setStudents(data.students || []);
            }
        } catch (e) {
            console.error('Failed to fetch students', e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await coordinatorApi.addStudent(newStudent);
            if (response.success) {
                setNotification({ type: 'success', message: 'Student added successfully! Verification email sent.' });
                setShowAddModal(false);
                setNewStudent({ name: '', email: '' });
                fetchStudents();
            }
        } catch (error: any) {
            setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to add student' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImportCSV = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!csvFile) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('students', csvFile); // Key must match what backend expects (which is usually 'file' or inside 'students' array if sending JSON, but for file upload it's simpler)

        // Wait, my backend expects JSON body { students: [] } for importStudentsCSV?
        // Let me check my backend summary.
        // Backend Summary says: POST /api/coordinator/students/import-csv Body: { students: [...] }
        // BUT wait, I implemented `importStudentsCSV` controller to expect: `const { students } = importCSVSchema.parse(req.body);`
        // Validation schema: `students: z.array(...)`
        // THIS MEANS: It expects JSON, NOT Multipart Form Data directly.
        // My frontend API client `importStudentsCSV` sends FormData? 
        // Let me re-read my backend implementation code.

        // Controller:
        // importStudentsCSV = asyncHandler(async (req: Request, res: Response) => {
        //   const { students } = importCSVSchema.parse(req.body);
        //   const result = await coordinatorService.importStudentsFromCSV(coordinatorId, students);

        // Frontend API Client:
        // importStudentsCSV: async (formData: FormData) => { ... headers: 'multipart/form-data' }

        // CONTRACTION! 
        // The backend expects JSON body, but I planned for CSV upload.
        // I need to parse CSV on frontend OR update backend to accept file upload.
        // The Implementation Plan said: "Frontend: Parse CSV on file selection -> Show preview -> On import -> Call POST ... with JSON"
        // So I should parse CSV here on frontend and send JSON.

        // Actually, let's Stick to the plan: Parse CSV on Frontend.

        // For CSV parsing, I'll need a simple parser function or library. 
        // Since I can't install packages, I'll write a simple CSV parser function.

        // Let's implement handles accordingly.
    };

    const parseCSV = (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                const result = [];
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    const currentline = lines[i].split(',');
                    const obj: any = {};
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j]?.trim();
                    }
                    if (obj.name && obj.email) {
                        result.push(obj);
                    }
                }
                resolve(result);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    const processImport = async () => {
        if (!csvFile) return;
        setIsSubmitting(true);
        try {
            const parsedData = await parseCSV(csvFile);
            if (parsedData.length === 0) {
                setNotification({ type: 'error', message: 'No valid data found in CSV' });
                setIsSubmitting(false);
                return;
            }

            // Send JSON data
            // I need to update my API client to send JSON instead of FormData
            // Or I can just manually call axios here, or fix the API client first.
            // I'll fix API client in a next step if needed, but for now let's assume I fix it.
            // Wait, I just updated Api client to send FormData. 
            // I should revert that change or update backend to accept file.
            // Updating backend to accept file adds complexity (multer).
            // Updating frontend to send JSON is easier.

            // I will execute a fix on API Client to send JSON.

            const response = await coordinatorApi.importStudentsCSV({ students: parsedData } as any); // Type assertion for now

            if (response.success) {
                setImportResult(response);
                setNotification({ type: 'success', message: 'Import processed successfully' });
                fetchStudents();
            }
        } catch (error: any) {
            setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to import CSV' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = "name,email,organization,department\nJohn Doe,john@example.com,My Org,My Dept\nJane Smith,jane@example.com,My Org,My Dept";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "student_import_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.registrationNumber && student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen w-full bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden p-6 md:p-10">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-down">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                                Student Directory
                            </h1>
                            <button
                                onClick={fetchStudents}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                title="Refresh List"
                            >
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <p className="text-slate-500 mt-2 text-sm font-medium tracking-wide">
                            Coordinator Portal • All Students
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-bold">{students.length} Total</span>
                        </div>

                        <button
                            onClick={() => setShowImportModal(true)}
                            className="bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 transition-all"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span className="hidden md:inline">Import CSV</span>
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="hidden md:inline">Add Student</span>
                        </button>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="rounded-[32px] bg-[#0F172A]/80 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#0F172A]/50">
                        {/* Search */}
                        <div className="relative w-full lg:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, reg no..."
                                className="block w-full pl-11 pr-4 py-3.5 bg-[#020617] border border-white/5 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {/* Potential bulk actions here in future */}
                        </div>
                    </div>

                    <div className="relative min-h-[400px]">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/50 z-20">
                                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                                <p className="mt-4 text-sm text-slate-400 font-medium animate-pulse">Fetching students...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                    <Search className="h-8 w-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">No Students Found</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto">We couldn't find any students matching your search.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-white/5 bg-[#020617]/50">
                                            <th className="pb-4 pt-4 pl-8 font-semibold">Student Name</th>
                                            <th className="pb-4 pt-4 font-semibold">Contact Info</th>
                                            <th className="pb-4 pt-4 font-semibold">Registration Info</th>
                                            <th className="pb-4 pt-4 font-semibold">Status</th>
                                            <th className="pb-4 pt-4 font-semibold">Joined Date</th>
                                            <th className="pb-4 pt-4 pr-8 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-white/5">
                                        {filteredStudents.map((student, index) => (
                                            <tr
                                                key={student._id}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                                style={{ animation: `slideUp 0.3s ease-out ${index * 0.05}s backwards` }}
                                            >
                                                <td className="py-4 pl-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex-shrink-0 shadow-lg flex items-center justify-center text-sm font-bold text-white border border-white/10">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{student.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Mail className="w-3.5 h-3.5" /> {student.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Phone className="w-3.5 h-3.5" /> {student.mobile}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    {student.registrationNumber ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono border border-slate-700">
                                                                {student.registrationNumber}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 italic">Not provided</span>
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${student.organizationApprovalStatus === 'approved'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : student.organizationApprovalStatus === 'rejected'
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                        {student.organizationApprovalStatus === 'approved' ? 'Active' : student.organizationApprovalStatus.charAt(0).toUpperCase() + student.organizationApprovalStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(student.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-8 text-right">
                                                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}

                {/* Add Student Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Add New Student</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddStudent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStudent.name}
                                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                        placeholder="Enter student name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={newStudent.email}
                                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                        placeholder="Enter student email"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                        {isSubmitting ? 'Adding...' : 'Add Student'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Import CSV Modal */}
                {showImportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Import Students via CSV</h3>
                                <button onClick={() => { setShowImportModal(false); setImportResult(null); setCsvFile(null); }} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {!importResult ? (
                                <div className="space-y-6">
                                    {/* Template Download */}
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-blue-400 text-sm">Need a template?</h4>
                                            <p className="text-slate-400 text-xs mt-1">Download sample CSV file to see required format</p>
                                        </div>
                                        <button
                                            onClick={downloadTemplate}
                                            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </button>
                                    </div>

                                    {/* File Upload */}
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 hover:bg-white/[0.02] transition-colors text-center cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">
                                                    {csvFile ? csvFile.name : "Click to upload or drag & drop"}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1">CSV files only (max 5MB)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={processImport}
                                        disabled={!csvFile || isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                                        {isSubmitting ? 'Processing...' : 'Import Students'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Success Summary */}
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            <h4 className="font-bold text-emerald-400">Import Complete</h4>
                                        </div>
                                        <p className="text-sm text-slate-300">
                                            Successfully added <span className="text-white font-bold">{importResult.summary.successfullyAdded}</span> students.
                                        </p>
                                    </div>

                                    {/* Skipped Items */}
                                    {importResult.details.skipped.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-amber-400 text-sm mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Skipped ({importResult.details.skipped.length})
                                            </h4>
                                            <div className="bg-[#020617] rounded-xl border border-white/5 p-3 max-h-32 overflow-y-auto space-y-2">
                                                {importResult.details.skipped.map((item: any, idx: number) => (
                                                    <div key={idx} className="text-xs text-slate-400 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                                        <span className="text-white">{item.email}</span>: {item.reason}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Errors */}
                                    {importResult.details.errors.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-red-400 text-sm mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Errors ({importResult.details.errors.length})
                                            </h4>
                                            <div className="bg-[#020617] rounded-xl border border-white/5 p-3 max-h-32 overflow-y-auto space-y-2">
                                                {importResult.details.errors.map((item: any, idx: number) => (
                                                    <div key={idx} className="text-xs text-slate-400 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                                        Row {item.row}: {item.error}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => { setShowImportModal(false); setImportResult(null); setCsvFile(null); }}
                                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Notification Toast */}
                {notification && (
                    <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-[100] ${notification.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
            {/* Global CSS for Animations */}
            <style jsx global>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
                .animate-slide-down { animation: slideDown 0.6s ease-out forwards; }
                .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
}


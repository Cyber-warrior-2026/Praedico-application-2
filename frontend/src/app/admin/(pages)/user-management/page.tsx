"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  UserCheck,
  UserX,
  Ban,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Clock,
  RotateCcw,
  Save,
  Mail,
  CheckCircle2,
  Archive,     // NEW
  RefreshCcw,  // NEW
  History      // NEW
} from "lucide-react";
import axios from "axios";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean; // NEW: Soft delete flag
  deletedAt?: string; // NEW: Soft delete timestamp
  lastLogin?: string;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  registeredUsers: number;
  deletedUsers: number; // NEW: Stats for deletion
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function UserManagementPage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    blockedUsers: 0,
    registeredUsers: 0,
    deletedUsers: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false); // Renamed from Delete
  const [restoreModalOpen, setRestoreModalOpen] = useState(false); // NEW

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user"
  });
  const [isSaving, setIsSaving] = useState(false);

  // ============================================
  // API FUNCTIONS
  // ============================================

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        role: roleFilter,
        status: statusFilter, // Backend should handle 'deleted' status filter
      });

      const response = await axios.get(
        `http://localhost:5001/api/users/all?${params}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      if (users.length === 0) {
        setError(err.response?.data?.message || "Failed to fetch users");
      }
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/users/stats",
        { withCredentials: true }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // --- NEW: PROFESSIONAL SOFT DELETE (ARCHIVE) ---
  const handleSoftDeleteUser = async (userId: string) => {
    const previousUsers = [...users];

    // Optimistic Update: Mark as deleted locally first
    setUsers((current) =>
      current.map(u => u._id === userId ? { ...u, isDeleted: true, deletedAt: new Date().toISOString() } : u)
    );
    setArchiveModalOpen(false);
    setActionMenuOpen(null);

    try {
      // Using PATCH implies we are modifying the 'isDeleted' field, not removing the record
      const response = await axios.patch(
        `http://localhost:5001/api/users/${userId}/soft-delete`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        fetchStats();
        // If we are actively filtering out deleted users, remove from view
        if (statusFilter !== 'deleted' && statusFilter !== 'all') {
          setUsers(prev => prev.filter(u => u._id !== userId));
        }
      }
    } catch (err: any) {
      setUsers(previousUsers); // Rollback
      alert(err.response?.data?.message || "Failed to archive user");
    }
  };

  // --- NEW: RESTORE FUNCTIONALITY ---
  const handleRestoreUser = async (userId: string) => {
    const previousUsers = [...users];

    // Optimistic Update
    setUsers((current) =>
      current.map(u => u._id === userId ? { ...u, isDeleted: false, deletedAt: undefined, isActive: false } : u)
    );
    setRestoreModalOpen(false);
    setActionMenuOpen(null);

    try {
      const response = await axios.patch(
        `http://localhost:5001/api/users/${userId}/restore`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        fetchStats();
        if (statusFilter === 'deleted') {
          setUsers(prev => prev.filter(u => u._id !== userId));
        }
      }
    } catch (err: any) {
      setUsers(previousUsers); // Rollback
      alert(err.response?.data?.message || "Failed to restore user");
    }
  };

  const handleToggleActive = async (userId: string) => {
    const previousUsers = [...users];
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user._id === userId) {
          return { ...user, isActive: !user.isActive };
        }
        return user;
      })
    );
    setActionMenuOpen(null);

    try {
      const response = await axios.patch(
        `http://localhost:5001/api/users/${userId}/toggle-active`,
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        fetchStats();
      } else {
        setUsers(previousUsers);
        alert("Server failed to update status");
      }
    } catch (err: any) {
      console.error("Toggle error:", err);
      setUsers(previousUsers);
      alert("Failed to update status. Please check your connection.");
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:5001/api/users/${selectedUser._id}`,
        editFormData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(prev => prev.map(u =>
          u._id === selectedUser._id ? { ...u, ...editFormData, role: editFormData.role as User["role"] } : u
        ));
        setEditModalOpen(false);
      }
    } catch (err: any) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Role", "Status", "Joined"],
      ...users.map((u) => [
        u.name,
        u.email,
        u.role,
        u.isDeleted
          ? "Archived"
          : u.isActive && u.isVerified
            ? "Active"
            : "Inactive",
        new Date(u.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString()}.csv`;
    a.click();
  };

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [pagination.page, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchQuery, roleFilter, statusFilter]);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getStatusBadge = (user: User) => {
    // Priority 1: Deleted
    if (user.isDeleted) {
      return (
        <div className="flex items-center gap-2">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-500"></span>
          <span className="text-slate-500 text-xs font-semibold tracking-wide uppercase">Archived</span>
        </div>
      );
    }
    // Priority 2: Active
    if (user.isActive && user.isVerified) {
      return (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">Active</span>
        </div>
      );
    } else if (!user.isActive) {
      return (
        <div className="flex items-center gap-2">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
          <span className="text-rose-400 text-xs font-semibold tracking-wide uppercase">Blocked</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          <span className="text-amber-400 text-xs font-semibold tracking-wide uppercase">Inactive</span>
        </div>
      );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-bold tracking-wider uppercase">Super Admin</span>
      case 'admin':
        return <span className="px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[10px] font-bold tracking-wider uppercase">Admin</span>
      default:
        return <span className="px-2 py-0.5 rounded border border-slate-500/30 bg-slate-500/10 text-slate-400 text-[10px] font-bold tracking-wider uppercase">User</span>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const statsCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "text-white", gradient: "from-blue-600 to-indigo-600" },
    { icon: Sparkles, label: "Active Now", value: stats.activeUsers, color: "text-emerald-300", gradient: "from-emerald-600 to-teal-600" },
    { icon: Shield, label: "Blocked", value: stats.blockedUsers, color: "text-rose-300", gradient: "from-rose-600 to-red-600" },
    { icon: Archive, label: "Archived", value: stats.deletedUsers || 0, color: "text-slate-300", gradient: "from-slate-600 to-gray-600" }, // Updated Stat
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

      {/* --- AMBIENT BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-down">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                User Management
              </h1>
              <button
                onClick={fetchUsers}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title="Refresh List"
              >
                <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-slate-500 mt-2 text-sm font-medium tracking-wide">
              Admin Portal • System Overview
            </p>
          </div>

          <button
            onClick={handleExport}
            className="group relative px-6 py-3 rounded-xl bg-[#0F172A] border border-white/10 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 relative z-10">
              <Download className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Export CSV</span>
            </div>
          </button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative group p-6 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                    <h3 className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${stat.color} opacity-80`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* --- MAIN CONTENT CARD --- */}
        <div className="rounded-[32px] bg-[#0F172A]/80 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden animate-slide-up">

          {/* TOOLBAR */}
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
                placeholder="Search users..."
                className="block w-full pl-11 pr-4 py-3.5 bg-[#020617] border border-white/5 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3.5 bg-[#020617] border border-white/5 rounded-2xl text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative flex-1 lg:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3.5 bg-[#020617] border border-white/5 rounded-2xl text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="deleted">Archived</option> {/* NEW OPTION */}
                  <option value="unverified">Unverified</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative min-h-[400px]">
            {loading && users.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/50 z-20">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <p className="mt-4 text-sm text-slate-400 font-medium animate-pulse">Fetching data...</p>
              </div>
            ) : users.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                  <Search className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">No users found</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">We couldn't find any users matching your current filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#020617]/50">
                      <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Last Active</th>
                      <th className="px-6 py-5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`group hover:bg-white/[0.02] transition-colors duration-300 ${user.isDeleted ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
                        style={{ animation: `slideUp 0.3s ease-out ${index * 0.05}s backwards` }}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg bg-gradient-to-br ${user.isDeleted
                              ? 'from-slate-600 to-gray-600'
                              : ['from-pink-500 to-rose-500', 'from-indigo-500 to-blue-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500'][index % 4]
                              }`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className={`text-sm font-semibold text-slate-200 ${!user.isDeleted && 'group-hover:text-indigo-400'} transition-colors`}>{user.name}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-5">
                          {getStatusBadge(user)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{getTimeAgo(user.lastActive || user.lastLogin)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setSelectedUser(user); setViewModalOpen(true); }}
                              className="p-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-400 transition-all"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Only show Edit for non-deleted users */}
                            {!user.isDeleted && (
                              <button
                                onClick={() => handleEditClick(user)}
                                className="p-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400 transition-all"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}

                            {/* Restore Button (Visible directly if deleted) */}
                            {user.isDeleted && (
                              <button
                                onClick={() => { setSelectedUser(user); setRestoreModalOpen(true); }}
                                className="p-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400 transition-all"
                                title="Restore User"
                              >
                                <RefreshCcw className="h-4 w-4" />
                              </button>
                            )}

                            <div className="relative">
                              <button
                                onClick={() => setActionMenuOpen(actionMenuOpen === user._id ? null : user._id)}
                                className={`p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 transition-all ${actionMenuOpen === user._id ? 'bg-slate-700 text-white' : ''}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {actionMenuOpen === user._id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(null)} />
                                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {!user.isDeleted ? (
                                      <>
                                        <button
                                          onClick={() => handleToggleActive(user._id)}
                                          className="w-full text-left px-4 py-3 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                          <Ban className="h-3.5 w-3.5" />
                                          {user.isActive ? "Block Access" : "Unblock User"}
                                        </button>
                                        <button
                                          onClick={() => { setSelectedUser(user); setArchiveModalOpen(true); }}
                                          className="w-full text-left px-4 py-3 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-2 border-t border-white/5"
                                        >
                                          <Archive className="h-3.5 w-3.5" />
                                          Archive User
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => { setSelectedUser(user); setRestoreModalOpen(true); }}
                                        className="w-full text-left px-4 py-3 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2"
                                      >
                                        <RefreshCcw className="h-3.5 w-3.5" />
                                        Restore Account
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {!loading && users.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-[#020617]/30 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Page <span className="text-white">{pagination.page}</span> of {pagination.totalPages} • Total <span className="text-white">{pagination.total}</span> users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/5 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/5 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* View User Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <button onClick={() => setViewModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-8 mt-2">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold text-white">{selectedUser.name}</h3>
              <p className="text-slate-500 text-sm">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#020617] border border-white/5">
                <span className="text-sm text-slate-500">System Role</span>
                {getRoleBadge(selectedUser.role)}
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#020617] border border-white/5">
                <span className="text-sm text-slate-500">Account Status</span>
                {getStatusBadge(selectedUser)}
              </div>
              {selectedUser.isDeleted && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#020617] border border-white/5">
                  <span className="text-sm text-slate-500">Archived Date</span>
                  <span className="text-sm font-semibold text-amber-500">{formatDate(selectedUser.deletedAt || new Date().toISOString())}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-14 w-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                <Edit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Edit User Profile</h3>
              <p className="text-slate-500 text-sm mt-1">Update account details and permissions.</p>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">System Role</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <select
                    value={editFormData.role}
                    // @ts-ignore
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-3.5 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive (Soft Delete) Modal */}
      {archiveModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Archive className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Archive User?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              You are about to archive <span className="text-white font-semibold">{selectedUser.name}</span>. The user will be hidden but can be restored later.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setArchiveModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all">Cancel</button>
              <button onClick={() => handleSoftDeleteUser(selectedUser._id)} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition-all">Archive</button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {restoreModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Restore Account?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              You are about to restore <span className="text-white font-semibold">{selectedUser.name}</span>. They will regain access immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRestoreModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all">Cancel</button>
              <button onClick={() => handleRestoreUser(selectedUser._id)} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all">Confirm Restore</button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Keyframes for smooth animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, User, CheckCircle, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { authApi, organizationApi, departmentApi } from "@/lib/api";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registerMode, setRegisterMode] = useState<'user' | 'organization'>('user');

  // Async Data
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");

  // Fetch Orgs on mount
  useEffect(() => {
    organizationApi.getPublicList()
      .then(res => setOrganizations(res.organizations || []))
      .catch(err => console.error("Failed to fetch organizations", err));
  }, []);

  // Fetch Depts on org change
  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    setSelectedDeptId("");
    if (orgId) {
      departmentApi.getPublicDepartments(orgId)
        .then(res => setDepartments(res.departments || []))
        .catch(err => console.error("Failed to fetch departments", err));
    } else {
      setDepartments([]);
    }
  };

  // User registration form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Organization registration form data
  const [orgFormData, setOrgFormData] = useState({
    organizationName: "",
    organizationType: "university" as 'university' | 'college' | 'institute' | 'school' | 'other',
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    registeredByName: "",
    registeredByEmail: "",
    registeredByDesignation: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (registerMode === 'user') {
        // User registration
        await authApi.register({
          email: formData.email,
          name: formData.name,
          organizationId: selectedOrgId,
          departmentId: selectedDeptId,
        });
      } else {
        // Organization registration
        await organizationApi.register({
          organizationName: orgFormData.organizationName,
          organizationType: orgFormData.organizationType,
          address: orgFormData.address,
          city: orgFormData.city,
          state: orgFormData.state,
          pincode: orgFormData.pincode,
          country: orgFormData.country || undefined,
          contactEmail: orgFormData.contactEmail,
          contactPhone: orgFormData.contactPhone,
          website: orgFormData.website || undefined,
          registeredBy: {
            name: orgFormData.registeredByName,
            email: orgFormData.registeredByEmail,
            designation: orgFormData.registeredByDesignation,
          },
        });
      }

      setSuccess(true);

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        if (registerMode === 'user') {
          setFormData({ name: "", email: "" });
        } else {
          setOrgFormData({
            organizationName: "",
            organizationType: "university",
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            contactEmail: "",
            contactPhone: "",
            website: "",
            registeredByName: "",
            registeredByEmail: "",
            registeredByDesignation: "",
          });
        }
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-30 animate-pulse" />

        {/* Main Modal */}
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-hide">
          {/* Decorative Top Bar */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 z-10 group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5" />
            </div>
          </button>

          {/* Content */}
          <div className="p-8 pt-6">
            {success ? (
              /* Success State */
              <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Check Your Email! 🎉
                </h3>
                <p className="text-gray-600 mb-4">
                  We've sent a verification link to
                </p>
                <p className="text-green-600 font-semibold mb-6">
                  {registerMode === 'user' ? formData.email : orgFormData.contactEmail}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Click the link to complete your registration
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8 animate-in slide-in-from-top duration-500">
                  {/* Icon */}
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
                    <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 rounded-full shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">
                    Join thousands of users building the future
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm animate-in slide-in-from-left duration-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    {error}
                  </div>
                )}

                {/* Mode Slider Toggle */}
                <div className="mb-6 flex items-center justify-center gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRegisterMode('user')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${registerMode === 'user'
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterMode('organization')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${registerMode === 'organization'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    Organization
                  </button>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-5">

                  {registerMode === 'user' ? (
                    <>
                      {/* USER REGISTRATION FORM */}

                      {/* 0. Organization & Department Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Organization Select */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            Organization(Optional)
                          </label>
                          <select
                            value={selectedOrgId}
                            onChange={(e) => handleOrgChange(e.target.value)}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900 transition-all duration-300 hover:border-gray-300"
                            required
                          >
                            <option value="">Select Organization</option>
                            {organizations.map((org: any) => (
                              <option key={org._id || org.id} value={org._id || org.id}>
                                {org.organizationName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Department Select */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            Department(Optional)
                          </label>
                          <select
                            value={selectedDeptId}
                            onChange={(e) => setSelectedDeptId(e.target.value)}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900 transition-all duration-300 hover:border-gray-300"
                            disabled={!selectedOrgId}
                            required
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept: any) => (
                              <option key={dept._id || dept.id} value={dept._id || dept.id}>
                                {dept.departmentName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 1. Name Field (Added) */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-purple-600 transition-colors">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                            <User className="h-5 w-5" />
                          </div>
                          <input
                            type="text"
                            placeholder="Arjun Singh"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-gray-300"
                            required
                          />
                        </div>
                      </div>

                      {/* 2. Email Field */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-purple-600 transition-colors">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                            <Mail className="h-5 w-5" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-gray-300"
                            required
                          />
                        </div>
                      </div>

                      {/* Register Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full group overflow-hidden mt-2"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" />
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative px-6 py-3.5 flex items-center justify-center gap-2 text-white font-semibold">
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Creating account...</span>
                            </>
                          ) : (
                            <>
                              <span>Get Started Free</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* ORGANIZATION REGISTRATION FORM */}
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {/* Organization Details Section */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Organization Details</h3>

                          {/* Organization Name */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Organization Name *
                            </label>
                            <input
                              type="text"
                              placeholder="ABC University"
                              value={orgFormData.organizationName}
                              onChange={(e) => setOrgFormData({ ...orgFormData, organizationName: e.target.value })}
                              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                              required
                            />
                          </div>

                          {/* Organization Type */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Organization Type *
                            </label>
                            <select
                              value={orgFormData.organizationType}
                              onChange={(e) => setOrgFormData({ ...orgFormData, organizationType: e.target.value as any })}
                              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                              required
                            >
                              <option value="university">University</option>
                              <option value="college">College</option>
                              <option value="institute">Institute</option>
                              <option value="school">School</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          {/* Address */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Address *
                            </label>
                            <input
                              type="text"
                              placeholder="123 Main Street"
                              value={orgFormData.address}
                              onChange={(e) => setOrgFormData({ ...orgFormData, address: e.target.value })}
                              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                              required
                            />
                          </div>

                          {/* City, State, Pincode */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                placeholder="Mumbai"
                                value={orgFormData.city}
                                onChange={(e) => setOrgFormData({ ...orgFormData, city: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                State *
                              </label>
                              <input
                                type="text"
                                placeholder="Maharashtra"
                                value={orgFormData.state}
                                onChange={(e) => setOrgFormData({ ...orgFormData, state: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Pincode *
                              </label>
                              <input
                                type="text"
                                placeholder="400001"
                                value={orgFormData.pincode}
                                onChange={(e) => setOrgFormData({ ...orgFormData, pincode: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                          </div>

                          {/* Country & Website */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Country
                              </label>
                              <input
                                type="text"
                                placeholder="India"
                                value={orgFormData.country}
                                onChange={(e) => setOrgFormData({ ...orgFormData, country: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                              />
                            </div>
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Website
                              </label>
                              <input
                                type="url"
                                placeholder="https://example.com"
                                value={orgFormData.website}
                                onChange={(e) => setOrgFormData({ ...orgFormData, website: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4 pt-4">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Contact Information</h3>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Contact Email *
                              </label>
                              <input
                                type="email"
                                placeholder="contact@example.com"
                                value={orgFormData.contactEmail}
                                onChange={(e) => setOrgFormData({ ...orgFormData, contactEmail: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Contact Phone *
                              </label>
                              <input
                                type="tel"
                                placeholder="+91 9876543210"
                                value={orgFormData.contactPhone}
                                onChange={(e) => setOrgFormData({ ...orgFormData, contactPhone: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Admin Details Section */}
                        <div className="space-y-4 pt-4">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Admin Details</h3>

                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Admin Name *
                            </label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={orgFormData.registeredByName}
                              onChange={(e) => setOrgFormData({ ...orgFormData, registeredByName: e.target.value })}
                              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Admin Email *
                              </label>
                              <input
                                type="email"
                                placeholder="admin@example.com"
                                value={orgFormData.registeredByEmail}
                                onChange={(e) => setOrgFormData({ ...orgFormData, registeredByEmail: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Designation *
                              </label>
                              <input
                                type="text"
                                placeholder="Principal/Dean"
                                value={orgFormData.registeredByDesignation}
                                onChange={(e) => setOrgFormData({ ...orgFormData, registeredByDesignation: e.target.value })}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Register Button for Organization */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full group overflow-hidden mt-4"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl" />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative px-6 py-3.5 flex items-center justify-center gap-2 text-white font-semibold">
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Registering Organization...</span>
                            </>
                          ) : (
                            <>
                              <span>Register Organization</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 font-medium">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Sign Up */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button className="group relative overflow-hidden border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center">
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                  </button>

                  {/* Facebook */}
                  <button className="group relative overflow-hidden border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                  </button>

                  {/* GitHub */}
                  <button className="group relative overflow-hidden border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Sign In Link */}
                <p className="mt-8 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToLogin();
                    }}
                    className="font-semibold text-purple-600 hover:text-purple-700 transition-colors relative group"
                  >
                    Sign in
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300" />
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
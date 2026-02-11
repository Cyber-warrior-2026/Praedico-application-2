"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, User, CheckCircle, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";

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

  // 1. Updated State: Added name, removed acceptTerms
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Terms validation removed

    try {
      // 2. Sending name to API
      await authApi.register({
        email: formData.email,
        name: formData.name,
      });

      setSuccess(true);

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: "", email: "" });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
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
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
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
                  {formData.email}
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

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-5">

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
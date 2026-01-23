"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  CheckCircle,
  Clock,
  Calendar,
  Shield,
  LogOut,
  Settings,
  Bell,
  Activity,
  X,
} from "lucide-react";
import { authApi } from "@/lib/api";

export default function UserDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Security check & load user data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Request Password Reset (sends email)
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    setIsChangingPassword(true);

    try {
      await authApi.forgotPassword({ email: user?.email });
      setPasswordSuccess(
        `Password reset link sent to ${user?.email}. Check your inbox!`
      );

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 3000);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Prevent flash of content
  if (!isAuthorized || isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email?.split("@")[0] || "User"}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your account
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Account Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              {user?.isVerified ? (
                <span className="text-green-600 text-sm font-medium">
                  Active
                </span>
              ) : (
                <span className="text-orange-600 text-sm font-medium">
                  Pending
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Account Status
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {user?.isVerified ? "Verified" : "Unverified"}
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Email Address
            </h3>
            <p className="text-lg font-semibold text-gray-900 truncate">
              {user?.email}
            </p>
          </div>

          {/* Member Since Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Member Since
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Edit
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">User ID</span>
                <span className="font-mono text-sm text-gray-900">
                  {user?.id?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Verification</span>
                {user?.isVerified ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-orange-600">
                    <Clock className="h-4 w-4" />
                    Pending
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Account Type</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Standard User
                </span>
              </div>
            </div>
          </div>

          {/* Security & Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-gray-900">
                Security & Settings
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500">
                      Update your password regularly
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">
                      Manage email preferences
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Privacy Settings</p>
                    <p className="text-xs text-gray-500">
                      Control your data and privacy
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Activity Item */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Account Created</p>
                  <p className="text-sm text-gray-500">
                    Your account was successfully created and verified
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm py-4">
                No additional activity to display
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Change Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Error Alert */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              {/* Success Alert */}
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {passwordSuccess}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 text-sm mb-1">
                      Reset Password via Email
                    </h4>
                    <p className="text-sm text-blue-700">
                      We'll send a password reset link to:
                    </p>
                    <p className="text-sm font-semibold text-blue-900 mt-1">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">1.</span>
                  Click "Send Reset Link" below
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">2.</span>
                  Check your email inbox
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">3.</span>
                  Click the link in the email
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">4.</span>
                  Enter your new password
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    "Sending..."
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight, CheckCircle2, ChevronLeft, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Connecting to your Router: router.post('/forgot-password')
      await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "We couldn't find that email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 p-4">
      
      {/* BACKGROUND DECORATION (Subtle) */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* --- STATE 1: SUCCESS MESSAGE --- */}
        {isSubmitted ? (
          <div className="bg-white border border-zinc-200 shadow-xl rounded-2xl p-10 text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900">
                Check your inbox
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                We've sent a secure reset link to <br/>
                <span className="font-medium text-zinc-900">{email}</span>
              </p>
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="w-full h-11 border-zinc-200 text-zinc-600 hover:text-zinc-900"
              >
                Back to Login
              </Button>
            </div>
          </div>
        ) : (

          /* --- STATE 2: THE FORM --- */
          <div className="bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/40 rounded-2xl overflow-hidden">
            
            {/* HEADER */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="h-12 w-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-200">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">
                Reset Password
              </h1>
              <p className="text-zinc-500 text-sm">
                Enter your email and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* FORM BODY */}
            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-700 font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-lg shadow-zinc-900/10 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Link <ArrowRight className="h-4 w-4 opacity-50" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* FOOTER */}
            <div className="bg-zinc-50/50 border-t border-zinc-100 p-4 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to log in
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Copyright */}
      <div className="mt-8 text-center text-xs text-zinc-400">
        &copy; 2026 Praedico Global Research. Secure System.
      </div>

    </div>
  );
}
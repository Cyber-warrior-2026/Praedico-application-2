"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Next.js 15+ Params Handling
export default function VerifyAccountPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  
  // Unwrap the token from the URL params
  const { token } = use(params);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🚀 SENDING TOKEN & NEW PASSWORD TO BACKEND
      await axios.post("http://localhost:4000/api/users/verify", {
        token: token,
        password: password 
      });

      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. The link might be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-900 p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <Card className="w-full max-w-[420px] shadow-xl border-zinc-200 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">Account Verified!</h2>
            <p className="text-zinc-500">Your password has been set. Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-zinc-900">Welcome to Praedico</CardTitle>
              <CardDescription className="text-zinc-500">
                To activate your account, please set a secure password below.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleVerification} className="space-y-4">
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Create Password</label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Min. 8 characters" 
                      className="pr-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md font-medium">
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10 mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    "Activate Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
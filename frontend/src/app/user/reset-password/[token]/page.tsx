"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation"; // 1. Import useParams
import axios from "axios";
import { Lock, CheckCircle2, Eye, EyeOff, KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/shared-components/ui/button";
import { Input } from "@/shared-components/ui/input";
import { Label } from "@/shared-components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/shared-components/ui/card";
import { Alert, AlertDescription } from "@/shared-components/ui/alert";

export default function ResetPasswordPage() {
  const router = useRouter();
  
  // 2. THE FIX: Use the hook instead of props
  // This works automatically on Next.js 13, 14, and 15
  const params = useParams<{ token: string }>();
  const token = params.token; 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
        setError("Invalid link. Token is missing.");
        return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Connect to Backend
      await axios.post("http://localhost:5001/api/users/reset-password", {
        token: token, 
        newPassword: password
      });
      
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push("/login");
      }, 2500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Link expired or invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-900 p-4">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <Card className="w-full max-w-[420px] shadow-xl border-zinc-200 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        
        {success ? (
         <div className="p-8 text-center space-y-6">
           <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
             <CheckCircle2 className="h-8 w-8" />
           </div>
           <div className="space-y-2">
             <h2 className="text-xl font-bold tracking-tight text-zinc-900">Password Updated</h2>
             <p className="text-zinc-500 text-sm">
               Your password has been reset successfully.<br/> Redirecting to login...
             </p>
           </div>
         </div>
        ) : (
          <>
            <CardHeader className="space-y-1 text-center pb-2">
              <div className="mx-auto mb-4 h-12 w-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center border border-zinc-200 shadow-sm">
                <KeyRound className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">Set new password</CardTitle>
              <CardDescription className="text-zinc-500">
                Please create a strong password for your account
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Min. 6 characters" 
                      className="pl-10 pr-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input 
                      id="confirm"
                      type="password" 
                      placeholder="Re-enter password" 
                      className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="py-2 bg-red-50 border-red-200 text-red-600">
                     <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                    type="submit" 
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg mt-2" 
                    disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4 opacity-50" />}
                </Button>

              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
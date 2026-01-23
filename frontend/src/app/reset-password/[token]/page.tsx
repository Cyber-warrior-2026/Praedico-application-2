"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

// In Next.js 15+, params are a Promise, so we type it accordingly
export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  
  // Unwrap params using React.use()
  const { token } = use(params);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      // BACKEND INTEGRATION: Replace with your actual endpoint
      await axios.post("http://localhost:4000/api/users/reset-password", {
        token: token, // Sent from the URL
        newPassword: password
      });
      
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 font-sans text-slate-900">
      
      {success ? (
         <Card className="w-full max-w-md shadow-xl border-slate-200 bg-white text-center p-8">
           <div className="flex justify-center mb-4">
             <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
               <CheckCircle className="h-6 w-6 text-emerald-600" />
             </div>
           </div>
           <CardTitle className="text-xl font-bold mb-2">Password Reset!</CardTitle>
           <CardDescription>Redirecting you to login...</CardDescription>
         </Card>
      ) : (
        
        <Card className="w-full max-w-md shadow-xl border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Set New Password</CardTitle>
            <CardDescription className="text-slate-500">
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              
              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="New Password" 
                    className="pl-9 pr-10 bg-slate-50 border-slate-200 focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium" 
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
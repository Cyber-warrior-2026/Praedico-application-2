"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Loader2, AlertCircle, LogIn, Lock, Mail } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Call API
      const response: any = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // 2. CRITICAL FIX: Save Token to LocalStorage
      // (Adjust 'response.token' if your API returns it nested differently, e.g., response.data.token)
      if (response.token) {
        localStorage.setItem("accessToken", response.token);
      }

      // 3. Redirect to User Dashboard
      router.push("/user"); 
      // Note: Changed to /dashboard/admin to match the layout we built earlier. 
      // Change back to "/user" if you have a specific user route.

    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 text-zinc-900 p-4">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <Card className="w-full max-w-[400px] shadow-xl border-zinc-200 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Logo / Icon */}
          <div className="mx-auto mb-4 h-12 w-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="py-2 bg-red-50 border-red-200 text-red-600">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </div>
              </Alert>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-700 font-medium">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10 mt-2 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-center border-t border-zinc-100 pt-6 pb-6 bg-zinc-50/50 rounded-b-xl">
          <div className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className="font-medium text-zinc-900 hover:text-zinc-700 underline underline-offset-4 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>

      </Card>
    </div>
  );
}
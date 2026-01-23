"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    const response = await authApi.login({
      email: formData.email,
      password: formData.password,
    });

    // Success - redirect to user dashboard
    router.push("/user");
  } catch (err: any) {
    setError(
      err.response?.data?.message || "Login failed. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[400px] shadow-lg border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              {error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
               <Input id="email"
type="email"
  placeholder="you@example.com"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  required
/>

              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
  id="password"
  type="password"
  placeholder="••••••••"
  value={formData.password}
  onChange={(e) =>
    setFormData({ ...formData, password: e.target.value })
  }
  required
/>

              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
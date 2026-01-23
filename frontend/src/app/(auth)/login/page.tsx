"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Required for redirection
import axios from "axios";
import { Loader2, AlertCircle } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();

  // 1. STATE VARIABLES (To hold the data)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // 2. THE REAL API CALL
      const response = await axios.post("http://localhost:4000/api/users/login", {
        email,
        password,
      });

      // 3. SUCCESS: SAVE TOKEN
      const { token } = response.data;
      localStorage.setItem("accessToken", token);

      // 4. REDIRECT (To your Dashboard)
      router.push("/user"); 

    } catch (err: any) {
      console.error("Login Error:", err);
      // Show the error message from backend (or a default one)
      setError(err.response?.data?.message || "Invalid email or password.");
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
              
              {/* ERROR ALERT (Only shows if there is an error) */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200 py-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </div>
                </Alert>
              )}

              {/* EMAIL INPUT */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD INPUT */}
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
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
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
"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authApi.register({ email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 text-zinc-900 p-4">
      
      {/* Background Pattern (Subtle) */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <Card className="w-full max-w-[400px] shadow-xl border-zinc-200 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        
        {/* --- STATE 1: SUCCESS MESSAGE --- */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Check your email</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                We have sent a verification link to <br/>
                <span className="font-medium text-zinc-900">{email}</span>.
              </p>
            </div>
            <div className="pt-2">
               <Alert className="bg-emerald-50/50 border-emerald-100 text-emerald-800 text-left text-xs">
                 <AlertDescription>
                   Click the link in the email to activate your account.
                 </AlertDescription>
               </Alert>
            </div>
          </div>
        ) : (

          /* --- STATE 2: REGISTRATION FORM --- */
          <>
            <CardHeader className="space-y-1 text-center pb-2">
              <div className="mx-auto mb-4 h-12 w-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center border border-zinc-200 shadow-sm">
                <UserPlus className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                Create an account
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Enter your email below to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                
                {error && (
                  <Alert variant="destructive" className="py-2 bg-red-50 border-red-200 text-red-600">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </div>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-700 font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10 mt-2 transition-all active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending Link...
                    </span>
                  ) : (
                    "Sign Up with Email"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-zinc-100 pt-6 pb-6 bg-zinc-50/50 rounded-b-xl">
              <div className="text-sm text-zinc-500">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="font-medium text-zinc-900 hover:text-zinc-700 underline underline-offset-4 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
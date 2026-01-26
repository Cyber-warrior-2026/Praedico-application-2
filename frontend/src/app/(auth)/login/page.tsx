"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Facebook, Github, Chrome } from "lucide-react"; 
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  
  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // API Call
      const response: any = await authApi.login({
        email: email,
        password: password,
      });

      // Token Handling
      if (response.token) {
        localStorage.setItem("accessToken", response.token);
      }

      // Redirect on Success
      router.push("/user");

    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#004e92] overflow-hidden flex items-center justify-center font-sans selection:bg-cyan-300 selection:text-blue-900">
      
      {/* =========================================
          BACKGROUND: 3D ABSTRACT SHAPES
      ========================================= */}
      
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0052D4] via-[#4364F7] to-[#6FB1FC] opacity-80" />
        
        {/* SHAPE 1: Top Center Ring (Torus) */}
        <div className="absolute top-[5%] left-[40%] w-40 h-40 animate-float-slow opacity-80">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="100%" stopColor="#0072ff" />
              </linearGradient>
            </defs>
            <path d="M50 20 A 30 30 0 1 1 50 80 A 30 30 0 1 1 50 20 M50 35 A 15 15 0 1 0 50 65 A 15 15 0 1 0 50 35" fill="url(#grad1)" />
          </svg>
        </div>

        {/* SHAPE 2: Left Spiral */}
        <div className="absolute bottom-[10%] left-[5%] w-80 h-80 animate-float-medium opacity-60">
           <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
             <defs>
               <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#4facfe" />
                 <stop offset="100%" stopColor="#00f2fe" />
               </linearGradient>
             </defs>
             <path 
               d="M100,100 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0" 
               fill="none" 
               stroke="url(#grad2)" 
               strokeWidth="25" 
               strokeLinecap="round"
               strokeDasharray="300 200"
               className="opacity-80"
             />
           </svg>
        </div>

        {/* SHAPE 3: Right Squiggles */}
        <div className="absolute top-[20%] right-[10%] w-64 h-64 animate-float-fast opacity-70">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
             <defs>
               <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#89f7fe" />
                 <stop offset="100%" stopColor="#66a6ff" />
               </linearGradient>
             </defs>
             <path d="M10 50 Q 25 20 50 50 T 90 50" fill="none" stroke="url(#grad3)" strokeWidth="12" strokeLinecap="round" />
             <path d="M20 70 Q 35 40 60 70 T 100 70" fill="none" stroke="url(#grad3)" strokeWidth="12" strokeLinecap="round" className="opacity-60" />
          </svg>
        </div>

        {/* SHAPE 4: Bottom Right Blob */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 animate-float-slow">
           <svg viewBox="0 0 200 200" className="w-full h-full blur-sm">
             <path d="M40.3,-65.7C52.7,-60.6,63.4,-51.7,71.1,-40.8C78.8,-29.9,83.5,-17,81.4,-5.1C79.3,6.8,70.4,17.7,61.9,27.9C53.4,38.1,45.3,47.6,35.7,55.9C26.1,64.2,15,71.3,3.3,65.6C-8.4,59.9,-20.7,41.4,-33.6,28.7C-46.5,16,-60,9.1,-63.9,-0.6C-67.8,-10.3,-62.1,-22.8,-53.4,-33.5C-44.7,-44.2,-33,-53.1,-21.2,-58.5C-9.4,-63.9,2.5,-65.8,14.6,-66.9L27.9,-68.2" transform="translate(100 100)" fill="url(#grad1)" opacity="0.6" />
           </svg>
        </div>

        {/* SHAPE 5: Floating "N" or Cube pieces */}
        <div className="absolute top-[30%] left-[15%] w-24 h-24 animate-float-fast opacity-90">
           <div className="w-full h-full bg-gradient-to-tr from-cyan-300 to-blue-500 rounded-[20px] shadow-lg transform rotate-45 border-4 border-white/20 backdrop-blur-md"></div>
        </div>
      </div>

      {/* =========================================
          GLASS CARD (THE LOGIN FORM)
      ========================================= */}
      <div className="relative z-10 w-full max-w-[420px] p-1">
        
        <div className="backdrop-blur-[20px] bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[30px] p-8 md:p-12 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-white text-lg font-semibold mb-6 tracking-wide opacity-90">Welcome back</h2>
              <h1 className="text-3xl font-bold text-white mb-1">Login</h1>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/80 ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="username@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all shadow-inner"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/80 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all shadow-inner pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-start">
                <Link href="/forgot-password" className="text-xs text-white/80 hover:text-white hover:underline transition-all">
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0B213E] hover:bg-[#0f2d55] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-black/20 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* Social Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-white/70">
                <span className="bg-transparent px-2 shadow-sm rounded backdrop-blur-sm">or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-4">
              <SocialButton icon={Chrome} color="text-red-500" />
              <SocialButton icon={Github} color="text-black" />
              <SocialButton icon={Facebook} color="text-blue-600" />
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] text-white/70 mt-8">
              Don't have an account yet? <Link href="/register" className="font-bold text-white hover:underline">Register for free</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------
// HELPER COMPONENT
// ------------------------------------

function SocialButton({ icon: Icon, color }: { icon: any, color: string }) {
  return (
    <button 
      type="button"
      className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
    >
      <Icon size={20} className={color} />
    </button>
  );
}
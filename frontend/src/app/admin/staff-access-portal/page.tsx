"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Eye, EyeOff, ShieldCheck, Github, Linkedin, Facebook, Chrome } from "lucide-react"; 
import axios, { AxiosError } from "axios"; 

export default function HiddenAdminLogin() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Send Login Request (Cookie will be set by backend automatically)
      const response = await axios.post("http://localhost:4000/api/users/login", {
        email,
        password
      }, {
        withCredentials: true
      });

      const { user } = response.data;

      // 2. Role Check (Frontend Guard)
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        alert("Access Denied: You are not an Admin.");
        setIsLoading(false);
        return;
      }
      
      // 3. Redirect (No need to save token manually)
      router.push("/admin/dashboard");

    } catch (err) { 
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Invalid Credentials");
      setIsLoading(false);
    }
  };

  return (
    // ... (The rest of your UI remains exactly the same)
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050511] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
      
      {/* 2. THE GLASS CARD CONTAINER */}
      <div className="relative w-full max-w-[420px] mx-4">
        
        {/* Neon Top Border Gradient */}
        <div className="absolute -top-[2px] left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-t-2xl z-10" />

        <div className="backdrop-blur-2xl bg-[#0a0a16]/80 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
          
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Get Started Now</h1>
            <p className="text-slate-400 text-sm">Enter your credentials to login your account</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            
            {/* EMAIL INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-[#13132b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#13132b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* OPTIONS ROW */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-4 w-4 rounded border border-slate-600 bg-[#13132b] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                  {/* Custom Checkmark (Simulated) */}
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember Me</span>
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">Forgot Password?</a>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                  Authenticating...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center">
              <span className="text-slate-500 text-xs">Don't have an account yet? </span>
              <a href="#" className="text-blue-500 hover:text-blue-400 text-xs font-medium transition-colors">Sign up here</a>
            </div>

            {/* SOCIAL LOGIN DIVIDER */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a16] px-2 text-slate-500 font-medium tracking-wider">Or sign in with</span>
              </div>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="flex justify-center gap-4">
              <SocialButton icon={Chrome} color="bg-red-500" />
              <SocialButton icon={Facebook} color="bg-blue-600" />
              <SocialButton icon={Linkedin} color="bg-blue-500" />
              <SocialButton icon={Github} color="bg-slate-800" />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// Helper for Social Buttons
function SocialButton({ icon: Icon, color }: { icon: any, color: string }) {
  return (
    <button className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg hover:-translate-y-1 transition-all duration-300 ${color}`}>
      <Icon size={18} fill="white" className="stroke-none" /> {/* Using fill for solid logos */}
    </button>
  );
}
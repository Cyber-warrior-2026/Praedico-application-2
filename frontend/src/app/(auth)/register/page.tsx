"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { Loader2, Facebook, Github, Chrome, CheckCircle2, User, Mail } from "lucide-react"; // Removed Eye, EyeOff since password is gone
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  // REMOVED: const [password, setPassword] = useState(""); 
  // REMOVED: const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Register with Name and Email ONLY
      await authApi.register({ name, email }); 
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
    <div className="relative min-h-screen w-full bg-[#FFDAB9] flex items-center justify-center font-sans overflow-hidden">
      
      {/* =========================================
          BACKGROUND: FLOATING LEAVES & PETALS
      ========================================= */}
      
      <style jsx global>{`
        @keyframes float-leaf {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, 20px) rotate(10deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-leaf { animation: float-leaf 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
      `}</style>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC3A0] to-[#FFAFBD] opacity-80" />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-10 left-10 w-8 h-8 bg-[#C1D855] rounded-full opacity-60 animate-leaf" style={{ animationDelay: '0s' }} />
         <div className="absolute top-20 left-40 w-4 h-6 bg-[#FF6B6B] rounded-full opacity-50 animate-leaf" style={{ animationDelay: '1s' }} />
         <div className="absolute bottom-20 right-20 w-6 h-6 bg-[#C1D855] rounded-full opacity-60 animate-leaf" style={{ animationDelay: '2s' }} />
         <div className="absolute bottom-40 right-10 w-5 h-8 bg-[#FFD700] rounded-full opacity-50 animate-leaf" style={{ animationDelay: '3s' }} />
         <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#FF6B6B] rounded-full opacity-40 animate-leaf" style={{ animationDelay: '4s' }} />
      </div>

      {/* =========================================
          MAIN CONTAINER CARD
      ========================================= */}
      <div className="relative z-10 w-full max-w-5xl h-auto md:h-[650px] bg-white/30 backdrop-blur-xl border border-white/40 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex overflow-hidden p-4 md:p-6">
        
        {/* LEFT SIDE: FORM */}
        <div className="w-full md:w-[450px] bg-white/40 rounded-[30px] p-8 flex flex-col justify-center relative shadow-inner">
          
          {isSuccess ? (
             <div className="text-center space-y-6 animate-in fade-in zoom-in">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-sm">
                 <CheckCircle2 size={40} />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-[#4A3B32]">Account Created!</h2>
                 <p className="text-[#8B7E74] text-sm mt-2">Welcome aboard, {name}.<br/>Please check your email to verify.</p>
               </div>
               <Link href="/login" className="block text-[#E95C26] font-bold hover:underline text-sm">Proceed to Login</Link>
             </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-[#8B7E74] mb-1">Start your journey</p>
                <h1 className="text-4xl font-extrabold text-[#2D241E] tracking-tight">Create Account</h1>
              </div>

              {error && <p className="text-red-500 text-xs mb-4 text-center bg-red-100 py-2 rounded-lg">{error}</p>}

              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#5C4D44] ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Priyank Gupta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#4A3B32] placeholder:text-[#B0A69D] focus:outline-none focus:ring-2 focus:ring-[#E95C26]/50 transition-all shadow-sm border border-transparent focus:border-[#E95C26]/30 pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A69D]" />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#5C4D44] ml-1">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="arjun123@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#4A3B32] placeholder:text-[#B0A69D] focus:outline-none focus:ring-2 focus:ring-[#E95C26]/50 transition-all shadow-sm border border-transparent focus:border-[#E95C26]/30 pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A69D]" />
                  </div>
                </div>

                {/* REMOVED PASSWORD INPUT BLOCK HERE */}

                {/* Sign Up Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#E95C26] hover:bg-[#D14918] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#E95C26]/30 active:scale-[0.98] transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                </button>

              </form>

              {/* Social Divider */}
              <div className="mt-6 text-center">
                <p className="text-xs font-medium text-[#8B7E74] mb-4">Or Sign Up With</p>
                <div className="flex justify-center gap-3">
                  <SocialButton icon={Chrome} color="text-[#EA4335]" />
                  <SocialButton icon={Github} color="text-[#333]" />
                  <SocialButton icon={Facebook} color="text-[#1877F2]" />
                </div>
              </div>

              {/* Switch to Login */}
              <p className="text-center text-xs text-[#8B7E74] mt-6">
                Already have an account? <Link href="/login" className="font-bold text-[#E95C26] hover:underline">Log In</Link>
              </p>
            </>
          )}
        </div>

        {/* RIGHT SIDE: ILLUSTRATION AREA */}
        <div className="hidden md:flex flex-1 items-center justify-center relative">
           <div className="relative w-full h-full flex items-center justify-center">
              
              {/* IMAGE: Monk Bird */}
              <div className="relative w-[500px] h-[500px] animate-float-slow z-10"> 
                 <Image 
                   src="/bird-monk.png" 
                   alt="3D Bird" 
                   fill 
                   className="object-contain drop-shadow-2xl" 
                   priority 
                 />
              </div>
              
              {/* Floating particles behind the bird */}
              <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-[#90EE90] rounded-full blur-sm animate-bounce duration-[3000ms]"></div>
              <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-[#FFD700] rounded-full blur-sm animate-bounce duration-[4000ms]"></div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Social Buttons
function SocialButton({ icon: Icon, color }: { icon: any, color: string }) {
  return (
    <button 
      type="button"
      className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#E95C26]/20"
    >
      <Icon size={20} className={color} />
    </button>
  );
}
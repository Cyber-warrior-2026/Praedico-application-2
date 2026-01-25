"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import axios, { AxiosError } from "axios"; 

export default function HiddenAdminLogin() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/admin/login", {
        email,
        password
      },
      {
        headers: {

          "x-praedico-security": "u8a9s8d7f6g5h4j3k2l1",
          "Content-Type": "application/json"
        }
      }
    );

      // FIX 3: Your backend only returns 'token'. 
      // We don't need to check 'user.role' here because the Backend ALREADY checked it.
      // If the backend sent a 200 OK, it means they ARE an admin.
      const { token } = response.data;

      // 4. Success! Redirect to the Hidden Dashboard
      localStorage.setItem("accessToken", token); 
      
      router.push("/admin");

    } catch (err) { 
      const error = err as AxiosError<{ message: string }>;
      console.error(error);
      
      alert(error.response?.data?.message || "Access Denied: Invalid Credentials");
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <Card className="w-[400px] shadow-2xl border-red-900 bg-slate-900 text-slate-100">
        <CardHeader className="space-y-1 items-center">
          <ShieldAlert className="h-12 w-12 text-red-600 mb-2" />
          <CardTitle className="text-2xl font-bold text-center text-white">Restricted Access</CardTitle>
          <CardDescription className="text-center text-red-400">
            Authorized Personnel Only. <br/> All attempts are logged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="admin@praedico.com" 
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-red-600" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Secure Key</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="bg-slate-800 border-slate-700 text-white focus-visible:ring-red-600"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full bg-red-700 hover:bg-red-800 text-white font-bold" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Access Mainframe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
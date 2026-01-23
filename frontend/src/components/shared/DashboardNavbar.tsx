"use client";

import { useEffect, useState } from "react"; // 1. Import Hooks
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardNavbar() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("Loading..."); // 2. State for Email

  // 3. FETCH REAL EMAIL FROM TOKEN
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        // Decode the JWT Payload (Standard method without external libraries)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Set the email if it exists in the token
        if (payload.email) {
          setAdminEmail(payload.email);
        } else {
          setAdminEmail("admin@praedico.com"); // Fallback
        }
      } catch (e) {
        console.error("Failed to decode token", e);
        setAdminEmail("Unknown User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-slate-200 bg-white px-6 shadow-sm">
      
      {/* 1. BRANDING (Left) */}
      <div className="flex items-center gap-3 mr-8">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-md">
            <Image 
              src="/praedico.jpg" 
              alt="Praedico Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <span className="hidden md:block text-lg font-bold tracking-tight text-slate-900">
            Praedico Global Research
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <Link href="/dashboard/admin" className="text-slate-900 hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <Link href="/dashboard/admin/users" className="hover:text-blue-600 transition-colors">
          Users
        </Link>
        <Link href="/dashboard/admin/complaints" className="hover:text-blue-600 transition-colors">
          Complaints
        </Link>
        <Link href="/dashboard/admin/settings" className="hover:text-blue-600 transition-colors">
          Settings
        </Link>
      </nav>

      {/* 3. RIGHT SIDE ACTIONS */}
      <div className="ml-auto flex items-center space-x-4">
        
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          
          {/* REMOVED: The "Admin User / Root Access" text block is gone. */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-slate-100 hover:ring-slate-200 transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/admin-face.png" alt="Admin" />
                  <AvatarFallback className="bg-blue-600 text-white font-bold">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Administrator</p>
                  {/* REAL EMAIL DISPLAYED HERE */}
                  <p className="text-xs leading-none text-slate-500">{adminEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
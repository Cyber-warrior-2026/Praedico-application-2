"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LogOut, User, Settings, Bell, Menu, Search, Building2, Command
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared-components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared-components/ui/avatar";
import { Button } from "@/shared-components/ui/button";
import { organizationApi } from "@/lib/api";

export default function OrganizationNavbar() {
    const router = useRouter();

    const [orgName, setOrgName] = useState("Organization");
    const [adminEmail, setAdminEmail] = useState("Loading...");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await organizationApi.getMe();
                if (data.success && data.organization) {
                    setOrgName(data.organization.organizationName || "Organization");
                    setAdminEmail(data.organization.contactEmail || "admin@org.com");
                }
            } catch (e) {
                setOrgName("Organization");
            }
        };

        fetchProfile();

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await organizationApi.logout();
        } catch (e) {
            console.error(e);
        } finally {
            router.push("/");
        }
    };

    return (
        <header
            className={`sticky top-0 z-40 flex h-20 w-full items-center justify-between px-6 transition-all duration-500 ease-in-out border-b ${scrolled
                ? "bg-[#0f172a]/90 backdrop-blur-xl border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                : "bg-[#030712] border-transparent shadow-none"
                }`}
        >

            {/* =======================
          LEFT: BRAND & SEARCH
         ======================= */}
            <div className="flex items-center gap-8">

                {/* Mobile Toggle */}
                <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                </Button>

                {/* GLOWING SEARCH BAR */}
                <div className="hidden md:flex group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30 group-hover:opacity-70 blur transition duration-500"></div>
                    <div className="relative flex items-center bg-[#1e293b] rounded-full px-4 py-2 w-80 ring-1 ring-slate-700/50 group-hover:ring-blue-500/50 transition-all">
                        <Search className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors mr-3" />
                        <input
                            type="text"
                            placeholder="Search students, departments..."
                            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
                        />
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
                            <Command className="h-3 w-3" /> K
                        </div>
                    </div>
                </div>
            </div>

            {/* =======================
          RIGHT: ACTIONS & PROFILE
         ======================= */}
            <div className="flex items-center gap-5">

                {/* Notification Bell */}
                <button className="relative flex items-center justify-center h-10 w-10 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300 border border-slate-700 group">
                    <Bell className="h-5 w-5 group-hover:animate-swing" />
                    <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#0f172a] animate-pulse shadow-[0_0_10px_#ef4444]"></span>
                </button>

                <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-1"></div>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 group outline-none">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {orgName}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase group-hover:text-slate-400">
                                    Organization Admin
                                </p>
                            </div>

                            {/* Avatar with Gradient Ring */}
                            <div className="relative h-11 w-11 p-[2px] rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 group-hover:rotate-180 transition-all duration-700">
                                <Avatar className="h-full w-full border-2 border-[#0f172a] group-hover:rotate-[-180deg] transition-all duration-700">
                                    <AvatarImage src="/avatars/org-default.png" alt="Org" />
                                    <AvatarFallback className="bg-[#0f172a] text-white font-bold">
                                        {orgName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-[3px] border-[#0f172a] rounded-full"></div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64 bg-[#1e293b]/95 backdrop-blur-xl border-slate-700 text-slate-200 mt-2 mr-2 shadow-2xl shadow-black/50 rounded-2xl p-2" align="end" forceMount>

                        <div className="px-2 py-3 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl mb-2 border border-blue-500/10">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Signed in as</p>
                            <p className="text-sm font-medium text-white truncate">{adminEmail}</p>
                        </div>

                        <DropdownMenuGroup className="space-y-1">
                            <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-blue-600 focus:text-white transition-colors py-2.5">
                                <Building2 className="mr-3 h-4 w-4" />
                                <span className="font-medium">Organization Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-blue-600 focus:text-white transition-colors py-2.5">
                                <Settings className="mr-3 h-4 w-4" />
                                <span className="font-medium">Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-slate-700/50 my-2" />

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-400 focus:text-white focus:bg-red-500 cursor-pointer rounded-lg py-2.5 transition-all hover:pl-4"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span className="font-medium">Log out</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck,
  BarChart3,
  Wallet,
  FileText,
  Mail,
  HelpCircle,
  Zap,
  LayoutTemplate,
  ShoppingBag,
  Table,
  KeyRound,
  UserCircle2,
  Briefcase,
  Layers,
  Palette,
  ListChecks,
  ChevronDown,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios';

interface SidebarProps {
  role: "admin" | "user";
  isOpen: boolean;
  onToggle: () => void;
}

type MenuItem = {
  href?: string;
  label: string;
  icon: any;
  badge?: number;
  subItems?: { href: string; label: string }[];
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

export function Sidebar({ role, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("Loading...");
  const [expandedItems, setExpandedItems] = useState<string[]>([]); 

  const toggleSubmenu = (label: string) => {
    setExpandedItems((prev) => 
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      title: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { 
          label: "eCommerce", 
          icon: ShoppingBag,
          subItems: [
            { href: "/admin/ecommerce/products", label: "Products" },
            { href: "/admin/ecommerce/orders", label: "Orders" },
            { href: "/admin/ecommerce/customers", label: "Customers" },
          ]
        },
      ]
    },
    {
      title: "Workspace",
      items: [
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/reports", label: "System Reports", icon: FileText },
        { href: "/admin/inbox", label: "Inbox", icon: Mail, badge: 3 },
      ]
    },
    {
      title: "UI Elements",
      items: [
        { 
          label: "Components", 
          icon: Layers,
          subItems: [
            { href: "/admin/ui/alerts", label: "Alerts" },
            { href: "/admin/ui/buttons", label: "Buttons" },
            { href: "/admin/ui/cards", label: "Cards" },
          ]
        },
        { 
          label: "Icons", 
          icon: Palette,
          subItems: [
            { href: "/admin/ui/icons/lucide", label: "Lucide" },
            { href: "/admin/ui/icons/feather", label: "Feather" },
          ]
        },
      ]
    },
    {
      title: "Forms & Tables",
      items: [
        { 
          label: "Forms", 
          icon: ListChecks,
          subItems: [
            { href: "/admin/forms/layouts", label: "Form Layouts" },
            { href: "/admin/forms/validation", label: "Form Validation" },
          ]
        },
        { 
          label: "Tables", 
          icon: Table,
          subItems: [
            { href: "/admin/tables/basic", label: "Basic Tables" },
            { href: "/admin/tables/data", label: "Data Tables" },
          ]
        },
      ]
    },
    {
      title: "Pages",
      items: [
        { 
          label: "Authentication", 
          icon: KeyRound,
          subItems: [
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
            { href: "/forgot-password", label: "Forgot Password" },
          ]
        },
        { href: "/admin/profile", label: "User Profile", icon: UserCircle2 },
        { 
          label: "Utility Pages", 
          icon: Briefcase,
          subItems: [
            { href: "/admin/pages/pricing", label: "Pricing" },
            { href: "/admin/pages/timeline", label: "Timeline" },
            { href: "/admin/pages/invoice", label: "Invoice" },
          ]
        },
      ]
    },
    {
      title: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/admin/help", label: "Help Center", icon: HelpCircle },
      ]
    }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch from API (Cookie is sent automatically)
        const { data } = await axios.get("http://localhost:4000/api/users/me", {
          withCredentials: true
        });

        if (data.success && data.user) {
          setAdminName(data.user.name || "Admin");
          setAdminEmail(data.user.email || "admin@praedico.com");
        }
      } catch (error) {
        console.error("Failed to load sidebar profile");
        setAdminEmail("Guest");
      }
    };

    fetchProfile();
  }, []);

  return (
    <aside className={`h-full flex flex-col bg-[#0f172a] text-slate-300 overflow-hidden`}>
      
      {/* 1. HEADER LOGO - UPDATED */}
      <div className={`h-20 flex items-center shrink-0 transition-all ${isOpen ? 'justify-between px-6' : 'justify-center px-2'}`}>
        
        {/* Logo Container - Click to Open when collapsed */}
        <div 
          onClick={() => !isOpen && onToggle()} 
          className={`flex items-center gap-3 ${!isOpen && 'cursor-pointer hover:opacity-80 transition-opacity'}`}
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 ring-1 ring-white/10 flex-shrink-0">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          
          {/* Title - Only visible when Open */}
          {isOpen && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="font-bold text-lg text-white tracking-tight block leading-none">
                Praedico
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                Admin Portal
              </span>
            </div>
          )}
        </div>

        {/* Toggle Button - Only visible when Open */}
        {isOpen && (
          <button 
            onClick={onToggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE NAVIGATION */}
      <nav className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto custom-scrollbar">
        
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {isOpen && (
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                const isActive = link.href ? pathname === link.href : false;
                const isExpanded = expandedItems.includes(link.label);
                const hasSubItems = link.subItems && link.subItems.length > 0;
                
                return (
                  <div key={link.label}>
                    {hasSubItems ? (
                      // Expandable Menu Item
                      <button
                        onClick={() => isOpen && toggleSubmenu(link.label)}
                        className={`w-full group relative flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isExpanded
                            ? "bg-slate-800/50 text-white"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isExpanded ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                          {isOpen && link.label}
                        </div>
                        {isOpen && (
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    ) : (
                      // Standard Link Item
                      <Link
                        href={link.href!}
                        className={`group relative flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/30"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                          {isOpen && link.label}
                        </div>
                        
                        {isOpen && link.badge && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {link.badge}
                          </span>
                        )}

                        {!isOpen && link.badge && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white/20" />}
                      </Link>
                    )}

                    {/* Submenu Items - Only show when sidebar is open */}
                    {hasSubItems && isExpanded && isOpen && (
                      <div className="pl-10 pr-2 py-2 space-y-1">
                        {link.subItems!.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isSubActive
                                  ? "text-white bg-slate-800"
                                  : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 3. PROMO CARD - Only show when open */}
        {isOpen && (
          <div className="mt-6 mx-2">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-5 shadow-xl relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={80} />
              </div>
              
              <div className="relative z-10">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                  <Zap className="text-white h-4 w-4 fill-white" />
                </div>
                <h4 className="text-white font-bold text-sm">Upgrade Plan</h4>
                <p className="text-indigo-100 text-xs mt-1 mb-3 leading-relaxed">
                  Unlock advanced analytics and reporting features.
                </p>
                <button className="text-[10px] font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all">
                  View Plans
                </button>
              </div>
            </div>
          </div>
        )}

      </nav>

      {/* 4. FOOTER PROFILE SECTION */}
      <div className="p-4 border-t border-slate-800 shrink-0 bg-[#0b1120]/50">
        <div className={`flex items-center gap-3 mb-4 px-2 ${!isOpen && 'justify-center'}`}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] flex-shrink-0">
            <div className="h-full w-full rounded-full bg-[#0f172a] flex items-center justify-center">
              {/* Ensure charAt works even if name is loading */}
              <span className="font-bold text-white text-xs">{(adminName || "A").charAt(0)}</span>
            </div>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{adminName}</p>
              <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
            </div>
          )}
        </div>

        <button 
          onClick={async () => { 
             try {
               await axios.post("http://localhost:4000/api/users/logout", {}, { withCredentials: true });
               window.location.href = "/login"; 
             } catch(e) { console.error(e); }
          }}
          className={`flex w-full items-center ${isOpen ? 'justify-center' : 'justify-center'} gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/10`}
        >
          <LogOut className="h-4 w-4" />
          {isOpen && "Sign Out"}
        </button>
      </div>

    </aside>
  );
}

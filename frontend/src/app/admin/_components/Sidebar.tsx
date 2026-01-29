"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  ShoppingBag,
  Table,
  KeyRound,
  UserCircle2,
  Briefcase,
  Layers,
  Palette,
  ListChecks,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Mail,
  FileText,
  HelpCircle,
} from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils"; // Ensure this utility exists

interface SidebarProps {
  role: "admin" | "user";
  isOpen: boolean;
  onToggle: () => void;
  onUserManagementClick?: () => void;
}

type MenuItem = {
  href?: string;
  label: string;
  icon: any;
  badge?: number;
  onClick?: () => void;
  subItems?: { href: string; label: string }[];
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

export function Sidebar({
  role,
  isOpen,
  onToggle,
  onUserManagementClick,
}: SidebarProps) {
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("Loading...");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false); // Hydration fix

  // Hydration fix: ensure component renders fully on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSubmenu = (label: string) => {
    if (!isOpen) {
        onToggle(); // Auto-open sidebar if trying to expand a menu while collapsed
        setTimeout(() => {
             setExpandedItems((prev) =>
                prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
            );
        }, 150);
        return;
    }
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
          ],
        },
      ],
    },
    {
      title: "Workspace",
      items: [
        {
          label: "User Management",
          icon: Users,
          onClick: onUserManagementClick,
        },
        { href: "/admin/reports", label: "System Reports", icon: FileText },
        { href: "/admin/inbox", label: "Inbox", icon: Mail, badge: 3 },
      ],
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
          ],
        },
        {
          label: "Icons",
          icon: Palette,
          subItems: [
            { href: "/admin/ui/icons/lucide", label: "Lucide" },
            { href: "/admin/ui/icons/feather", label: "Feather" },
          ],
        },
      ],
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
          ],
        },
        { href: "/admin/profile", label: "User Profile", icon: UserCircle2 },
      ],
    },
    {
      title: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/admin/help", label: "Help Center", icon: HelpCircle },
      ],
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/me", {
          withCredentials: true,
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

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-[#0f172a] text-slate-300 border-r border-slate-800/50 shadow-2xl transition-all duration-300 ease-in-out z-50",
        isOpen ? "w-72" : "w-20"
      )}
    >
      {/* 1. HEADER LOGO */}
      <div className="h-20 flex items-center justify-between px-5 shrink-0 border-b border-slate-800/50">
        <div
          onClick={() => !isOpen && onToggle()}
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all",
            !isOpen && "cursor-pointer hover:scale-105 active:scale-95"
          )}
        >
          <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 ring-1 ring-white/10">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>

          <div
            className={cn(
              "flex flex-col transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
            )}
          >
            <span className="font-bold text-lg text-white tracking-tight leading-none">
              Praedico
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Toggle Button */}
        {isOpen && (
          <button
            onClick={onToggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE NAVIGATION */}
      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {isOpen ? (
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 animate-in fade-in duration-500">
                {group.title}
              </p>
            ) : (
               <div className="h-4" /> // Spacer for collapsed mode
            )}
            
            <div className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                const isActive = link.href ? pathname === link.href : false;
                const isExpanded = expandedItems.includes(link.label);
                const hasSubItems = link.subItems && link.subItems.length > 0;

                return (
                  <div key={link.label} className="relative group/item">
                    {/* Main Item Button */}
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleSubmenu(link.label)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                          isExpanded
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                          !isOpen && "justify-center"
                        )}
                        title={!isOpen ? link.label : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-colors",
                            isExpanded ? "text-blue-400" : "text-slate-500 group-hover/item:text-white"
                          )}
                        />
                        {isOpen && (
                          <>
                            <span className="flex-1 text-left">{link.label}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isExpanded ? "rotate-180" : ""
                              )}
                            />
                          </>
                        )}
                      </button>
                    ) : (
                      // Standard Link or Action
                      <Wrapper
                        href={link.href}
                        onClick={link.onClick}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                          isActive
                            ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-md shadow-blue-900/20"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                           !isOpen && "justify-center"
                        )}
                        title={!isOpen ? link.label : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-colors",
                            isActive ? "text-white" : "text-slate-500 group-hover/item:text-white"
                          )}
                        />
                        {isOpen && <span className="flex-1 text-left">{link.label}</span>}

                        {/* Badge Logic */}
                        {link.badge && (
                            <span
                              className={cn(
                                "bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm",
                                isOpen ? "px-2 py-0.5" : "absolute top-0 right-0 h-2 w-2 p-0"
                              )}
                            >
                              {isOpen ? link.badge : ""}
                            </span>
                        )}
                        
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white/20" />}
                      </Wrapper>
                    )}

                    {/* Submenu Items */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        hasSubItems && isExpanded && isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="pl-4 pr-2 space-y-1 border-l-2 border-slate-800 ml-5">
                        {link.subItems?.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "block px-4 py-2 rounded-lg text-sm transition-all duration-200",
                                isSubActive
                                  ? "text-blue-400 font-medium bg-blue-400/10"
                                  : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                              )}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* PROMO CARD */}
        {isOpen && (
          <div className="mt-6 mx-2 animate-in slide-in-from-bottom-5 duration-500 delay-100">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-5 shadow-xl relative overflow-hidden group cursor-pointer border border-white/10">
              <div className="absolute -top-6 -right-6 p-4 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm shadow-inner">
                  <Zap className="text-white h-4 w-4 fill-white" />
                </div>
                <h4 className="text-white font-bold text-sm">Upgrade Plan</h4>
                <p className="text-indigo-100 text-xs mt-1 mb-3 leading-relaxed opacity-90">
                  Get advanced analytics & reports.
                </p>
                <button className="text-[10px] font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 3. FOOTER PROFILE */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0b1120]/80 backdrop-blur-sm shrink-0">
        <div className={cn("flex items-center gap-3 mb-3", !isOpen && "justify-center")}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shadow-lg shrink-0">
            <div className="h-full w-full rounded-full bg-[#0f172a] flex items-center justify-center">
              <span className="font-bold text-white text-xs">
                {(adminName || "A").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className={cn("flex-1 min-w-0 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 w-0 hidden")}>
            <p className="text-sm font-bold text-white truncate">{adminName}</p>
            <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              await axios.post("http://localhost:4000/api/users/logout", {}, { withCredentials: true });
              window.location.href = "/";
            } catch (e) {
              console.error(e);
            }
          }}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/10",
            !isOpen && "justify-center px-0"
          )}
          title={!isOpen ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
      
      {/* Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </aside>
  );
}

// Helper wrapper to handle Link vs Button logic cleanly
const Wrapper = ({ children, href, onClick, className, title }: any) => {
  if (href) {
    return <Link href={href} className={className} title={title}>{children}</Link>;
  }
  return <button onClick={onClick} className={className} title={title}>{children}</button>;
};
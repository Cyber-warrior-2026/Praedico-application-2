"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import DashboardNavbar from "@/app/admin/components/DashboardNavbar"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#0b1120] overflow-hidden">
      
      {/* 2. SIDEBAR CONTAINER: Dynamic Width with Transition */}
      <div 
        className={`shrink-0 h-full border-r border-slate-800 bg-[#0f172a] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <Sidebar 
          role="admin" 
          isOpen={isSidebarOpen} 
          onToggle={() => setSidebarOpen(!isSidebarOpen)} 
        />
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
           <div className="max-w-[1600px] mx-auto">
             {children}
           </div>
        </main>
      </div>

    </div>
  );
}
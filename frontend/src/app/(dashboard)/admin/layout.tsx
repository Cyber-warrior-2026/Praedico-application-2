"use client";

import { useState, ReactNode } from "react";
import { Sidebar } from "../../../components/shared/Sidebar";
import { PanelLeft, PanelLeftClose } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#0a0b14]">
      {/* Sidebar with dynamic width */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar 
          role="admin" 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar with Toggle Button */}
        <header className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center px-6 gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-300 group"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            ) : (
              <PanelLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            )}
          </button>

          {/* Your existing navbar content */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

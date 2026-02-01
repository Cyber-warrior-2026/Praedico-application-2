"use client";
import { useState } from "react";
import { Sidebar } from "../_components/Sidebar";
import DashboardNavbar from "@/app/admin/_components/DashboardNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        role="admin"
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
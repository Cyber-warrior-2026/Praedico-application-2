import { Sidebar } from "@/components/shared/Sidebar";
import DashboardNavbar from "@/components/shared/DashboardNavbar"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. MASTER CONTAINER: Dark Background, Full Screen, No Window Scrollbar
    <div className="flex h-screen w-full bg-[#0b1120] overflow-hidden">
      
      {/* 2. SIDEBAR CONTAINER: Static width, full height */}
      <div className="w-64 shrink-0 h-full border-r border-slate-800 bg-[#0f172a]">
        <Sidebar role="admin" />
      </div>

      {/* 3. MAIN CONTENT AREA: Flex Column */}
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
        
        {/* A. HEADER: Sits at the top of the content area */}
        <DashboardNavbar />

        {/* B. SCROLLABLE PAGE: The rest of the space scrolls independently */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
           <div className="max-w-[1600px] mx-auto">
             {children}
           </div>
        </main>
      </div>

    </div>
  );
}
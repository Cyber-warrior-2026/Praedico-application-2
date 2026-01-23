import DashboardNavbar from "@/components/shared/DashboardNavbar";
import Footer from "@/components/shared/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. The Top Menu (Logged In Version) */}
      <DashboardNavbar />
      
      {/* 2. The Main Content (Admin or User Dashboard) */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* 3. The Footer */}
      <Footer />
    </div>
  );
}
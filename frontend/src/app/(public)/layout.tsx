import Navbar from "@/components/shared/Navbar"; // Importing the Public Navbar we just made
import Footer from "@/components/shared/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* This adds the Top Menu with Login/Register */}
      <Navbar />
      
      {/* This renders the 'Dashboard Preview' (Landing Page) */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Shadcn Button

export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900">
              Uplink<span className="text-blue-600">.</span>
            </Link>
          </div>

          {/* Middle Links (Hidden on mobile for simplicity) */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              About
            </Link>
            <Link href="/services" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Services
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
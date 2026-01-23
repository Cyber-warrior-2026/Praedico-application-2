"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  AlertCircle, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  MoreVertical
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
const [stats, setStats] = useState({
  totalUsers: 0,
  activeUsers: 0,
  pendingVerifications: 0,
});
const [isLoading, setIsLoading] = useState(true);

// Fetch dashboard data from API
const fetchDashboardData = async () => {
  try {
    const data = await adminApi.getDashboardStats();
    setStats(data.stats);
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  } finally {
    setIsLoading(false);
  }
};

  // --- SECURITY CHECK ---
useEffect(() => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    router.push("/staff-access-portal");
    return;
  }

  setIsAuthorized(true);
  fetchDashboardData();
}, [router]);


  // Prevent flash of content
  if (!isAuthorized) return null;

  return (
    // Note: No <header> here anymore. We assume your Layout adds the Navbar.
    <div className="min-h-screen bg-zinc-50/50 text-zinc-950 font-sans p-6 md:p-8 animate-in fade-in duration-500">
      
      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* WELCOME / ACTIONS HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Overview</h2>
            <p className="text-zinc-500 mt-1">Real-time metrics and system health monitoring.</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 h-9 px-4 py-2 shadow-sm">
              Export Data
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 bg-zinc-900 text-white hover:bg-zinc-900/90 h-9 px-4 py-2 shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Total Users" 
            value="12,345" 
            desc="+180 from last month" 
            icon={Users} 
            trend="up"
          />
          <MetricCard 
            title="Active Complaints" 
            value="23" 
            desc="-5% since last week" 
            icon={AlertCircle} 
            trend="down"
            alert
          />
          <MetricCard 
            title="System Uptime" 
            value="99.99%" 
            desc="All systems operational" 
            icon={Activity} 
          />
          <MetricCard 
            title="Pending Requests" 
            value="12" 
            desc="Requires manual review" 
            icon={Clock} 
          />
        </div>

        {/* CONTENT SPLIT: ACTIVITY vs STATUS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          
          {/* MAIN CHART AREA (Span 4) */}
          <div className="col-span-4 rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm">
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="space-y-1">
                <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                <p className="text-sm text-zinc-500">Live transaction and user log feed.</p>
              </div>
              <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Activity List */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-start justify-between group">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="h-2 w-2 mt-2 rounded-full bg-zinc-200 ring-4 ring-white group-hover:bg-zinc-900 transition-colors" />
                        {i !== 3 && <div className="absolute top-4 left-1 h-full w-px bg-zinc-100 -z-10" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-zinc-800">New User Registration</p>
                        <p className="text-xs text-zinc-500">Arjun Singh joined the platform via Referral.</p>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      09:4{i} AM
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDE PANEL: SYSTEM STATUS (Span 3) */}
          <div className="col-span-3 space-y-4">
            
            {/* Server Health Card */}
            <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-6">
              <div className="flex flex-col space-y-1.5 mb-6">
                <h3 className="font-semibold leading-none tracking-tight">Server Health</h3>
                <p className="text-sm text-zinc-500">Real-time resource utilization.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-600">CPU Usage</span>
                    <span className="text-zinc-900 font-bold font-mono">45%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-full w-[45%] bg-zinc-900 rounded-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-600">Memory (RAM)</span>
                    <span className="text-zinc-900 font-bold font-mono">72%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-full w-[72%] bg-amber-500 rounded-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-600">Disk I/O</span>
                    <span className="text-zinc-900 font-bold font-mono">12%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-full w-[12%] bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="rounded-xl bg-zinc-900 text-white shadow-md p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Audit Logs</h3>
                <p className="text-zinc-400 text-sm mb-4">Download the latest security report.</p>
                <button className="text-xs font-semibold bg-white text-zinc-900 px-3 py-2 rounded hover:bg-zinc-100 transition-colors">
                  Generate PDF
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-zinc-800/50 rounded-full blur-xl" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- SHADCN ZINC STYLE CARD COMPONENT ---
function MetricCard({ title, value, desc, icon: Icon, trend, alert }: any) {
  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">{title}</h3>
        <Icon className={`h-4 w-4 ${alert ? "text-red-500" : "text-zinc-400 group-hover:text-zinc-600"}`} />
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</div>
          <p className="text-xs text-zinc-500 mt-1 font-medium">{desc}</p>
        </div>
        {trend && (
           <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
             trend === 'up' 
               ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
               : "bg-red-50 text-red-700 border border-red-100"
           }`}>
             {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1"/> : <ArrowDownRight className="h-3 w-3 mr-1"/>}
             {trend === 'up' ? "12%" : "4%"}
           </span>
        )}
      </div>
    </div>
  );
}
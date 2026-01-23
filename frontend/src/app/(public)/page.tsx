"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Lock, User, DollarSign } from "lucide-react"; 

const mockData = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 1398 },
  { name: "Wed", value: 9800 }, 
  { name: "Thu", value: 3908 },
  { name: "Fri", value: 4800 },
  { name: "Sat", value: 3800 },
  { name: "Sun", value: 4300 },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900">
      
      {/* Hero Section - Refined Typography */}
      <section className="py-20 text-center space-y-6 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          The Future of <span className="text-blue-600">Secure Systems</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Manage your operations with ultra-high security. Built for professionals, designed for scale.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button size="lg" className="h-11 px-8 text-sm font-semibold bg-slate-900 hover:bg-slate-800">Start Building</Button>
          <Button size="lg" variant="outline" className="h-11 px-8 text-sm">Documentation</Button>
        </div>
      </section>

      {/* Dashboard Preview (The Mockup) */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        {/* The "Fake Browser" Window */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
          
          {/* Fake Browser Header */}
          <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/50"></div>
            {/* Fake URL Bar */}
            <div className="ml-4 h-6 bg-white border border-slate-200 rounded-md w-64 flex items-center px-2 text-[10px] text-slate-400 font-mono">
              https://admin.praedico.com/dashboard
            </div>
          </div>
          
          {/* Mock Dashboard Content */}
          <div className="p-8 bg-slate-50/30">
            
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MockCard title="Total Revenue" value="$45,231.89" sub="+20.1% from last month" icon={DollarSign} />
              <MockCard title="Active Users" value="+2350" sub="+180.1% from last month" icon={User} />
              <MockCard title="Security Level" value="Ultra High" sub="System Optimized" icon={Lock} greenText />
            </div>

            {/* THE GRAPH SECTION */}
            <div className="h-[350px] w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="mb-6">
                 <h3 className="font-semibold text-slate-900">Traffic Overview</h3>
                 <p className="text-sm text-slate-500">Real-time mock data visualization.</p>
              </div>

              {/* Responsive Container for Recharts */}
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/> 
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis hide /> 
                  
                  <Tooltip 
                     contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", border: "none" }}
                     itemStyle={{ color: "#fff" }}
                     cursor={{ stroke: '#cbd5e1' }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// Simple Helper Component for the Cards
function MockCard({ title, value, sub, icon: Icon, greenText }: any) {
  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${greenText ? "text-emerald-600" : "text-slate-900"}`}>{value}</div>
        <p className="text-xs text-slate-500 mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}
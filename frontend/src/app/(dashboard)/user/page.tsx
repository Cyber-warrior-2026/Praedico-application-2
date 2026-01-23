import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, Arjun.</p>
      </div>

      {/* USER SPECIFIC CARDS (No System Stats) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Profile Status</CardTitle>
            <span>✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Verified</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Applications</CardTitle>
            <span>📄</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Active</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
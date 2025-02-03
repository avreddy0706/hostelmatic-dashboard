import { Card } from "@/components/ui/card";
import { Users, Building2, Wallet, TrendingUp } from "lucide-react";

const statsCards = [
  {
    title: "Total Tenants",
    value: "24",
    icon: Users,
    change: "+2 this month",
    color: "bg-blue-500",
  },
  {
    title: "Rooms Occupied",
    value: "18/20",
    icon: Building2,
    change: "90% occupancy",
    color: "bg-green-500",
  },
  {
    title: "Monthly Revenue",
    value: "$4,800",
    icon: Wallet,
    change: "+$400 vs last month",
    color: "bg-purple-500",
  },
  {
    title: "Payment Rate",
    value: "95%",
    icon: TrendingUp,
    change: "+2% vs last month",
    color: "bg-orange-500",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your hostel management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No recent activities</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Payments</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No pending payments</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
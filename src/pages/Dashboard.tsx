
import { Card } from "@/components/ui/card";
import { Users, Building2, Wallet, TrendingUp, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { format, isThisMonth, parseISO, subMonths } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { rooms, tenants, payments } = useStore();

  // Room Statistics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.occupiedBeds > 0).length;
  const totalBeds = rooms.reduce((acc, room) => acc + room.totalBeds, 0);
  const occupiedBeds = rooms.reduce((acc, room) => acc + room.occupiedBeds, 0);
  
  // Payment Statistics
  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthlyPayments = payments.filter(p => p.month.startsWith(currentMonth));
  const monthlyRevenue = monthlyPayments.reduce((acc, p) => acc + p.amount, 0);
  
  const paidPayments = monthlyPayments.filter(p => p.status === "paid");
  const paymentRate = monthlyPayments.length > 0
    ? Math.round((paidPayments.length / monthlyPayments.length) * 100)
    : 0;

  // New Tenants This Month
  const newTenantsThisMonth = tenants.filter(tenant => 
    isThisMonth(parseISO(tenant.joinDate))
  ).length;

  // Revenue Trend Data (Last 6 months)
  const getRevenueData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      const monthRevenue = payments
        .filter(p => p.month.startsWith(monthKey) && p.status === 'paid')
        .reduce((acc, p) => acc + p.amount, 0);
      
      data.push({
        month: format(date, 'MMM'),
        revenue: monthRevenue,
      });
    }
    return data;
  };

  const statsCards = [
    {
      title: "Total Tenants",
      value: tenants.length.toString(),
      icon: Users,
      change: `${newTenantsThisMonth} new this month`,
      color: "bg-blue-500",
    },
    {
      title: "Rooms Occupied",
      value: `${occupiedRooms}/${totalRooms}`,
      icon: Building2,
      change: `${totalBeds - occupiedBeds} beds available`,
      color: "bg-green-500",
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue}`,
      icon: Wallet,
      change: `${paidPayments.length} payments received`,
      color: "bg-purple-500",
    },
    {
      title: "Payment Rate",
      value: `${paymentRate}%`,
      icon: TrendingUp,
      change: `${monthlyPayments.length - paidPayments.length} pending`,
      color: "bg-orange-500",
    },
  ];

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getRevenueData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[...tenants]
              .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
              .slice(0, 5)
              .map((tenant) => {
                const room = rooms.find(r => r.id === tenant.roomId);
                return (
                  <div key={tenant.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-gray-500">
                        Joined Room {room?.roomNumber || "Not assigned"}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(tenant.joinDate), "dd MMM yyyy")}
                    </span>
                  </div>
                );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

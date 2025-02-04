
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

const Analytics = () => {
  const { rooms, tenants, payments } = useStore();

  // Calculate occupancy rate trend
  const getOccupancyTrend = () => {
    const totalBeds = rooms.reduce((acc, room) => acc + room.totalBeds, 0);
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return format(date, 'yyyy-MM');
    }).reverse();

    return last6Months.map(month => {
      const occupiedBeds = rooms.reduce((acc, room) => acc + room.occupiedBeds, 0);
      const rate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
      
      return {
        month: format(parseISO(`${month}-01`), 'MMM yyyy'),
        rate: Math.round(rate),
      };
    });
  };

  // Payment status distribution
  const getPaymentStatusDistribution = () => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const monthlyPayments = payments.filter(p => p.month.startsWith(currentMonth));
    
    const distribution = {
      paid: monthlyPayments.filter(p => p.status === 'paid').length,
      unpaid: monthlyPayments.filter(p => p.status === 'unpaid').length,
      partiallyPaid: monthlyPayments.filter(p => p.status === 'partially-paid').length,
    };

    return [
      { name: 'Paid', value: distribution.paid },
      { name: 'Unpaid', value: distribution.unpaid },
      { name: 'Partially Paid', value: distribution.partiallyPaid },
    ];
  };

  // Daily revenue for current month
  const getDailyRevenue = () => {
    const currentDate = new Date();
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dailyRevenue = payments
        .filter(p => p.paidDate && format(parseISO(p.paidDate), 'yyyy-MM-dd') === dayStr)
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        date: format(day, 'dd MMM'),
        revenue: dailyRevenue,
      };
    });
  };

  const COLORS = ['#4CAF50', '#f44336', '#FFA726'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-500">Detailed insights about your hostel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Occupancy Rate Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getOccupancyTrend()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8884d8" 
                  name="Occupancy Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPaymentStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getPaymentStatusDistribution().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Daily Revenue (Current Month)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDailyRevenue()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4CAF50" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

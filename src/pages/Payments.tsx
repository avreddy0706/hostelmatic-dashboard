import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  id: string;
  tenantName: string;
  amount: number;
  month: string;
  status: "paid" | "unpaid";
  dueDate: string;
  paidDate?: string;
}

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tenantName: "",
    amount: "",
    month: "",
    dueDate: "",
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: Payment = {
      id: Date.now().toString(),
      tenantName: newPayment.tenantName,
      amount: Number(newPayment.amount),
      month: newPayment.month,
      status: "unpaid",
      dueDate: newPayment.dueDate,
    };
    setPayments([...payments, payment]);
    setNewPayment({
      tenantName: "",
      amount: "",
      month: "",
      dueDate: "",
    });
    setShowForm(false);
    toast({
      title: "Payment Added",
      description: `Payment for ${payment.tenantName} has been added.`,
    });
  };

  const togglePaymentStatus = (paymentId: string) => {
    setPayments(payments.map(payment => {
      if (payment.id === paymentId) {
        const newStatus = payment.status === "paid" ? "unpaid" : "paid";
        return {
          ...payment,
          status: newStatus,
          paidDate: newStatus === "paid" ? new Date().toISOString() : undefined,
        };
      }
      return payment;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500">Track and manage payments here</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Select
                  value={newPayment.tenantName}
                  onValueChange={(value) => setNewPayment({ ...newPayment, tenantName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={newPayment.month}
                  onValueChange={(value) => setNewPayment({ ...newPayment, month: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date(2024, i, 1);
                      return (
                        <SelectItem key={i} value={date.toLocaleString('default', { month: 'long' })}>
                          {date.toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Payment</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{payment.tenantName}</h3>
                <Button
                  variant={payment.status === "paid" ? "outline" : "default"}
                  size="sm"
                  onClick={() => togglePaymentStatus(payment.id)}
                >
                  {payment.status === "paid" ? (
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 mr-2 text-red-500" />
                  )}
                  {payment.status}
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">${payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Month:</span>
                  <span>{payment.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date:</span>
                  <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                </div>
                {payment.paidDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paid Date:</span>
                    <span>{new Date(payment.paidDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Payments;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Check, X, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { Payment } from "@/lib/types";

const Payments = () => {
  const { toast } = useToast();
  const { tenants, payments, addPayment, updatePayment, deletePayment } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [newPayment, setNewPayment] = useState({
    tenantId: "",
    amount: "",
    month: "",
    dueDate: "",
  });

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData: Payment = {
      id: editingPayment?.id || Date.now().toString(),
      tenantId: newPayment.tenantId,
      amount: Number(newPayment.amount),
      month: newPayment.month,
      status: editingPayment?.status || "unpaid",
      dueDate: newPayment.dueDate,
      paidDate: editingPayment?.paidDate,
    };

    if (editingPayment) {
      updatePayment(paymentData);
      toast({
        title: "Payment Updated",
        description: `Payment has been updated.`,
      });
    } else {
      addPayment(paymentData);
      toast({
        title: "Payment Added",
        description: `Payment has been added.`,
      });
    }

    setNewPayment({
      tenantId: "",
      amount: "",
      month: "",
      dueDate: "",
    });
    setEditingPayment(null);
    setShowForm(false);
  };

  const togglePaymentStatus = (payment: Payment) => {
    const updatedPayment: Payment = {
      ...payment,
      status: payment.status === "paid" ? "unpaid" : "paid",
      paidDate: payment.status === "paid" ? undefined : new Date().toISOString(),
    };
    updatePayment(updatedPayment);
    toast({
      title: `Payment ${updatedPayment.status === "paid" ? "Marked as Paid" : "Marked as Unpaid"}`,
      description: `Payment status has been updated.`,
    });
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantSearch">Search Tenant</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tenantSearch"
                    placeholder="Search tenants..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantId">Select Tenant</Label>
                <Select
                  value={newPayment.tenantId}
                  onValueChange={(value) => setNewPayment({ ...newPayment, tenantId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
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
                        <SelectItem 
                          key={i} 
                          value={date.toLocaleString('default', { month: 'long' })}
                        >
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
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                  setNewPayment({
                    tenantId: "",
                    amount: "",
                    month: "",
                    dueDate: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPayment ? "Update Payment" : "Add Payment"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((payment) => {
          const tenant = tenants.find(t => t.id === payment.tenantId);
          return (
            <Card key={payment.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{tenant?.name || "Unknown Tenant"}</h3>
                    <p className="text-sm text-gray-500">{payment.month}</p>
                  </div>
                  <Button
                    variant={payment.status === "paid" ? "outline" : "default"}
                    size="sm"
                    onClick={() => togglePaymentStatus(payment)}
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
          );
        })}
      </div>
    </div>
  );
};

export default Payments;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Payment, Tenant } from "@/lib/types";

interface PaymentFormProps {
  tenants: Tenant[];
  editingPayment: Payment | null;
  onSubmit: (paymentData: Payment) => void;
  onCancel: () => void;
}

const PaymentForm = ({ tenants, editingPayment, onSubmit, onCancel }: PaymentFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPayment, setNewPayment] = useState({
    tenantId: editingPayment?.tenantId || "",
    amount: editingPayment?.amount.toString() || "",
    month: editingPayment?.month || "",
    dueDate: editingPayment?.dueDate || "",
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

    onSubmit(paymentData);
  };

  // When selecting a tenant, auto-fill their monthly fee
  const handleTenantSelect = (tenantId: string) => {
    const selectedTenant = tenants.find(t => t.id === tenantId);
    setNewPayment({
      ...newPayment,
      tenantId,
      amount: selectedTenant ? selectedTenant.monthlyFee.toString() : "",
    });
  };

  return (
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
              onValueChange={handleTenantSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tenant" />
              </SelectTrigger>
              <SelectContent>
                {filteredTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name} (${tenant.monthlyFee}/month)
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editingPayment ? "Update Payment" : "Add Payment"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaymentForm;
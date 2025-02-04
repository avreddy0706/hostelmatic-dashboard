
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Payment, Tenant } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const CreatePaymentDialog = () => {
  const { tenants, addPayment } = useStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tenantId: "",
    amount: "",
    month: format(new Date(), "yyyy-MM"),
    status: "paid" as Payment["status"],
    dueDate: format(new Date(), "yyyy-MM-dd"),
    paidDate: format(new Date(), "yyyy-MM-dd"),
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payment: Payment = {
      id: Date.now().toString(),
      tenantId: newPayment.tenantId,
      amount: Number(newPayment.amount),
      month: newPayment.month,
      status: newPayment.status,
      dueDate: newPayment.dueDate,
      paidDate: newPayment.paidDate,
      remarks: newPayment.remarks,
    };

    addPayment(payment);
    setOpen(false);
    toast({
      title: "Payment Created",
      description: "The payment has been successfully recorded.",
    });

    // Reset form
    setNewPayment({
      tenantId: "",
      amount: "",
      month: format(new Date(), "yyyy-MM"),
      status: "paid",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      paidDate: format(new Date(), "yyyy-MM-dd"),
      remarks: "",
    });
  };

  const handleTenantSelect = (tenantId: string) => {
    const selectedTenant = tenants.find((t) => t.id === tenantId);
    setNewPayment({
      ...newPayment,
      tenantId,
      amount: selectedTenant ? selectedTenant.monthlyFee.toString() : "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant</Label>
            <Select
              value={newPayment.tenantId}
              onValueChange={handleTenantSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
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
              onChange={(e) =>
                setNewPayment({ ...newPayment, amount: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={newPayment.month}
              onChange={(e) =>
                setNewPayment({ ...newPayment, month: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newPayment.status}
              onValueChange={(value: Payment["status"]) =>
                setNewPayment({ ...newPayment, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partially-paid">Partially Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={newPayment.dueDate}
              onChange={(e) =>
                setNewPayment({ ...newPayment, dueDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidDate">Paid Date</Label>
            <Input
              id="paidDate"
              type="date"
              value={newPayment.paidDate}
              onChange={(e) =>
                setNewPayment({ ...newPayment, paidDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={newPayment.remarks}
              onChange={(e) =>
                setNewPayment({ ...newPayment, remarks: e.target.value })
              }
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaymentDialog;

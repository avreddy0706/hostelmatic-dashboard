
import { useState } from "react";
import { format } from "date-fns";
import { Download, CheckSquare, XSquare, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { Payment, Tenant } from "@/lib/types";
import PaymentList from "./payments/PaymentList";
import MonthSelector from "./payments/MonthSelector";
import CreatePaymentDialog from "@/components/payments/CreatePaymentDialog";

const Payments = () => {
  const { toast } = useToast();
  const { tenants, payments, updatePayment, addPayment } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const getOrCreatePayment = (tenant: Tenant): Payment => {
    const existingPayment = payments.find(
      (p) => p.tenantId === tenant.id && p.month.startsWith(selectedMonth)
    );

    if (existingPayment) {
      return existingPayment;
    }

    // Only create payment if tenant has already joined
    const joinDate = new Date(tenant.joinDate);
    const selectedDate = new Date(selectedMonth);
    
    if (joinDate > selectedDate) {
      return {
        id: `${tenant.id}-${selectedMonth}`,
        tenantId: tenant.id,
        amount: tenant.monthlyFee,
        month: selectedMonth,
        status: "unpaid",
        dueDate: joinDate.toISOString(),
        remarks: "Not joined yet",
      };
    }

    const newPayment: Payment = {
      id: `${tenant.id}-${selectedMonth}`,
      tenantId: tenant.id,
      amount: tenant.monthlyFee,
      month: selectedMonth,
      status: "unpaid",
      dueDate: joinDate.toISOString(),
      remarks: "",
    };

    addPayment(newPayment);
    return newPayment;
  };

  const handleStatusChange = (tenant: Tenant, newStatus: Payment["status"]) => {
    const payment = getOrCreatePayment(tenant);
    
    // Don't update if tenant hasn't joined yet
    const joinDate = new Date(tenant.joinDate);
    const selectedDate = new Date(selectedMonth);
    if (joinDate > selectedDate) {
      toast({
        title: "Cannot update payment",
        description: "Tenant hasn't joined yet for the selected month.",
      });
      return;
    }

    const updatedPayment: Payment = {
      ...payment,
      status: newStatus,
      paidDate: newStatus === "paid" ? new Date().toISOString() : undefined,
    };
    updatePayment(updatedPayment);
    toast({
      title: `Payment ${newStatus === "paid" ? "Marked as Paid" : newStatus === "unpaid" ? "Marked as Unpaid" : "Marked as Partially Paid"}`,
      description: `Payment status has been updated.`,
    });
  };

  const handleRemarksChange = (tenant: Tenant, remarks: string) => {
    const payment = getOrCreatePayment(tenant);
    
    // Don't update if tenant hasn't joined yet
    const joinDate = new Date(tenant.joinDate);
    const selectedDate = new Date(selectedMonth);
    if (joinDate > selectedDate) {
      toast({
        title: "Cannot update remarks",
        description: "Tenant hasn't joined yet for the selected month.",
      });
      return;
    }

    const updatedPayment: Payment = {
      ...payment,
      remarks,
    };
    updatePayment(updatedPayment);
  };

  const exportData = () => {
    const filteredPayments = payments.filter(
      (payment) => payment.month.startsWith(selectedMonth)
    );

    const data = filteredPayments.map((payment) => {
      const tenant = tenants.find((t) => t.id === payment.tenantId);
      return {
        tenant: tenant?.name || "Unknown",
        amount: payment.amount,
        status: payment.status,
        dueDate: new Date(payment.dueDate).toLocaleDateString(),
        paidDate: payment.paidDate
          ? new Date(payment.paidDate).toLocaleDateString()
          : "-",
        remarks: payment.remarks || "-",
      };
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Tenant,Amount,Status,Due Date,Paid Date,Remarks\n" +
      data
        .map((row) =>
          Object.values(row)
            .map((item) => `"${item}"`)
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `payments-${selectedMonth}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <CheckSquare className="w-5 h-5 text-green-500" />;
      case "unpaid":
        return <XSquare className="w-5 h-5 text-red-500" />;
      case "partially-paid":
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500">Track and manage payments here</p>
        </div>
        <div className="flex gap-4">
          <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
          <CreatePaymentDialog />
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <PaymentList
        tenants={tenants}
        payments={payments}
        selectedMonth={selectedMonth}
        onStatusChange={handleStatusChange}
        onRemarksChange={handleRemarksChange}
        getStatusIcon={getStatusIcon}
      />
    </div>
  );
};

export default Payments;

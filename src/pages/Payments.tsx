
import { useState } from "react";
import { format, addMonths, startOfMonth } from "date-fns";
import { Download, CheckSquare, XSquare, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { Payment, Tenant } from "@/lib/types";

const Payments = () => {
  const { toast } = useToast();
  const { tenants, payments, updatePayment } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const getNextPaymentDate = (joinDate: string) => {
    const currentDate = new Date();
    const join = new Date(joinDate);
    const paymentDay = join.getDate();
    let nextPayment = startOfMonth(currentDate);
    nextPayment.setDate(paymentDay);
    
    if (nextPayment < currentDate) {
      nextPayment = addMonths(nextPayment, 1);
    }
    
    return nextPayment;
  };

  const handleStatusChange = (payment: Payment, newStatus: "paid" | "unpaid" | "partially-paid") => {
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

  const handleRemarksChange = (payment: Payment, remarks: string) => {
    const updatedPayment: Payment = {
      ...payment,
      remarks,
    };
    updatePayment(updatedPayment);
  };

  const generateMonthOptions = () => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = addMonths(new Date(), i);
      const value = format(date, "yyyy-MM");
      const label = format(date, "MMMM yyyy");
      options.push({ value, label });
    }
    return options;
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
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => {
              const payment = payments.find(
                (p) => p.tenantId === tenant.id && p.month.startsWith(selectedMonth)
              );

              const dueDate = getNextPaymentDate(tenant.joinDate);

              return (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>${tenant.monthlyFee}</TableCell>
                  <TableCell>{format(dueDate, "dd MMM yyyy")}</TableCell>
                  <TableCell>
                    <Select
                      value={payment?.status || "unpaid"}
                      onValueChange={(value: Payment["status"]) =>
                        handleStatusChange(
                          payment || {
                            id: Date.now().toString(),
                            tenantId: tenant.id,
                            amount: tenant.monthlyFee,
                            month: selectedMonth,
                            status: "unpaid",
                            dueDate: dueDate.toISOString(),
                          },
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment?.status || "unpaid")}
                          <span className="capitalize">
                            {payment?.status || "unpaid"}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="partially-paid">
                          Partially Paid
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {payment?.paidDate
                      ? format(new Date(payment.paidDate), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={payment?.remarks || ""}
                      onChange={(e) =>
                        handleRemarksChange(
                          payment || {
                            id: Date.now().toString(),
                            tenantId: tenant.id,
                            amount: tenant.monthlyFee,
                            month: selectedMonth,
                            status: "unpaid",
                            dueDate: dueDate.toISOString(),
                          },
                          e.target.value
                        )
                      }
                      placeholder="Add remarks..."
                      className="max-w-[200px]"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Payments;

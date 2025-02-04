
import { format } from "date-fns";
import { Download, CheckSquare, XSquare, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Payment, Tenant } from "@/lib/types";

interface PaymentListProps {
  tenants: Tenant[];
  payments: Payment[];
  selectedMonth: string;
  onStatusChange: (tenant: Tenant, status: Payment["status"]) => void;
  onRemarksChange: (tenant: Tenant, remarks: string) => void;
  getStatusIcon: (status: Payment["status"]) => JSX.Element;
}

const PaymentList = ({
  tenants,
  payments,
  selectedMonth,
  onStatusChange,
  onRemarksChange,
  getStatusIcon,
}: PaymentListProps) => {
  // Filter out tenants who haven't joined yet for the selected month
  const eligibleTenants = tenants.filter(tenant => {
    const joinDate = new Date(tenant.joinDate);
    const selectedDate = new Date(selectedMonth);
    return joinDate <= selectedDate;
  });

  return (
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
          {eligibleTenants.map((tenant) => {
            const payment = payments.find(
              (p) => p.tenantId === tenant.id && p.month.startsWith(selectedMonth)
            );

            return (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>${tenant.monthlyFee}</TableCell>
                <TableCell>
                  {format(new Date(tenant.joinDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Select
                    value={payment?.status || "unpaid"}
                    onValueChange={(value: Payment["status"]) =>
                      onStatusChange(tenant, value)
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
                      onRemarksChange(tenant, e.target.value)
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
  );
};

export default PaymentList;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Payment, Tenant } from "@/lib/types";

interface PaymentCardProps {
  payment: Payment;
  tenant: Tenant | undefined;
  onStatusToggle: (payment: Payment) => void;
}

const PaymentCard = ({ payment, tenant, onStatusToggle }: PaymentCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{tenant?.name || "Unknown Tenant"}</h3>
            <p className="text-sm text-gray-500">{payment.month}</p>
          </div>
          <Button
            variant={payment.status === "paid" ? "outline" : "default"}
            size="sm"
            onClick={() => onStatusToggle(payment)}
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
};

export default PaymentCard;
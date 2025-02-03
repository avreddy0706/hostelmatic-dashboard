import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { Payment } from "@/lib/types";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentCard from "@/components/payments/PaymentCard";

const Payments = () => {
  const { toast } = useToast();
  const { tenants, payments, addPayment, updatePayment } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const handleSubmit = (paymentData: Payment) => {
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
        <PaymentForm
          tenants={tenants}
          editingPayment={editingPayment}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            tenant={tenants.find(t => t.id === payment.tenantId)}
            onStatusToggle={togglePaymentStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Payments;
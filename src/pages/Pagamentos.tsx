
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentList } from "@/components/payments/PaymentList";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { PaymentFilters } from "@/components/payments/PaymentFilters";

interface Payment {
  id: string;
  stay_id: string;
  payment_date: string;
  amount_paid: number;
  reference_month: number;
  reference_year: number;
  status: string;
  notes: string | null;
}

interface PaymentFilters {
  unit_id?: string;
  guest_id?: string;
  month?: number;
  year?: number;
  status?: string;
}

export default function Pagamentos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<PaymentFilters>({});

  const handleCreatePayment = () => {
    setDialogMode("create");
    setSelectedPayment(null);
    setDialogOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setDialogMode("edit");
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFilterChange = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    // The refresh will happen automatically because we're passing filters as a prop
    // to the PaymentList component
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
        <Button 
          className="bg-green-700 hover:bg-green-800"
          onClick={handleCreatePayment}
        >
          Registrar Novo Pagamento
        </Button>
      </div>
      
      <PaymentFilters onFilterChange={handleFilterChange} />
      
      <PaymentList 
        key={refreshTrigger}
        onEdit={handleEditPayment}
        filters={filters}
      />

      <PaymentDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedPayment}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

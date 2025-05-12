
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "./PaymentForm";

interface PaymentDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    id: string;
    stay_id: string;
    payment_date: string;
    amount_paid: number;
    reference_month: number;
    reference_year: number;
    status: string;
    notes: string | null;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentDialog({ 
  open, 
  mode, 
  initialData, 
  onOpenChange, 
  onSuccess 
}: PaymentDialogProps) {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" 
              ? "Registrar Novo Pagamento" 
              : "Editar Pagamento"}
          </DialogTitle>
        </DialogHeader>
        <PaymentForm
          initialData={initialData}
          mode={mode}
          onCancel={() => onOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

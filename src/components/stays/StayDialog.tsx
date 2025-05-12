
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StayForm } from "./StayForm";

interface StayDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    id: string;
    unit_id: string;
    guest_id: string;
    start_date: string;
    end_date: string | null;
    monthly_rent: number;
    status: string;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StayDialog({ 
  open, 
  mode, 
  initialData, 
  onOpenChange, 
  onSuccess 
}: StayDialogProps) {
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
              ? "Registrar Nova Estadia" 
              : "Editar Estadia"}
          </DialogTitle>
        </DialogHeader>
        <StayForm
          initialData={initialData}
          mode={mode}
          onCancel={() => onOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

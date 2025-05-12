
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MaintenanceForm } from "./MaintenanceForm";

interface MaintenanceLogDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    id: string;
    unit_id: string;
    item_id: string | null;
    description: string;
    date_reported: string;
    date_completed: string | null;
    cost: number | null;
    service_provider: string | null;
    status: string;
    notes: string | null;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MaintenanceLogDialog({ 
  open, 
  mode, 
  initialData, 
  onOpenChange, 
  onSuccess 
}: MaintenanceLogDialogProps) {
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
              ? "Registrar Nova Manutenção" 
              : "Editar Registro de Manutenção"}
          </DialogTitle>
        </DialogHeader>
        <MaintenanceForm
          initialData={initialData}
          mode={mode}
          onCancel={() => onOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

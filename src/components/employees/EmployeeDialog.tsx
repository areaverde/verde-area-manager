
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeeDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    id: string;
    full_name: string;
    role: string;
    phone: string | null;
    email: string | null;
    start_date: string;
    end_date: string | null;
    salary: number | null;
    notes: string | null;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EmployeeDialog({ 
  open, 
  mode, 
  initialData, 
  onOpenChange, 
  onSuccess 
}: EmployeeDialogProps) {
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
              ? "Adicionar Novo Funcionário" 
              : "Editar Funcionário"}
          </DialogTitle>
        </DialogHeader>
        <EmployeeForm
          initialData={initialData}
          mode={mode}
          onCancel={() => onOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

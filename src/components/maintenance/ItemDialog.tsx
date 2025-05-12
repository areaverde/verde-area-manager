
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemForm } from "./ItemForm";

interface ItemDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    id: string;
    unit_id: string;
    name: string;
    type: string;
    brand: string | null;
    model: string | null;
    purchase_date: string | null;
    condition: string;
    notes: string | null;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ItemDialog({ 
  open, 
  mode, 
  initialData, 
  onOpenChange, 
  onSuccess 
}: ItemDialogProps) {
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
              ? "Adicionar Novo Item" 
              : "Editar Item"}
          </DialogTitle>
        </DialogHeader>
        <ItemForm
          initialData={initialData}
          mode={mode}
          onCancel={() => onOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

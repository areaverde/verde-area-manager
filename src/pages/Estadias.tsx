
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StayList } from "@/components/stays/StayList";
import { StayDialog } from "@/components/stays/StayDialog";

interface Stay {
  id: string;
  unit_id: string;
  guest_id: string;
  start_date: string;
  end_date: string | null;
  monthly_rent: number;
  status: string;
}

export default function Estadias() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateStay = () => {
    setDialogMode("create");
    setSelectedStay(null);
    setDialogOpen(true);
  };

  const handleEditStay = (stay: Stay) => {
    setDialogMode("edit");
    setSelectedStay(stay);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Estadias</h1>
        <Button 
          className="bg-green-700 hover:bg-green-800"
          onClick={handleCreateStay}
        >
          Registrar Nova Estadia
        </Button>
      </div>
      
      <StayList 
        key={refreshTrigger}
        onEdit={handleEditStay} 
      />

      <StayDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedStay}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

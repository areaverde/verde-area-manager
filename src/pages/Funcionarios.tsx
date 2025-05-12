
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";

interface Employee {
  id: string;
  full_name: string;
  role: string;
  phone: string | null;
  email: string | null;
  start_date: string;
  end_date: string | null;
  salary: number | null;
  notes: string | null;
}

export default function Funcionarios() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateEmployee = () => {
    setDialogMode("create");
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setDialogMode("edit");
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
        <Button 
          className="bg-green-700 hover:bg-green-800"
          onClick={handleCreateEmployee}
        >
          Adicionar Novo Funcionário
        </Button>
      </div>
      
      <EmployeeList 
        key={refreshTrigger}
        onEdit={handleEditEmployee}
      />

      <EmployeeDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedEmployee}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

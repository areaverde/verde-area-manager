
import { FormSelectField } from "@/components/common/FormSelectField";

interface MaintenanceStatusFieldProps {
  form: any;
  loading: boolean;
  onStatusChange?: (status: string) => void;
}

export function MaintenanceStatusField({
  form,
  loading,
  onStatusChange,
}: MaintenanceStatusFieldProps) {
  const statusOptions = [
    { value: "reported", label: "Reportado" },
    { value: "scheduled", label: "Agendado" },
    { value: "in_progress", label: "Em Andamento" },
    { value: "completed", label: "Concluído" },
    { value: "cancelled", label: "Cancelado" },
  ];

  return (
    <FormSelectField
      form={form}
      name="status"
      label="Status"
      options={statusOptions}
      disabled={loading}
      required={true}
      onValueChange={onStatusChange}
    />
  );
}

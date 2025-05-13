
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema, type MaintenanceFormValues } from "./MaintenanceSchema";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { maintenanceOperations } from "./maintenanceOperations";

interface UseMaintenanceFormProps {
  maintenance?: {
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
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function useMaintenanceForm({ maintenance, mode, onSuccess }: UseMaintenanceFormProps) {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      unit_id: maintenance?.unit_id || "",
      item_id: maintenance?.item_id || "",
      description: maintenance?.description || "",
      date_reported: maintenance?.date_reported || new Date().toISOString().split('T')[0],
      date_completed: maintenance?.date_completed || "",
      cost: maintenance?.cost || undefined,
      service_provider: maintenance?.service_provider || "",
      status: (maintenance?.status as "reported" | "in_progress" | "completed" | "cancelled") || "reported",
      notes: maintenance?.notes || "",
    },
  });

  const { loading, handleSubmit } = useFormSubmission({
    successTitle: mode === 'create' ? "Manutenção registrada" : "Manutenção atualizada",
    successDescription: mode === 'create' 
      ? "A manutenção foi registrada com sucesso." 
      : "As informações da manutenção foram atualizadas.",
    errorTitle: "Erro ao salvar manutenção",
    errorDescription: "Ocorreu um problema ao salvar as informações da manutenção.",
    onSuccess,
  });

  // Watch the status field to conditionally show completed-related fields
  const status = form.watch("status");
  const showCompletedFields = status === "completed";

  async function onSubmit(formData: MaintenanceFormValues) {
    if (mode === 'create') {
      await handleSubmit(maintenanceOperations.create, formData);
    } else if (mode === 'edit' && maintenance) {
      await handleSubmit(
        (userId, data) => maintenanceOperations.update(maintenance.id, userId, data),
        formData
      );
    }
  }

  return {
    form,
    loading,
    showCompletedFields,
    onSubmit,
    onCancel: onSuccess,
  };
}


import { useState } from "react";
import { Form } from "@/components/ui/form";
import { FormDateField } from "@/components/common/FormDateField";
import { FormTextField } from "@/components/common/FormTextField";
import { useMaintenanceForm } from "./useMaintenanceForm";
import { MaintenanceFormActions } from "./MaintenanceFormActions";
import { MaintenanceUnitSelector } from "./MaintenanceUnitSelector";
import { MaintenanceItemSelector } from "./MaintenanceItemSelector";
import { MaintenanceStatusField } from "./MaintenanceStatusField";
import { MaintenanceCompletedFields } from "./MaintenanceCompletedFields";

interface MaintenanceFormProps {
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
  mode: "create" | "edit";
  onCancel: () => void;
  onSuccess: () => void;
}

export function MaintenanceForm({ initialData, mode, onCancel, onSuccess }: MaintenanceFormProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialData?.unit_id || "");
  
  const { form, loading, showCompletedFields, onSubmit } = useMaintenanceForm({
    maintenance: initialData,
    mode,
    onSuccess,
  });

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    form.setValue("item_id", ""); // Clear selected item when unit changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MaintenanceUnitSelector
            form={form}
            loading={loading}
            onUnitChange={handleUnitChange}
          />

          <MaintenanceItemSelector
            form={form}
            loading={loading}
            unitId={selectedUnitId}
          />

          <FormTextField
            form={form}
            name="description"
            label="Descrição"
            placeholder="Descrição do problema"
            multiline={true}
            disabled={loading}
            required={true}
            className="col-span-2"
          />

          <FormDateField
            form={form}
            name="date_reported"
            label="Data Reportada"
            disabled={loading}
            required={true}
          />

          <MaintenanceStatusField
            form={form}
            loading={loading}
          />

          {/* Fields shown only when status is "completed" */}
          {showCompletedFields && (
            <MaintenanceCompletedFields form={form} loading={loading} />
          )}

          <FormTextField
            form={form}
            name="notes"
            label="Observações (opcional)"
            placeholder="Observações sobre a manutenção"
            multiline={true}
            disabled={loading}
            className="col-span-2"
          />
        </div>

        <MaintenanceFormActions
          mode={mode}
          loading={loading}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}


import { FormDateField } from "@/components/common/FormDateField";
import { FormTextField } from "@/components/common/FormTextField";

interface MaintenanceCompletedFieldsProps {
  form: any;
  loading: boolean;
}

export function MaintenanceCompletedFields({ form, loading }: MaintenanceCompletedFieldsProps) {
  return (
    <>
      <FormDateField
        form={form}
        name="date_completed"
        label="Data de Conclusão"
        disabled={loading}
      />

      <FormTextField
        form={form}
        name="cost"
        label="Custo (R$)"
        placeholder="0.00"
        type="number"
        disabled={loading}
      />

      <FormTextField
        form={form}
        name="service_provider"
        label="Prestador de Serviço"
        placeholder="Nome do prestador de serviço"
        disabled={loading}
      />
    </>
  );
}

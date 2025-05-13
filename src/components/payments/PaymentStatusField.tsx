
import { FormSelectField } from "@/components/common/FormSelectField";

interface PaymentStatusFieldProps {
  form: any;
  loading: boolean;
}

export function PaymentStatusField({ form, loading }: PaymentStatusFieldProps) {
  const statusOptions = [
    { value: "paid", label: "Pago" },
    { value: "pending", label: "Pendente" },
    { value: "overdue", label: "Em Atraso" },
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
    />
  );
}

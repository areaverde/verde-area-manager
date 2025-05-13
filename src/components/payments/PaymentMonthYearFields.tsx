
import { FormSelectField } from "@/components/common/FormSelectField";
import { FormTextField } from "@/components/common/FormTextField";

const months = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

interface PaymentMonthYearFieldsProps {
  form: any;
  loading: boolean;
}

export function PaymentMonthYearFields({ form, loading }: PaymentMonthYearFieldsProps) {
  // Get current year
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <FormSelectField
        form={form}
        name="reference_month"
        label="Mês de Referência"
        options={months}
        disabled={loading}
        required={true}
      />

      <FormTextField
        form={form}
        name="reference_year"
        label="Ano de Referência"
        type="number"
        placeholder={currentYear.toString()}
        disabled={loading}
        required={true}
      />
    </>
  );
}

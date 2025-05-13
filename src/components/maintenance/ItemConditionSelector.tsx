
import { FormSelectField } from "@/components/common/FormSelectField";

interface ItemConditionSelectorProps {
  form: any;
  loading: boolean;
}

export function ItemConditionSelector({ form, loading }: ItemConditionSelectorProps) {
  const conditionOptions = [
    { value: "excellent", label: "Excelente" },
    { value: "good", label: "Bom" },
    { value: "fair", label: "Regular" },
    { value: "poor", label: "Ruim" },
    { value: "broken", label: "Quebrado" },
  ];

  return (
    <FormSelectField
      form={form}
      name="condition"
      label="Condição"
      options={conditionOptions}
      disabled={loading}
      required={true}
    />
  );
}

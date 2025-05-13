
import { FormSelectField } from "@/components/common/FormSelectField";

interface ItemTypeSelectorProps {
  form: any;
  loading: boolean;
}

export function ItemTypeSelector({ form, loading }: ItemTypeSelectorProps) {
  const commonItemTypes = [
    "Ar Condicionado",
    "Geladeira",
    "Fogão",
    "Microondas",
    "Máquina de Lavar",
    "Cama",
    "Sofá",
    "Mesa",
    "Cadeira",
    "Armário",
    "Televisão",
    "Outro",
  ];

  const typeOptions = commonItemTypes.map(type => ({
    value: type,
    label: type
  }));

  return (
    <FormSelectField
      form={form}
      name="type"
      label="Tipo"
      options={typeOptions}
      placeholder="Selecione um tipo"
      disabled={loading}
      required={true}
    />
  );
}

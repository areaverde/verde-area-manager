
import { FormTextField } from "@/components/common/FormTextField";
import { ItemTypeSelector } from "./ItemTypeSelector";

interface ItemBasicInfoFieldsProps {
  form: any;
  loading: boolean;
}

export function ItemBasicInfoFields({ form, loading }: ItemBasicInfoFieldsProps) {
  return (
    <>
      <FormTextField
        form={form}
        name="name"
        label="Nome"
        placeholder="Nome do item"
        disabled={loading}
        required={true}
      />

      <ItemTypeSelector form={form} loading={loading} />

      <FormTextField
        form={form}
        name="brand"
        label="Marca (opcional)"
        placeholder="Marca do item"
        disabled={loading}
      />

      <FormTextField
        form={form}
        name="model"
        label="Modelo (opcional)"
        placeholder="Modelo do item"
        disabled={loading}
      />
    </>
  );
}


import { Form } from "@/components/ui/form";
import { FormDateField } from "@/components/common/FormDateField";
import { FormTextField } from "@/components/common/FormTextField";
import { useItemForm } from "./useItemForm";
import { ItemFormActions } from "./ItemFormActions";
import { ItemUnitSelector } from "./ItemUnitSelector";
import { ItemBasicInfoFields } from "./ItemBasicInfoFields";
import { ItemConditionSelector } from "./ItemConditionSelector";

interface ItemFormProps {
  initialData?: {
    id: string;
    unit_id: string;
    name: string;
    type: string;
    brand: string | null;
    model: string | null;
    purchase_date: string | null;
    condition: string;
    notes: string | null;
  } | null;
  mode: "create" | "edit";
  onCancel: () => void;
  onSuccess: () => void;
}

export function ItemForm({ initialData, mode, onCancel, onSuccess }: ItemFormProps) {
  const { form, loading, onSubmit } = useItemForm({
    item: initialData,
    mode,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ItemUnitSelector form={form} loading={loading} />
          
          <ItemBasicInfoFields form={form} loading={loading} />
          
          <FormDateField
            form={form}
            name="purchase_date"
            label="Data de Compra (opcional)"
            disabled={loading}
          />
          
          <ItemConditionSelector form={form} loading={loading} />
          
          <FormTextField
            form={form}
            name="notes"
            label="Observações (opcional)"
            placeholder="Observações sobre o item"
            multiline={true}
            disabled={loading}
            className="col-span-2"
          />
        </div>

        <ItemFormActions
          mode={mode}
          loading={loading}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}

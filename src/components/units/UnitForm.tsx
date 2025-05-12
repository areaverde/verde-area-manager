
import { Form } from "@/components/ui/form";
import UnitDetailsFields from "./UnitDetailsFields";
import UnitLocationFields from "./UnitLocationFields";
import UnitStatusField from "./UnitStatusField";
import UnitFormActions from "./UnitFormActions";
import { useUnitForm } from "./useUnitForm";

interface UnitFormProps {
  unit?: {
    id: string;
    unit_number: string;
    description: string | null;
    status: string;
    address: {
      id: string;
      name: string;
    } | null;
  } | null;
  userId: string;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export default function UnitForm({ unit, userId, mode, onSuccess }: UnitFormProps) {
  const { form, addresses, loading, onSubmit, onCancel } = useUnitForm({
    unit,
    userId,
    mode,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 py-4">
        <UnitDetailsFields form={form} />
        <UnitLocationFields form={form} addresses={addresses} loading={loading} />
        <UnitStatusField form={form} loading={loading} />
        <UnitFormActions 
          loading={loading} 
          mode={mode} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
}

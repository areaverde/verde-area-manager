
import { Form } from "@/components/ui/form";
import { useStayForm } from "./useStayForm";
import { StayFields } from "./StayFields";
import { StayFormActions } from "./StayFormActions";

interface StayFormProps {
  initialData?: {
    id: string;
    unit_id: string;
    guest_id: string;
    start_date: string;
    end_date: string | null;
    monthly_rent: number;
    status: string;
  } | null;
  mode: "create" | "edit";
  onCancel: () => void;
  onSuccess: () => void;
}

export function StayForm({ initialData, mode, onCancel, onSuccess }: StayFormProps) {
  const { form, loading, onSubmit } = useStayForm({
    stay: initialData,
    mode,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StayFields 
          form={form} 
          mode={mode} 
          loading={loading} 
          initialUnitId={initialData?.unit_id}
        />

        <StayFormActions
          mode={mode}
          loading={loading}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}

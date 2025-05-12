
import { Form } from "@/components/ui/form";
import GuestPersonalFields from "./GuestPersonalFields";
import GuestDocumentFields from "./GuestDocumentFields";
import GuestFormActions from "./GuestFormActions";
import { useGuestForm } from "./useGuestForm";

interface GuestFormProps {
  guest?: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    document_id: string;
    notes: string | null;
  } | null;
  userId: string;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export default function GuestForm({ guest, userId, mode, onSuccess }: GuestFormProps) {
  const { form, loading, onSubmit, onCancel } = useGuestForm({
    guest,
    userId,
    mode,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <GuestPersonalFields form={form} />
        <GuestDocumentFields form={form} />
        <GuestFormActions 
          loading={loading} 
          mode={mode} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
}

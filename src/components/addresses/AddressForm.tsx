
import { Form } from "@/components/ui/form";
import { AddressDetailsFields } from "./AddressDetailsFields";
import { AddressLocationFields } from "./AddressLocationFields";
import { AddressFormActions } from "./AddressFormActions";
import { useAddressForm } from "./useAddressForm";

interface AddressFormProps {
  address?: {
    id: string;
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  } | null;
  userId: string;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export default function AddressForm({ address, userId, mode, onSuccess }: AddressFormProps) {
  const { form, loading, onSubmit } = useAddressForm({ address, userId, mode, onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 py-4">
        <AddressDetailsFields form={form} />
        <AddressLocationFields form={form} />
        <AddressFormActions 
          onCancel={onSuccess}
          loading={loading}
          mode={mode}
        />
      </form>
    </Form>
  );
}


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestSchema, type GuestFormValues } from "./GuestSchema";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { guestOperations } from "./guestOperations";

interface UseGuestFormProps {
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

export function useGuestForm({ guest, userId, mode, onSuccess }: UseGuestFormProps) {
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      full_name: guest?.full_name || "",
      phone: guest?.phone || "",
      email: guest?.email || "",
      document_id: guest?.document_id || "",
      notes: guest?.notes || "",
    },
  });

  const { loading, handleSubmit } = useFormSubmission({
    successTitle: mode === 'create' ? "Hóspede criado" : "Hóspede atualizado",
    successDescription: mode === 'create' 
      ? "O hóspede foi criado com sucesso." 
      : "As informações do hóspede foram atualizadas.",
    errorTitle: "Erro ao salvar hóspede",
    errorDescription: "Ocorreu um problema ao salvar as informações do hóspede.",
    onSuccess,
  });

  async function onSubmit(formData: GuestFormValues) {
    if (mode === 'create') {
      await handleSubmit(() => guestOperations.create(userId, formData), formData);
    } else if (mode === 'edit' && guest) {
      await handleSubmit(
        () => guestOperations.update(guest.id, userId, formData),
        formData
      );
    }
  }

  return {
    form,
    loading,
    onSubmit,
    onCancel: onSuccess,
  };
}

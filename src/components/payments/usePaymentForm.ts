
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, type PaymentFormValues } from "./PaymentSchema";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { paymentOperations } from "./paymentOperations";

interface UsePaymentFormProps {
  payment?: {
    id: string;
    stay_id: string;
    payment_date: string;
    amount_paid: number;
    reference_month: number;
    reference_year: number;
    status: string;
    notes: string | null;
  } | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function usePaymentForm({ payment, mode, onSuccess }: UsePaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      stay_id: payment?.stay_id || "",
      payment_date: payment?.payment_date || new Date().toISOString().split('T')[0],
      amount_paid: payment?.amount_paid || 0,
      reference_month: payment?.reference_month || new Date().getMonth() + 1,
      reference_year: payment?.reference_year || new Date().getFullYear(),
      status: (payment?.status as "paid" | "pending" | "overdue" | "cancelled") || "paid",
      notes: payment?.notes || "",
    },
  });

  const { loading, handleSubmit } = useFormSubmission({
    successTitle: mode === 'create' ? "Pagamento registrado" : "Pagamento atualizado",
    successDescription: mode === 'create' 
      ? "O pagamento foi registrado com sucesso." 
      : "As informações do pagamento foram atualizadas.",
    errorTitle: "Erro ao salvar pagamento",
    errorDescription: "Ocorreu um problema ao salvar as informações do pagamento.",
    onSuccess,
  });

  async function onSubmit(formData: PaymentFormValues) {
    if (mode === 'create') {
      await handleSubmit(paymentOperations.create, formData);
    } else if (mode === 'edit' && payment) {
      await handleSubmit((userId, data) => 
        paymentOperations.update(payment.id, userId, data), 
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

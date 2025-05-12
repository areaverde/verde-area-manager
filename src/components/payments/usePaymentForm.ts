
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { paymentSchema, type PaymentFormValues } from "./PaymentSchema";
import { useAuth } from "@/context/AuthContext";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

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

  async function onSubmit(formData: PaymentFormValues) {
    if (!userId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (mode === 'create') {
        const paymentData = {
          stay_id: formData.stay_id,
          payment_date: formData.payment_date,
          amount_paid: formData.amount_paid,
          reference_month: formData.reference_month,
          reference_year: formData.reference_year,
          status: formData.status,
          notes: formData.notes,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('payments')
          .insert(paymentData);
          
        if (error) throw error;
      } else if (mode === 'edit' && payment) {
        const updateData = {
          stay_id: formData.stay_id,
          payment_date: formData.payment_date,
          amount_paid: formData.amount_paid,
          reference_month: formData.reference_month,
          reference_year: formData.reference_year,
          status: formData.status,
          notes: formData.notes,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('payments')
          .update(updateData)
          .eq('id', payment.id);
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Pagamento registrado" : "Pagamento atualizado",
        description: mode === 'create' 
          ? "O pagamento foi registrado com sucesso." 
          : "As informações do pagamento foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast({
        title: "Erro ao salvar pagamento",
        description: "Ocorreu um problema ao salvar as informações do pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    onSubmit,
    onCancel: onSuccess,
  };
}

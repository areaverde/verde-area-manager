
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staySchema, type StayFormValues } from "./StaySchema";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { stayOperations } from "./stayOperations";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface UseStayFormProps {
  stay?: {
    id: string;
    unit_id: string;
    guest_id: string;
    start_date: string;
    end_date: string | null;
    monthly_rent: number;
    status: string;
  } | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function useStayForm({ stay, mode, onSuccess }: UseStayFormProps) {
  const form = useForm<StayFormValues>({
    resolver: zodResolver(staySchema),
    defaultValues: {
      unit_id: stay?.unit_id || "",
      guest_id: stay?.guest_id || "",
      start_date: stay?.start_date || "",
      end_date: stay?.end_date || "",
      monthly_rent: stay?.monthly_rent || 0,
      status: (stay?.status as "active" | "completed" | "cancelled") || "active",
    },
  });

  const { loading, handleSubmit } = useFormSubmission({
    successTitle: mode === 'create' ? "Estadia registrada" : "Estadia atualizada",
    successDescription: mode === 'create' 
      ? "A estadia foi registrada com sucesso." 
      : "As informações da estadia foram atualizadas.",
    errorTitle: "Erro ao salvar estadia",
    errorDescription: "Ocorreu um problema ao salvar as informações da estadia.",
    onSuccess,
  });

  // For finalizing stays, we need a separate implementation
  const { toast } = useToast();
  const { user } = useAuth();
  const [finalizingLoading, setFinalizingLoading] = useState(false);

  async function onSubmit(formData: StayFormValues) {
    if (mode === 'create') {
      await handleSubmit(stayOperations.create, formData);
    } else if (mode === 'edit' && stay) {
      await handleSubmit(
        (userId, data) => stayOperations.update(stay.id, userId, data, stay.unit_id),
        formData
      );
    }
  }

  async function finalizeStay(stayId: string, unitId: string) {
    const userId = user?.id;
    if (!userId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFinalizingLoading(true);
      await stayOperations.finalize(stayId, unitId, userId);
      
      toast({
        title: "Estadia finalizada",
        description: "A estadia foi finalizada com sucesso e a unidade está disponível.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error finalizing stay:', error);
      toast({
        title: "Erro ao finalizar estadia",
        description: "Ocorreu um problema ao finalizar a estadia.",
        variant: "destructive",
      });
    } finally {
      setFinalizingLoading(false);
    }
  }

  return {
    form,
    loading: loading || finalizingLoading,
    onSubmit,
    finalizeStay,
    onCancel: onSuccess,
  };
}

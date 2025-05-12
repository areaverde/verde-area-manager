
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { guestSchema, type GuestFormValues } from "./GuestSchema";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  async function onSubmit(formData: GuestFormValues) {
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
        // Make sure to include all required fields explicitly from the form data
        const guestData = {
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          document_id: formData.document_id,
          notes: formData.notes,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('guests')
          .insert(guestData)
          .select();
          
        if (error) throw error;
      } else if (mode === 'edit' && guest) {
        // For edit, make sure to include all required fields explicitly
        const updateData = {
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          document_id: formData.document_id,
          notes: formData.notes,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('guests')
          .update(updateData)
          .eq('id', guest.id)
          .select();
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Hóspede criado" : "Hóspede atualizado",
        description: mode === 'create' 
          ? "O hóspede foi criado com sucesso." 
          : "As informações do hóspede foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving guest:', error);
      toast({
        title: "Erro ao salvar hóspede",
        description: "Ocorreu um problema ao salvar as informações do hóspede.",
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

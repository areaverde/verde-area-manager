
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { staySchema, type StayFormValues } from "./StaySchema";
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

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

  async function onSubmit(formData: StayFormValues) {
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
        const stayData = {
          unit_id: formData.unit_id,
          guest_id: formData.guest_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          monthly_rent: formData.monthly_rent,
          status: formData.status,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        // Start a transaction to insert the stay and update the unit status
        const { data: newStay, error: stayError } = await supabase
          .from('stays')
          .insert(stayData)
          .select()
          .single();
          
        if (stayError) throw stayError;
        
        // Update the unit status to occupied
        const { error: unitError } = await supabase
          .from('units')
          .update({
            status: 'occupied',
            updated_by: userId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', formData.unit_id);
          
        if (unitError) throw unitError;
      } else if (mode === 'edit' && stay) {
        const updateData = {
          unit_id: formData.unit_id,
          guest_id: formData.guest_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          monthly_rent: formData.monthly_rent,
          status: formData.status,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        // Update the stay record
        const { error: stayError } = await supabase
          .from('stays')
          .update(updateData)
          .eq('id', stay.id);
          
        if (stayError) throw stayError;
        
        // If unit changed or status changed to completed or cancelled, update unit status
        if (stay.unit_id !== formData.unit_id || formData.status !== 'active') {
          if (stay.unit_id !== formData.unit_id) {
            // Free up the old unit
            const { error: oldUnitError } = await supabase
              .from('units')
              .update({
                status: 'available',
                updated_by: userId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', stay.unit_id);
              
            if (oldUnitError) throw oldUnitError;
            
            // Occupy the new unit if status is active
            if (formData.status === 'active') {
              const { error: newUnitError } = await supabase
                .from('units')
                .update({
                  status: 'occupied',
                  updated_by: userId,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', formData.unit_id);
                
              if (newUnitError) throw newUnitError;
            }
          } else if (formData.status !== 'active') {
            // If status changed to completed or cancelled, free up the unit
            const { error: unitError } = await supabase
              .from('units')
              .update({
                status: 'available',
                updated_by: userId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', formData.unit_id);
              
            if (unitError) throw unitError;
          }
        }
      }
      
      toast({
        title: mode === 'create' ? "Estadia registrada" : "Estadia atualizada",
        description: mode === 'create' 
          ? "A estadia foi registrada com sucesso." 
          : "As informações da estadia foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving stay:', error);
      toast({
        title: "Erro ao salvar estadia",
        description: "Ocorreu um problema ao salvar as informações da estadia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function finalizeStay(stayId: string, unitId: string) {
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
      
      // Update the stay status to completed
      const { error: stayError } = await supabase
        .from('stays')
        .update({
          status: 'completed',
          end_date: new Date().toISOString().split('T')[0],
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', stayId);
        
      if (stayError) throw stayError;
      
      // Update the unit status to available
      const { error: unitError } = await supabase
        .from('units')
        .update({
          status: 'available',
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', unitId);
        
      if (unitError) throw unitError;
      
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
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    onSubmit,
    finalizeStay,
    onCancel: onSuccess,
  };
}

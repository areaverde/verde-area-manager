
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { maintenanceSchema, type MaintenanceFormValues } from "./MaintenanceSchema";
import { useAuth } from "@/context/AuthContext";

interface UseMaintenanceFormProps {
  maintenance?: {
    id: string;
    unit_id: string;
    item_id: string | null;
    description: string;
    date_reported: string;
    date_completed: string | null;
    cost: number | null;
    service_provider: string | null;
    status: string;
    notes: string | null;
  } | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function useMaintenanceForm({ maintenance, mode, onSuccess }: UseMaintenanceFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      unit_id: maintenance?.unit_id || "",
      item_id: maintenance?.item_id || "",
      description: maintenance?.description || "",
      date_reported: maintenance?.date_reported || new Date().toISOString().split('T')[0],
      date_completed: maintenance?.date_completed || "",
      cost: maintenance?.cost || undefined,
      service_provider: maintenance?.service_provider || "",
      status: (maintenance?.status as any) || "reported",
      notes: maintenance?.notes || "",
    },
  });

  // Watch the status field to conditionally show completed-related fields
  const status = form.watch("status");
  const showCompletedFields = status === "completed";

  async function onSubmit(formData: MaintenanceFormValues) {
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
      
      // If status is not completed, clear completed-related fields
      if (formData.status !== "completed") {
        formData.date_completed = undefined;
        formData.cost = undefined;
        formData.service_provider = undefined;
      }
      
      if (mode === 'create') {
        const maintenanceData = {
          unit_id: formData.unit_id,
          item_id: formData.item_id || null,
          description: formData.description,
          date_reported: formData.date_reported,
          date_completed: formData.date_completed || null,
          cost: formData.cost || null,
          service_provider: formData.service_provider || null,
          status: formData.status,
          notes: formData.notes || null,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('maintenance_logs')
          .insert(maintenanceData);
          
        if (error) throw error;
      } else if (mode === 'edit' && maintenance) {
        const updateData = {
          unit_id: formData.unit_id,
          item_id: formData.item_id || null,
          description: formData.description,
          date_reported: formData.date_reported,
          date_completed: formData.date_completed || null,
          cost: formData.cost || null,
          service_provider: formData.service_provider || null,
          status: formData.status,
          notes: formData.notes || null,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('maintenance_logs')
          .update(updateData)
          .eq('id', maintenance.id);
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Manutenção registrada" : "Manutenção atualizada",
        description: mode === 'create' 
          ? "A manutenção foi registrada com sucesso." 
          : "As informações da manutenção foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving maintenance:', error);
      toast({
        title: "Erro ao salvar manutenção",
        description: "Ocorreu um problema ao salvar as informações da manutenção.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    showCompletedFields,
    onSubmit,
    onCancel: onSuccess,
  };
}

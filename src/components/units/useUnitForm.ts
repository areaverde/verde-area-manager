
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { unitSchema, type UnitFormValues } from "./UnitSchema";

interface UseUnitFormProps {
  unit?: {
    id: string;
    unit_number: string;
    description: string | null;
    status: string;
    address: {
      id: string;
      name: string;
    } | null;
  } | null;
  userId: string;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function useUnitForm({ unit, userId, mode, onSuccess }: UseUnitFormProps) {
  const [addresses, setAddresses] = useState<Array<{ id: string; name: string; street: string; number: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      unit_number: unit?.unit_number || "",
      address_id: unit?.address?.id || "",
      description: unit?.description || "",
      status: (unit?.status as "available" | "occupied" | "maintenance" | "inactive") || "available",
    },
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('id, name, street, number')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Erro ao carregar endereços",
        description: "Não foi possível carregar a lista de endereços.",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(formData: UnitFormValues) {
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
        const unitData = {
          unit_number: formData.unit_number,
          address_id: formData.address_id,
          description: formData.description,
          status: formData.status,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('units')
          .insert(unitData)
          .select();
          
        if (error) throw error;
      } else if (mode === 'edit' && unit) {
        const updateData = {
          unit_number: formData.unit_number,
          address_id: formData.address_id,
          description: formData.description,
          status: formData.status,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('units')
          .update(updateData)
          .eq('id', unit.id)
          .select();
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Unidade criada" : "Unidade atualizada",
        description: mode === 'create' 
          ? "A unidade foi criada com sucesso." 
          : "As informações da unidade foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving unit:', error);
      toast({
        title: "Erro ao salvar unidade",
        description: "Ocorreu um problema ao salvar as informações da unidade.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    addresses,
    onSubmit: form.handleSubmit(onSubmit),
    onCancel: onSuccess
  };
}

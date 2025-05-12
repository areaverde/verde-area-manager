
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { itemSchema, type ItemFormValues } from "./ItemSchema";
import { useAuth } from "@/context/AuthContext";

interface UseItemFormProps {
  item?: {
    id: string;
    unit_id: string;
    name: string;
    type: string;
    brand: string | null;
    model: string | null;
    purchase_date: string | null;
    condition: string;
    notes: string | null;
  } | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function useItemForm({ item, mode, onSuccess }: UseItemFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      unit_id: item?.unit_id || "",
      name: item?.name || "",
      type: item?.type || "",
      brand: item?.brand || "",
      model: item?.model || "",
      purchase_date: item?.purchase_date || "",
      condition: (item?.condition as "excellent" | "good" | "fair" | "poor" | "broken") || "good",
      notes: item?.notes || "",
    },
  });

  async function onSubmit(formData: ItemFormValues) {
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
        const itemData = {
          unit_id: formData.unit_id,
          name: formData.name,
          type: formData.type,
          brand: formData.brand || null,
          model: formData.model || null,
          purchase_date: formData.purchase_date || null,
          condition: formData.condition,
          notes: formData.notes || null,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('items')
          .insert(itemData);
          
        if (error) throw error;
      } else if (mode === 'edit' && item) {
        const updateData = {
          unit_id: formData.unit_id,
          name: formData.name,
          type: formData.type,
          brand: formData.brand || null,
          model: formData.model || null,
          purchase_date: formData.purchase_date || null,
          condition: formData.condition,
          notes: formData.notes || null,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('items')
          .update(updateData)
          .eq('id', item.id);
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Item registrado" : "Item atualizado",
        description: mode === 'create' 
          ? "O item foi registrado com sucesso." 
          : "As informações do item foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Erro ao salvar item",
        description: "Ocorreu um problema ao salvar as informações do item.",
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

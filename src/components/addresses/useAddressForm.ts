
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { addressSchema, AddressFormValues } from "./AddressSchema";

type UseAddressFormProps = {
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
};

export function useAddressForm({ address, userId, mode, onSuccess }: UseAddressFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name || "",
      street: address?.street || "",
      number: address?.number || "",
      neighborhood: address?.neighborhood || "",
      city: address?.city || "",
      state: address?.state || "",
      zip_code: address?.zip_code || "",
    },
  });

  async function onSubmit(formData: AddressFormValues) {
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
        // For create, include all required fields plus metadata
        const addressData = {
          name: formData.name,
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('addresses')
          .insert(addressData)
          .select();
          
        if (error) throw error;
      } else if (mode === 'edit' && address) {
        // For edit, don't include created_by to avoid overriding it
        const updateData = {
          name: formData.name,
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('addresses')
          .update(updateData)
          .eq('id', address.id)
          .select();
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Endereço criado" : "Endereço atualizado",
        description: mode === 'create' 
          ? "O endereço foi criado com sucesso." 
          : "As informações do endereço foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Erro ao salvar endereço",
        description: "Ocorreu um problema ao salvar as informações do endereço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    onSubmit: form.handleSubmit(onSubmit)
  };
}

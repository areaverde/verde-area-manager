
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AddressFormProps {
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
}

const addressSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  street: z.string().min(1, "A rua é obrigatória"),
  number: z.string().min(1, "O número é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  zip_code: z.string().min(1, "O CEP é obrigatório"),
});

export default function AddressForm({ address, userId, mode, onSuccess }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addressSchema>>({
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

  async function onSubmit(data: z.infer<typeof addressSchema>) {
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
      
      // Create a properly typed object with all required fields
      const addressData = {
        ...data,  // This spreads all form data (which contains all required fields)
        created_by: userId,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      };
      
      let response;
      
      if (mode === 'create') {
        response = await supabase
          .from('addresses')
          .insert(addressData)
          .select();
      } else if (mode === 'edit' && address) {
        // Ensure we don't override the created_by in edit mode
        const { created_by, ...updateData } = addressData;
        
        response = await supabase
          .from('addresses')
          .update(updateData)
          .eq('id', address.id)
          .select();
      }
      
      if (response?.error) throw response.error;
      
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Edifício Central, Residencial Flores, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da rua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input placeholder="Número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do estado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onSuccess()}
            type="button"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Salvando...</span>
              </div>
            ) : (
              <span>{mode === 'create' ? 'Criar Endereço' : 'Atualizar Endereço'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

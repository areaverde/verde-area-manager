
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface GuestFormProps {
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

const guestSchema = z.object({
  full_name: z.string().min(1, "O nome completo é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  email: z.string().email("Por favor, insira um e-mail válido"),
  document_id: z.string().min(1, "O documento é obrigatório"),
  notes: z.string().nullable().optional(),
});

export default function GuestForm({ guest, userId, mode, onSuccess }: GuestFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof guestSchema>>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      full_name: guest?.full_name || "",
      phone: guest?.phone || "",
      email: guest?.email || "",
      document_id: guest?.document_id || "",
      notes: guest?.notes || "",
    },
  });

  async function onSubmit(data: z.infer<typeof guestSchema>) {
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
      const guestData = {
        ...data,  // This spreads all form data (which contains all required fields)
        created_by: userId,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      };
      
      let response;
      
      if (mode === 'create') {
        response = await supabase
          .from('guests')
          .insert(guestData)
          .select();
      } else if (mode === 'edit' && guest) {
        // For edit, we don't want to override the created_by
        const { created_by, ...updateData } = guestData;
        
        response = await supabase
          .from('guests')
          .update(updateData)
          .eq('id', guest.id)
          .select();
      }
      
      if (response?.error) throw response.error;
      
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="document_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento (CPF/RG) *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número do documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre o hóspede" 
                  className="min-h-[100px]" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
              <span>{mode === 'create' ? 'Criar Hóspede' : 'Atualizar Hóspede'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

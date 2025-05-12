
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnitFormProps {
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

const unitSchema = z.object({
  unit_number: z.string().min(1, "O número da unidade é obrigatório"),
  address_id: z.string().min(1, "O endereço é obrigatório"),
  description: z.string().nullable().optional(),
  status: z.enum(["available", "occupied", "maintenance", "inactive"]),
});

export default function UnitForm({ unit, userId, mode, onSuccess }: UnitFormProps) {
  const [addresses, setAddresses] = useState<Array<{ id: string; name: string; street: string; number: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof unitSchema>>({
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

  async function onSubmit(formData: z.infer<typeof unitSchema>) {
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
        const unitData = {
          ...formData, // This ensures all required fields are included
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
        // For edit, don't include created_by to avoid overriding it
        const updateData = {
          ...formData,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="unit_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Unidade *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Casa 101, Apt 202, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.name || `${address.street}, ${address.number}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhum endereço encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre a unidade" 
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
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="occupied">Ocupada</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
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
              <span>{mode === 'create' ? 'Criar Unidade' : 'Atualizar Unidade'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { employeeSchema, type EmployeeFormValues } from "./EmployeeSchema";
import { useAuth } from "@/context/AuthContext";

interface UseEmployeeFormProps {
  employee?: {
    id: string;
    full_name: string;
    role: string;
    phone: string | null;
    email: string | null;
    start_date: string;
    end_date: string | null;
    salary: number | null;
    notes: string | null;
  } | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export function useEmployeeForm({ employee, mode, onSuccess }: UseEmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      full_name: employee?.full_name || "",
      role: (employee?.role as "manager" | "receptionist" | "cleaner" | "maintenance" | "security" | "other") || "other",
      phone: employee?.phone || "",
      email: employee?.email || "",
      start_date: employee?.start_date || "",
      end_date: employee?.end_date || "",
      salary: employee?.salary || undefined,
      notes: employee?.notes || "",
    },
  });

  async function onSubmit(formData: EmployeeFormValues) {
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
        const employeeData = {
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone || null,
          email: formData.email || null,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          salary: formData.salary || null,
          notes: formData.notes || null,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('employees')
          .insert(employeeData);
          
        if (error) throw error;
      } else if (mode === 'edit' && employee) {
        const updateData = {
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone || null,
          email: formData.email || null,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          salary: formData.salary || null,
          notes: formData.notes || null,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('employees')
          .update(updateData)
          .eq('id', employee.id);
          
        if (error) throw error;
      }
      
      toast({
        title: mode === 'create' ? "Funcionário adicionado" : "Funcionário atualizado",
        description: mode === 'create' 
          ? "O funcionário foi adicionado com sucesso." 
          : "As informações do funcionário foram atualizadas.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Erro ao salvar funcionário",
        description: "Ocorreu um problema ao salvar as informações do funcionário.",
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

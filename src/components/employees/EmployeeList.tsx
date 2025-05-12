
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmployeeListProps {
  onEdit: (employee: Employee) => void;
}

interface Employee {
  id: string;
  full_name: string;
  role: string;
  phone: string | null;
  email: string | null;
  start_date: string;
  end_date: string | null;
  salary: number | null;
  notes: string | null;
}

const roleMap: Record<string, string> = {
  manager: "Gerente",
  receptionist: "Recepcionista",
  cleaner: "Limpeza",
  maintenance: "Manutenção",
  security: "Segurança",
  other: "Outro",
};

export function EmployeeList({ onEdit }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEmployees() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("full_name");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium">Nenhum funcionário encontrado</h3>
        <p className="text-gray-500 mt-2">
          Adicione um novo funcionário para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.full_name}</TableCell>
              <TableCell>{roleMap[employee.role] || employee.role}</TableCell>
              <TableCell>{employee.phone || "—"}</TableCell>
              <TableCell>{formatDate(employee.start_date)}</TableCell>
              <TableCell>
                {employee.end_date ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 border-gray-200">
                    Inativo
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-green-200">
                    Ativo
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

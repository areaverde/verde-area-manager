
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

interface PaymentListProps {
  onEdit: (payment: Payment) => void;
  filters?: PaymentFilters;
}

interface PaymentFilters {
  unit_id?: string;
  guest_id?: string;
  month?: number;
  year?: number;
  status?: string;
}

interface Payment {
  id: string;
  stay_id: string;
  payment_date: string;
  amount_paid: number;
  reference_month: number;
  reference_year: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  notes: string | null;
  stays: {
    units: {
      unit_number: string;
    };
    guests: {
      full_name: string;
    };
  };
}

const statusMap: Record<string, { text: string, className: string }> = {
  paid: { text: "Pago", className: "bg-green-100 text-green-700 border-green-200" },
  pending: { text: "Pendente", className: "bg-blue-100 text-blue-700 border-blue-200" },
  overdue: { text: "Em Atraso", className: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { text: "Cancelado", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function PaymentList({ onEdit, filters }: PaymentListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPayments() {
    try {
      setLoading(true);
      
      let query = supabase
        .from("payments")
        .select(`
          id,
          stay_id,
          payment_date,
          amount_paid,
          reference_month,
          reference_year,
          status,
          notes,
          stays:stay_id(
            units:unit_id(unit_number),
            guests:guest_id(full_name)
          )
        `)
        .order("payment_date", { ascending: false });
      
      // Apply filters
      if (filters?.unit_id) {
        // Need to use custom filter in JS since we can't directly filter on the nested join
        const { data: stayIds } = await supabase
          .from("stays")
          .select("id")
          .eq("unit_id", filters.unit_id);
        
        if (stayIds && stayIds.length > 0) {
          query = query.in("stay_id", stayIds.map(s => s.id));
        } else {
          // No stays match the unit filter
          setPayments([]);
          setLoading(false);
          return;
        }
      }
      
      if (filters?.guest_id) {
        // Need to use custom filter in JS since we can't directly filter on the nested join
        const { data: stayIds } = await supabase
          .from("stays")
          .select("id")
          .eq("guest_id", filters.guest_id);
        
        if (stayIds && stayIds.length > 0) {
          query = query.in("stay_id", stayIds.map(s => s.id));
        } else {
          // No stays match the guest filter
          setPayments([]);
          setLoading(false);
          return;
        }
      }
      
      if (filters?.month) {
        query = query.eq("reference_month", filters.month);
      }
      
      if (filters?.year) {
        query = query.eq("reference_year", filters.year);
      }
      
      if (filters?.status) {
        query = query.eq("status", filters.status as "paid" | "pending" | "overdue" | "cancelled");
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatMonthYear = (month: number, year: number) => {
    return `${months[month - 1]}/${year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium">Nenhum pagamento encontrado</h3>
        <p className="text-gray-500 mt-2">
          {filters ? "Tente outros filtros ou" : ""} registre um novo pagamento.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidade</TableHead>
            <TableHead>Hóspede</TableHead>
            <TableHead>Mês/Ano Referência</TableHead>
            <TableHead>Valor Pago</TableHead>
            <TableHead>Data Pagamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.stays?.units?.unit_number || "—"}</TableCell>
              <TableCell>{payment.stays?.guests?.full_name || "—"}</TableCell>
              <TableCell>{formatMonthYear(payment.reference_month, payment.reference_year)}</TableCell>
              <TableCell>{formatCurrency(payment.amount_paid)}</TableCell>
              <TableCell>{formatDate(payment.payment_date)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMap[payment.status]?.className || ""}`}>
                  {statusMap[payment.status]?.text || payment.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(payment)}
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

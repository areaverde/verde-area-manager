
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { formatDate, formatCurrency, formatMonthYear } from "@/utils/formatters";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { PaymentRow } from "./PaymentRow";

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (payments.length === 0) {
    return (
      <EmptyState 
        title="Nenhum pagamento encontrado"
        description={filters ? "Tente outros filtros ou registre um novo pagamento." : "Registre um novo pagamento."}
      />
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
            <PaymentRow
              key={payment.id}
              payment={payment}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              formatMonthYear={formatMonthYear}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

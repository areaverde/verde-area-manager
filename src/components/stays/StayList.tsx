
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
import { useStayForm } from "./useStayForm";

interface StayListProps {
  onEdit: (stay: Stay) => void;
}

interface Stay {
  id: string;
  unit_id: string;
  guest_id: string;
  start_date: string;
  end_date: string | null;
  monthly_rent: number;
  status: string;
  units: {
    unit_number: string;
  };
  guests: {
    full_name: string;
  };
}

export function StayList({ onEdit }: StayListProps) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const { finalizeStay } = useStayForm({ mode: 'edit', onSuccess: () => fetchStays() });

  async function fetchStays() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("stays")
        .select(
          `
          id,
          unit_id,
          guest_id,
          start_date,
          end_date,
          monthly_rent,
          status,
          units:unit_id(unit_number),
          guests:guest_id(full_name)
          `
        )
        .eq("status", "active")
        .order("start_date", { ascending: false });

      if (error) throw error;
      setStays(data || []);
    } catch (error) {
      console.error("Error fetching stays:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStays();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleFinalizeStay = (stayId: string, unitId: string) => {
    if (window.confirm("Tem certeza que deseja finalizar esta estadia?")) {
      finalizeStay(stayId, unitId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (stays.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium">Nenhuma estadia ativa encontrada</h3>
        <p className="text-gray-500 mt-2">
          Registre uma nova estadia para começar.
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
            <TableHead>Data de Entrada</TableHead>
            <TableHead>Data de Saída Prevista</TableHead>
            <TableHead>Valor Mensal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stays.map((stay) => (
            <TableRow key={stay.id}>
              <TableCell>{stay.units.unit_number}</TableCell>
              <TableCell>{stay.guests.full_name}</TableCell>
              <TableCell>{formatDate(stay.start_date)}</TableCell>
              <TableCell>{formatDate(stay.end_date)}</TableCell>
              <TableCell>{formatCurrency(stay.monthly_rent)}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-green-200">
                  Ativa
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(stay)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                    onClick={() => handleFinalizeStay(stay.id, stay.unit_id)}
                  >
                    Finalizar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

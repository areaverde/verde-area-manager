
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

interface MaintenanceLogListProps {
  onEdit: (maintenance: MaintenanceLog) => void;
  unitId?: string;
  itemId?: string;
}

interface MaintenanceLog {
  id: string;
  unit_id: string;
  item_id: string | null;
  description: string;
  date_reported: string;
  date_completed: string | null;
  cost: number | null;
  service_provider: string | null;
  status: string;
  notes: string | null;
  units: {
    unit_number: string;
  };
  items: {
    name: string;
  } | null;
}

const statusMap: Record<string, { text: string, className: string }> = {
  reported: { text: "Reportado", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  scheduled: { text: "Agendado", className: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { text: "Em Andamento", className: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { text: "Concluído", className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { text: "Cancelado", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export function MaintenanceLogList({ onEdit, unitId, itemId }: MaintenanceLogListProps) {
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMaintenanceLogs() {
    try {
      setLoading(true);
      
      let query = supabase
        .from("maintenance_logs")
        .select(`
          id,
          unit_id,
          item_id,
          description,
          date_reported,
          date_completed,
          cost,
          service_provider,
          status,
          notes,
          units:unit_id(unit_number),
          items:item_id(name)
        `)
        .order("date_reported", { ascending: false });
      
      // Apply filters
      if (unitId) {
        query = query.eq("unit_id", unitId);
      }
      
      if (itemId) {
        query = query.eq("item_id", itemId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMaintenanceLogs(data || []);
    } catch (error) {
      console.error("Error fetching maintenance logs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMaintenanceLogs();
  }, [unitId, itemId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (maintenanceLogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium">Nenhuma manutenção encontrada</h3>
        <p className="text-gray-500 mt-2">
          {unitId || itemId ? "Não há registros de manutenção para este filtro." : "Registre uma nova manutenção para começar."}
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
            <TableHead>Item</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data Reportada</TableHead>
            <TableHead>Data Concluída</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenanceLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.units?.unit_number || "—"}</TableCell>
              <TableCell>{log.items?.name || "—"}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={log.description}>
                {log.description}
              </TableCell>
              <TableCell>{formatDate(log.date_reported)}</TableCell>
              <TableCell>{formatDate(log.date_completed)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMap[log.status]?.className || ""}`}>
                  {statusMap[log.status]?.text || log.status}
                </span>
              </TableCell>
              <TableCell>{formatCurrency(log.cost)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(log)}
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

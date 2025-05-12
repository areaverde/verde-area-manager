
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

interface ItemListProps {
  onEdit: (item: Item) => void;
  unitId?: string;
}

interface Item {
  id: string;
  unit_id: string;
  name: string;
  type: string;
  brand: string | null;
  model: string | null;
  purchase_date: string | null;
  condition: string;
  notes: string | null;
  units: {
    unit_number: string;
  };
}

const conditionMap: Record<string, { text: string, className: string }> = {
  excellent: { text: "Excelente", className: "bg-green-100 text-green-700 border-green-200" },
  good: { text: "Bom", className: "bg-green-100 text-green-700 border-green-200" },
  fair: { text: "Regular", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  poor: { text: "Ruim", className: "bg-orange-100 text-orange-700 border-orange-200" },
  broken: { text: "Quebrado", className: "bg-red-100 text-red-700 border-red-200" },
};

export function ItemList({ onEdit, unitId }: ItemListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    try {
      setLoading(true);
      
      let query = supabase
        .from("items")
        .select(`
          id,
          unit_id,
          name,
          type,
          brand,
          model,
          purchase_date,
          condition,
          notes,
          units:unit_id(unit_number)
        `)
        .order("name");
      
      // If unitId is provided, filter by it
      if (unitId) {
        query = query.eq("unit_id", unitId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [unitId]);

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

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium">Nenhum item encontrado</h3>
        <p className="text-gray-500 mt-2">
          {unitId ? "Esta unidade não possui itens registrados." : "Adicione um novo item para começar."}
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
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Marca / Modelo</TableHead>
            <TableHead>Data de Compra</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.units?.unit_number || "—"}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                {item.brand && item.model
                  ? `${item.brand} / ${item.model}`
                  : item.brand || item.model || "—"}
              </TableCell>
              <TableCell>{formatDate(item.purchase_date)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${conditionMap[item.condition]?.className || ""}`}>
                  {conditionMap[item.condition]?.text || item.condition}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
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

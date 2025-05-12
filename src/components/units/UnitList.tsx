
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Unit {
  id: string;
  unit_number: string;
  description: string | null;
  status: 'available' | 'occupied' | 'maintenance' | 'inactive';
  address: {
    id: string;
    name: string;
    street: string;
    number: string;
    city: string;
  } | null;
}

interface UnitListProps {
  units: Unit[];
  onViewUnit: (unit: Unit) => void;
  onEditUnit: (unit: Unit) => void;
}

export default function UnitList({ units, onViewUnit, onEditUnit }: UnitListProps) {
  function getStatusBadge(status: string) {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Disponível</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Ocupada</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Manutenção</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inativa</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Número da Unidade</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell className="font-medium">{unit.unit_number}</TableCell>
              <TableCell>
                {unit.address ? (
                  <>
                    {unit.address.name || `${unit.address.street}, ${unit.address.number}`}
                    <div className="text-xs text-gray-500">
                      {unit.address.city}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">Sem endereço</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(unit.status)}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="inline-flex items-center gap-1"
                  onClick={() => onViewUnit(unit)}
                >
                  <Eye size={14} />
                  Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="inline-flex items-center gap-1"
                  onClick={() => onEditUnit(unit)}
                >
                  <Pencil size={14} />
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

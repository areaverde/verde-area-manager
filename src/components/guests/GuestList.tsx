
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";

interface Guest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  document_id: string;
  notes: string | null;
}

interface GuestListProps {
  guests: Guest[];
  onViewGuest: (guest: Guest) => void;
  onEditGuest: (guest: Guest) => void;
}

export default function GuestList({ guests, onViewGuest, onEditGuest }: GuestListProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-medium">{guest.full_name}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="inline-flex items-center gap-1"
                  onClick={() => onViewGuest(guest)}
                >
                  <Eye size={14} />
                  Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="inline-flex items-center gap-1"
                  onClick={() => onEditGuest(guest)}
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

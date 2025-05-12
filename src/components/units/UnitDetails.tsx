
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface UnitDetailsProps {
  unit: {
    id: string;
    unit_number: string;
    description: string | null;
    status: string;
    address: {
      id: string;
      name: string;
      street: string;
      number: string;
      city: string;
    } | null;
  };
  onClose: () => void;
}

export default function UnitDetails({ unit, onClose }: UnitDetailsProps) {
  function getStatusBadge(status: string) {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Disponível</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-500">Ocupada</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500">Manutenção</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativa</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detalhes da Unidade</DialogTitle>
        <DialogDescription>
          Visualize as informações completas da unidade.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Número da Unidade</h3>
            <p className="mt-1 text-base font-medium">{unit.unit_number}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1">{getStatusBadge(unit.status)}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
          {unit.address ? (
            <div className="mt-1">
              <p className="font-medium">
                {unit.address.name || unit.address.street}
                {!unit.address.name && `, ${unit.address.number}`}
              </p>
              <p className="text-sm text-gray-500">{unit.address.city}</p>
            </div>
          ) : (
            <p className="mt-1 italic text-gray-500">Nenhum endereço associado</p>
          )}
        </div>
        
        {unit.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
            <p className="mt-1 whitespace-pre-line">{unit.description}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={onClose} 
          className="bg-green-700 hover:bg-green-800"
        >
          Fechar
        </Button>
      </div>
    </>
  );
}


import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface GuestDetailsProps {
  guest: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    document_id: string;
    notes: string | null;
  };
  onClose: () => void;
}

export default function GuestDetails({ guest, onClose }: GuestDetailsProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Detalhes do Hóspede</DialogTitle>
        <DialogDescription>
          Visualize as informações completas do hóspede.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
          <p className="mt-1 text-base font-medium">{guest.full_name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
            <p className="mt-1">{guest.phone}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{guest.email}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Documento (CPF/RG)</h3>
          <p className="mt-1">{guest.document_id}</p>
        </div>
        
        {guest.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Observações</h3>
            <p className="mt-1 whitespace-pre-line">{guest.notes}</p>
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

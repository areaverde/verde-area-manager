
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface GuestEmptyStateProps {
  onAddGuest: () => void;
}

export default function GuestEmptyState({ onAddGuest }: GuestEmptyStateProps) {
  return (
    <div className="text-center py-10">
      <div className="bg-gray-100 p-3 inline-flex items-center justify-center rounded-full mb-4">
        <Users size={24} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold">Nenhum hóspede encontrado</h3>
      <p className="text-gray-500 max-w-md mx-auto mt-1 mb-4">
        Você ainda não possui hóspedes cadastrados. Adicione seu primeiro hóspede para começar.
      </p>
      <Button 
        className="bg-green-700 hover:bg-green-800"
        onClick={onAddGuest}
      >
        Adicionar Hóspede
      </Button>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

interface UnitEmptyStateProps {
  onAddUnit: () => void;
}

export default function UnitEmptyState({ onAddUnit }: UnitEmptyStateProps) {
  return (
    <div className="text-center py-10">
      <div className="bg-gray-100 p-3 inline-flex items-center justify-center rounded-full mb-4">
        <Building size={24} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold">Nenhuma unidade encontrada</h3>
      <p className="text-gray-500 max-w-md mx-auto mt-1 mb-4">
        Você ainda não possui unidades cadastradas. Adicione sua primeira unidade para começar.
      </p>
      <Button 
        className="bg-green-700 hover:bg-green-800"
        onClick={onAddUnit}
      >
        Adicionar Unidade
      </Button>
    </div>
  );
}

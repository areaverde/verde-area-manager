
import { Button } from "@/components/ui/button";

interface GuestFormActionsProps {
  loading: boolean;
  mode: 'create' | 'edit';
  onCancel: () => void;
}

export default function GuestFormActions({ loading, mode, onCancel }: GuestFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        variant="outline"
        onClick={onCancel}
        type="button"
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={loading}
        className="bg-green-700 hover:bg-green-800"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <span>Salvando...</span>
          </div>
        ) : (
          <span>{mode === 'create' ? 'Criar Hóspede' : 'Atualizar Hóspede'}</span>
        )}
      </Button>
    </div>
  );
}

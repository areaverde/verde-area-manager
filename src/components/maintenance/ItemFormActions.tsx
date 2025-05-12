
import { Button } from "@/components/ui/button";

interface ItemFormActionsProps {
  mode: "create" | "edit";
  loading: boolean;
  onCancel: () => void;
}

export function ItemFormActions({
  mode,
  loading,
  onCancel,
}: ItemFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
        {loading ? (
          <div className="flex items-center">
            <span className="animate-spin mr-2">⟳</span>
            {mode === "create" ? "Adicionando..." : "Salvando..."}
          </div>
        ) : mode === "create" ? (
          "Adicionar Item"
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </div>
  );
}

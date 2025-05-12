
import { Button } from "@/components/ui/button";

interface MaintenanceFormActionsProps {
  mode: "create" | "edit";
  loading: boolean;
  onCancel: () => void;
}

export function MaintenanceFormActions({
  mode,
  loading,
  onCancel,
}: MaintenanceFormActionsProps) {
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
            {mode === "create" ? "Registrando..." : "Salvando..."}
          </div>
        ) : mode === "create" ? (
          "Registrar Manutenção"
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </div>
  );
}

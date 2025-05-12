
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMaintenanceForm } from "./useMaintenanceForm";
import { supabase } from "@/lib/supabase";
import { MaintenanceFormActions } from "./MaintenanceFormActions";

interface MaintenanceFormProps {
  initialData?: {
    id: string;
    unit_id: string;
    item_id: string | null;
    description: string;
    date_reported: string;
    date_completed: string | null;
    cost: number | null;
    service_provider: string | null;
    status: string;
    notes: string | null;
  } | null;
  mode: "create" | "edit";
  onCancel: () => void;
  onSuccess: () => void;
}

interface Unit {
  id: string;
  unit_number: string;
}

interface Item {
  id: string;
  name: string;
  type: string;
}

const statusOptions = [
  { value: "reported", label: "Reportado" },
  { value: "scheduled", label: "Agendado" },
  { value: "in_progress", label: "Em Andamento" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
];

export function MaintenanceForm({ initialData, mode, onCancel, onSuccess }: MaintenanceFormProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialData?.unit_id || "");
  
  const { form, loading, showCompletedFields, onSubmit } = useMaintenanceForm({
    maintenance: initialData,
    mode,
    onSuccess,
  });

  // Load units
  useEffect(() => {
    async function fetchUnits() {
      const { data, error } = await supabase
        .from("units")
        .select("id, unit_number")
        .order("unit_number");

      if (error) {
        console.error("Error fetching units:", error);
      } else {
        setUnits(data || []);
      }
    }

    fetchUnits();
  }, []);

  // Load items for the selected unit
  useEffect(() => {
    async function fetchItems() {
      if (!selectedUnitId) {
        setItems([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("items")
        .select("id, name, type")
        .eq("unit_id", selectedUnitId)
        .order("name");

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
    }

    fetchItems();
  }, [selectedUnitId]);

  // Update items when unit changes
  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    form.setValue("item_id", ""); // Clear selected item when unit changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unit Selection */}
          <FormField
            control={form.control}
            name="unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleUnitChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma unidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.unit_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Item Selection (Optional) */}
          <FormField
            control={form.control}
            name="item_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item (opcional)</FormLabel>
                <Select
                  disabled={loading || items.length === 0}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        items.length === 0 
                          ? "Selecione uma unidade primeiro" 
                          : "Selecione um item (opcional)"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum item específico</SelectItem>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição do problema"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Reported */}
          <FormField
            control={form.control}
            name="date_reported"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Reportada</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fields shown only when status is "completed" */}
          {showCompletedFields && (
            <>
              {/* Date Completed */}
              <FormField
                control={form.control}
                name="date_completed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Conclusão</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cost */}
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        disabled={loading}
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Provider */}
              <FormField
                control={form.control}
                name="service_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prestador de Serviço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do prestador de serviço"
                        disabled={loading}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Observações sobre a manutenção"
                    disabled={loading}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <MaintenanceFormActions
          mode={mode}
          loading={loading}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}

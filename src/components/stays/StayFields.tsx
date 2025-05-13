
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FormSelectField } from "@/components/common/FormSelectField";
import { FormTextField } from "@/components/common/FormTextField";
import { FormDateField } from "@/components/common/FormDateField";

interface Unit {
  id: string;
  unit_number: string;
  status: string;
}

interface Guest {
  id: string;
  full_name: string;
}

interface StayFieldsProps {
  form: any;
  mode: "create" | "edit";
  loading: boolean;
  initialUnitId?: string;
}

export function StayFields({ form, mode, loading, initialUnitId }: StayFieldsProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  // Load available units and all guests
  useEffect(() => {
    async function fetchData() {
      // Fetch available units
      const { data: unitsData, error: unitsError } = await supabase
        .from("units")
        .select("id, unit_number, status")
        .or(mode === "edit" && initialUnitId ? 
          `status.eq.available,id.eq.${initialUnitId}` : 
          "status.eq.available");

      if (unitsError) {
        console.error("Error fetching units:", unitsError);
      } else {
        setUnits(unitsData || []);
      }

      // Fetch all guests
      const { data: guestsData, error: guestsError } = await supabase
        .from("guests")
        .select("id, full_name")
        .order("full_name", { ascending: true });

      if (guestsError) {
        console.error("Error fetching guests:", guestsError);
      } else {
        setGuests(guestsData || []);
      }
    }

    fetchData();
  }, [initialUnitId, mode]);

  const unitOptions = units.map(unit => ({
    value: unit.id,
    label: unit.unit_number
  }));

  const guestOptions = guests.map(guest => ({
    value: guest.id,
    label: guest.full_name
  }));

  const statusOptions = [
    { value: "active", label: "Ativa" },
    { value: "completed", label: "Finalizada" },
    { value: "cancelled", label: "Cancelada" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormSelectField
        form={form}
        name="unit_id"
        label="Unidade"
        options={unitOptions}
        placeholder="Selecione uma unidade"
        disabled={loading}
        required={true}
      />

      <FormSelectField
        form={form}
        name="guest_id"
        label="Hóspede"
        options={guestOptions}
        placeholder="Selecione um hóspede"
        disabled={loading}
        required={true}
      />

      <FormDateField
        form={form}
        name="start_date"
        label="Data de Entrada"
        disabled={loading}
        required={true}
      />

      <FormDateField
        form={form}
        name="end_date"
        label="Data de Saída Prevista (opcional)"
        disabled={loading}
      />

      <FormTextField
        form={form}
        name="monthly_rent"
        label="Valor Mensal (R$)"
        type="number"
        disabled={loading}
        required={true}
      />

      <FormSelectField
        form={form}
        name="status"
        label="Status"
        options={statusOptions}
        disabled={loading}
        required={true}
      />
    </div>
  );
}


import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FormSelectField } from "@/components/common/FormSelectField";

interface Unit {
  id: string;
  unit_number: string;
}

interface MaintenanceUnitSelectorProps {
  form: any;
  loading: boolean;
  onUnitChange: (unitId: string) => void;
}

export function MaintenanceUnitSelector({ 
  form, 
  loading, 
  onUnitChange 
}: MaintenanceUnitSelectorProps) {
  const [units, setUnits] = useState<Unit[]>([]);

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

  const unitOptions = units.map(unit => ({
    value: unit.id,
    label: unit.unit_number
  }));

  return (
    <FormSelectField
      form={form}
      name="unit_id"
      label="Unidade"
      options={unitOptions}
      placeholder="Selecione uma unidade"
      disabled={loading}
      required={true}
      onValueChange={onUnitChange}
    />
  );
}

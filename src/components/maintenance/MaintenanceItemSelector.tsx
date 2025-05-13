
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FormSelectField } from "@/components/common/FormSelectField";

interface Item {
  id: string;
  name: string;
  type: string;
}

interface MaintenanceItemSelectorProps {
  form: any;
  loading: boolean;
  unitId: string;
}

export function MaintenanceItemSelector({ 
  form, 
  loading, 
  unitId 
}: MaintenanceItemSelectorProps) {
  const [items, setItems] = useState<Item[]>([]);

  // Load items for the selected unit
  useEffect(() => {
    async function fetchItems() {
      if (!unitId) {
        setItems([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("items")
        .select("id, name, type")
        .eq("unit_id", unitId)
        .order("name");

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
    }

    fetchItems();
  }, [unitId]);

  const itemOptions = [
    { value: "", label: "Nenhum item específico" },
    ...items.map(item => ({
      value: item.id,
      label: `${item.name} (${item.type})`
    }))
  ];

  return (
    <FormSelectField
      form={form}
      name="item_id"
      label="Item (opcional)"
      options={itemOptions}
      placeholder={
        items.length === 0 
          ? "Selecione uma unidade primeiro" 
          : "Selecione um item (opcional)"
      }
      disabled={loading || items.length === 0}
    />
  );
}

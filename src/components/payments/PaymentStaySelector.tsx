
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Stay {
  id: string;
  monthly_rent: number;
  units: {
    unit_number: string;
  };
  guests: {
    full_name: string;
  };
}

interface PaymentStaySelectorProps {
  form: any;
  loading: boolean;
  mode: "create" | "edit";
  onSelectedStayChange: (stay: Stay | undefined) => void;
}

export function PaymentStaySelector({ 
  form, 
  loading, 
  mode,
  onSelectedStayChange 
}: PaymentStaySelectorProps) {
  const [stays, setStays] = useState<Stay[]>([]);
  
  // Load active stays
  useEffect(() => {
    async function fetchStays() {
      const { data, error } = await supabase
        .from("stays")
        .select(`
          id,
          monthly_rent,
          units:unit_id(unit_number),
          guests:guest_id(full_name)
        `)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching stays:", error);
      } else {
        setStays(data || []);
        
        // If there's a selected stay, trigger the callback
        const stayId = form.getValues("stay_id");
        if (stayId) {
          const selectedStay = data?.find(stay => stay.id === stayId);
          if (selectedStay) {
            onSelectedStayChange(selectedStay);
          }
        }
      }
    }

    fetchStays();
  }, [form, onSelectedStayChange]);

  // Handle stay selection change
  const handleStayChange = (stayId: string) => {
    const selectedStay = stays.find(stay => stay.id === stayId);
    onSelectedStayChange(selectedStay);
  };

  return (
    <FormField
      control={form.control}
      name="stay_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estadia</FormLabel>
          <Select
            disabled={loading || mode === "edit"}
            onValueChange={(value) => {
              field.onChange(value);
              handleStayChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma estadia" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {stays.map((stay) => (
                <SelectItem key={stay.id} value={stay.id}>
                  {stay.units.unit_number} - {stay.guests.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UnitFormValues } from "./UnitSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnitStatusFieldProps {
  form: UseFormReturn<UnitFormValues>;
  loading: boolean;
}

export default function UnitStatusField({ form, loading }: UnitStatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status *</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="occupied">Ocupada</SelectItem>
              <SelectItem value="maintenance">Em Manutenção</SelectItem>
              <SelectItem value="inactive">Inativa</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

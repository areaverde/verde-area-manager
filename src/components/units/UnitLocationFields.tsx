
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

interface UnitLocationFieldsProps {
  form: UseFormReturn<UnitFormValues>;
  addresses: Array<{ id: string; name: string; street: string; number: string }>;
  loading: boolean;
}

export default function UnitLocationFields({ form, addresses, loading }: UnitLocationFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="address_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Endereço *</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um endereço" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    {address.name || `${address.street}, ${address.number}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  Nenhum endereço encontrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

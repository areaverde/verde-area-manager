
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AddressFormValues } from "./AddressSchema";

type AddressLocationFieldsProps = {
  form: UseFormReturn<AddressFormValues>;
};

export function AddressLocationFields({ form }: AddressLocationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade *</FormLabel>
            <FormControl>
              <Input placeholder="Nome da cidade" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado *</FormLabel>
            <FormControl>
              <Input placeholder="Nome do estado" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

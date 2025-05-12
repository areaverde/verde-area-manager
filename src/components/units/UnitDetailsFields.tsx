
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { UnitFormValues } from "./UnitSchema";

interface UnitDetailsFieldsProps {
  form: UseFormReturn<UnitFormValues>;
}

export default function UnitDetailsFields({ form }: UnitDetailsFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="unit_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da Unidade *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Casa 101, Apt 202, etc" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informações adicionais sobre a unidade" 
                className="min-h-[100px]" 
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { GuestFormValues } from "./GuestSchema";

interface GuestDocumentFieldsProps {
  form: UseFormReturn<GuestFormValues>;
}

export default function GuestDocumentFields({ form }: GuestDocumentFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="document_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Documento (CPF/RG) *</FormLabel>
            <FormControl>
              <Input placeholder="Digite o número do documento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informações adicionais sobre o hóspede" 
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

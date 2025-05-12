
import * as z from "zod";

export const addressSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  street: z.string().min(1, "A rua é obrigatória"),
  number: z.string().min(1, "O número é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  zip_code: z.string().min(1, "O CEP é obrigatório"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

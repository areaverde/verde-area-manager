
import { z } from "zod";

export const staySchema = z.object({
  unit_id: z.string().uuid().nonempty("Unidade é obrigatória"),
  guest_id: z.string().uuid().nonempty("Hóspede é obrigatório"),
  start_date: z.string().nonempty("Data de entrada é obrigatória"),
  end_date: z.string().optional(),
  monthly_rent: z.coerce.number().min(1, "Valor deve ser maior que zero"),
  status: z.enum(["active", "completed", "cancelled"]),
});

export type StayFormValues = z.infer<typeof staySchema>;

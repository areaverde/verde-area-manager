
import { z } from "zod";

export const itemSchema = z.object({
  unit_id: z.string().uuid().nonempty("Unidade é obrigatória"),
  name: z.string().nonempty("Nome é obrigatório"),
  type: z.string().nonempty("Tipo é obrigatório"),
  brand: z.string().optional(),
  model: z.string().optional(),
  purchase_date: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor", "broken"]),
  notes: z.string().optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

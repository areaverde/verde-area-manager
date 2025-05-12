
import * as z from "zod";

export const unitSchema = z.object({
  unit_number: z.string().min(1, "O número da unidade é obrigatório"),
  address_id: z.string().min(1, "O endereço é obrigatório"),
  description: z.string().nullable().optional(),
  status: z.enum(["available", "occupied", "maintenance", "inactive"], {
    required_error: "O status é obrigatório",
  }),
});

export type UnitFormValues = z.infer<typeof unitSchema>;

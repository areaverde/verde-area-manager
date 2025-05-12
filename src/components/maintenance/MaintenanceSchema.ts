
import { z } from "zod";

export const maintenanceSchema = z.object({
  unit_id: z.string().uuid().nonempty("Unidade é obrigatória"),
  item_id: z.string().uuid().optional(),
  description: z.string().nonempty("Descrição é obrigatória"),
  date_reported: z.string().nonempty("Data de reporte é obrigatória"),
  date_completed: z.string().optional(),
  cost: z.coerce.number().optional(),
  service_provider: z.string().optional(),
  status: z.enum(["reported", "scheduled", "in_progress", "completed", "cancelled"]),
  notes: z.string().optional(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

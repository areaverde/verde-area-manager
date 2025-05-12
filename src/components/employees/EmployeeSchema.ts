
import { z } from "zod";

export const employeeSchema = z.object({
  full_name: z.string().nonempty("Nome completo é obrigatório"),
  role: z.enum(["manager", "receptionist", "cleaner", "maintenance", "security", "other"]),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  start_date: z.string().nonempty("Data de início é obrigatória"),
  end_date: z.string().optional(),
  salary: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

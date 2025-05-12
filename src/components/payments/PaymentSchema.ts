
import { z } from "zod";

export const paymentSchema = z.object({
  stay_id: z.string().uuid().nonempty("Estadia é obrigatória"),
  payment_date: z.string().nonempty("Data de pagamento é obrigatória"),
  amount_paid: z.coerce.number().min(1, "Valor deve ser maior que zero"),
  reference_month: z.coerce.number().min(1).max(12, "Mês deve estar entre 1 e 12"),
  reference_year: z.coerce.number().min(2000).max(2100, "Ano deve estar entre 2000 e 2100"),
  status: z.enum(["paid", "pending", "overdue", "cancelled"]),
  notes: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

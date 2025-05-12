
import * as z from "zod";

export const guestSchema = z.object({
  full_name: z.string().min(1, "O nome completo é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  email: z.string().email("Por favor, insira um e-mail válido"),
  document_id: z.string().min(1, "O documento é obrigatório"),
  notes: z.string().nullable().optional(),
});

export type GuestFormValues = z.infer<typeof guestSchema>;

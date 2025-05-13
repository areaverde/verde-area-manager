
import { supabase } from "@/lib/supabase";
import { PaymentFormValues } from "./PaymentSchema";
import { submitToDatabase } from "@/hooks/useDatabaseSubmission";

/**
 * Operations specific to payment records
 */
export const paymentOperations = {
  /**
   * Create a new payment record
   */
  create: async (userId: string, formData: PaymentFormValues) => {
    const paymentData = {
      stay_id: formData.stay_id,
      payment_date: formData.payment_date,
      amount_paid: formData.amount_paid,
      reference_month: formData.reference_month,
      reference_year: formData.reference_year,
      status: formData.status,
      notes: formData.notes,
    };
    
    await submitToDatabase.create('payments', paymentData, userId);
  },

  /**
   * Update an existing payment record
   */
  update: async (paymentId: string, userId: string, formData: PaymentFormValues) => {
    const updateData = {
      stay_id: formData.stay_id,
      payment_date: formData.payment_date,
      amount_paid: formData.amount_paid,
      reference_month: formData.reference_month,
      reference_year: formData.reference_year,
      status: formData.status,
      notes: formData.notes,
    };
    
    await submitToDatabase.update('payments', paymentId, updateData, userId);
  }
};

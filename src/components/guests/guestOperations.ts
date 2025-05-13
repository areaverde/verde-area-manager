
import { supabase } from "@/lib/supabase";
import { GuestFormValues } from "./GuestSchema";
import { submitToDatabase } from "@/hooks/useDatabaseSubmission";

/**
 * Operations specific to guests
 */
export const guestOperations = {
  /**
   * Create a new guest record
   */
  create: async (userId: string, formData: GuestFormValues) => {
    const guestData = {
      full_name: formData.full_name,
      phone: formData.phone,
      email: formData.email,
      document_id: formData.document_id,
      notes: formData.notes,
    };
    
    await submitToDatabase.create('guests', guestData, userId);
  },

  /**
   * Update an existing guest record
   */
  update: async (guestId: string, userId: string, formData: GuestFormValues) => {
    const updateData = {
      full_name: formData.full_name,
      phone: formData.phone,
      email: formData.email,
      document_id: formData.document_id,
      notes: formData.notes,
    };
    
    await submitToDatabase.update('guests', guestId, updateData, userId);
  }
};


import { supabase } from "@/lib/supabase";
import { StayFormValues } from "./StaySchema";
import { submitToDatabase } from "@/hooks/useDatabaseSubmission";

/**
 * Operations specific to stays
 */
export const stayOperations = {
  /**
   * Create a new stay and update unit status
   */
  create: async (userId: string, formData: StayFormValues) => {
    const stayData = {
      unit_id: formData.unit_id,
      guest_id: formData.guest_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      monthly_rent: formData.monthly_rent,
      status: formData.status,
    };
    
    // Insert the stay record
    const { data: newStay, error: stayError } = await supabase
      .from('stays')
      .insert({
        ...stayData,
        created_by: userId,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (stayError) throw stayError;
    
    // Update the unit status to occupied
    await stayOperations.updateUnitStatus(formData.unit_id, 'occupied', userId);
  },

  /**
   * Update an existing stay
   */
  update: async (stayId: string, userId: string, formData: StayFormValues, originalUnitId: string) => {
    const updateData = {
      unit_id: formData.unit_id,
      guest_id: formData.guest_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      monthly_rent: formData.monthly_rent,
      status: formData.status,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    };
    
    // Update the stay record
    const { error: stayError } = await supabase
      .from('stays')
      .update(updateData)
      .eq('id', stayId);
      
    if (stayError) throw stayError;
    
    // Handle unit status updates
    await stayOperations.handleUnitStatusChanges(
      originalUnitId, 
      formData.unit_id, 
      formData.status, 
      userId
    );
  },

  /**
   * Finalize a stay by updating its status and freeing up the unit
   */
  finalize: async (stayId: string, unitId: string, userId: string) => {
    // Update the stay status to completed
    const { error: stayError } = await supabase
      .from('stays')
      .update({
        status: 'completed',
        end_date: new Date().toISOString().split('T')[0],
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stayId);
      
    if (stayError) throw stayError;
    
    // Update the unit status to available
    await stayOperations.updateUnitStatus(unitId, 'available', userId);
  },
  
  /**
   * Update unit status
   */
  updateUnitStatus: async (unitId: string, status: 'occupied' | 'available', userId: string) => {
    const { error } = await supabase
      .from('units')
      .update({
        status,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', unitId);
      
    if (error) throw error;
  },
  
  /**
   * Handle unit status updates when unit or stay status changes
   */
  handleUnitStatusChanges: async (
    originalUnitId: string, 
    newUnitId: string, 
    stayStatus: string, 
    userId: string
  ) => {
    if (originalUnitId !== newUnitId) {
      // Free up the old unit
      await stayOperations.updateUnitStatus(originalUnitId, 'available', userId);
      
      // Occupy the new unit if status is active
      if (stayStatus === 'active') {
        await stayOperations.updateUnitStatus(newUnitId, 'occupied', userId);
      }
    } else if (stayStatus !== 'active') {
      // If status changed to completed or cancelled, free up the unit
      await stayOperations.updateUnitStatus(newUnitId, 'available', userId);
    }
  }
};

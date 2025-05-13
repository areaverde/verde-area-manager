
import { supabase } from "@/lib/supabase";
import { MaintenanceFormValues } from "./MaintenanceSchema";
import { submitToDatabase } from "@/hooks/useDatabaseSubmission";

/**
 * Operations specific to maintenance logs
 */
export const maintenanceOperations = {
  /**
   * Create a new maintenance log
   */
  create: async (userId: string, formData: MaintenanceFormValues) => {
    const maintenanceData = maintenanceOperations.prepareFormData(formData);
    
    await submitToDatabase.create('maintenance_logs', maintenanceData, userId);
  },

  /**
   * Update an existing maintenance log
   */
  update: async (maintenanceId: string, userId: string, formData: MaintenanceFormValues) => {
    const updateData = maintenanceOperations.prepareFormData(formData);
    
    await submitToDatabase.update('maintenance_logs', maintenanceId, updateData, userId);
  },
  
  /**
   * Prepare form data by handling conditional fields based on status
   */
  prepareFormData: (formData: MaintenanceFormValues) => {
    // If status is not completed, clear completed-related fields
    const preparedData = { ...formData };
    
    if (preparedData.status !== "completed") {
      preparedData.date_completed = undefined;
      preparedData.cost = undefined;
      preparedData.service_provider = undefined;
    }
    
    return {
      unit_id: preparedData.unit_id,
      item_id: preparedData.item_id || null,
      description: preparedData.description,
      date_reported: preparedData.date_reported,
      date_completed: preparedData.date_completed || null,
      cost: preparedData.cost || null,
      service_provider: preparedData.service_provider || null,
      status: preparedData.status,
      notes: preparedData.notes || null,
    };
  }
};

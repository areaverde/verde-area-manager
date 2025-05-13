
import { supabase } from "@/lib/supabase";

/**
 * Utility for handling common database operations
 */
export const submitToDatabase = {
  /**
   * Create a new record in a specified table
   */
  create: async <T extends Record<string, any>>(
    table: string, 
    data: T, 
    userId: string
  ) => {
    const recordData = {
      ...data,
      created_by: userId,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from(table)
      .insert(recordData);
      
    if (error) throw error;
  },

  /**
   * Update an existing record in a specified table
   */
  update: async <T extends Record<string, any>>(
    table: string, 
    id: string, 
    data: T, 
    userId: string
  ) => {
    const updateData = {
      ...data,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id);
      
    if (error) throw error;
  }
};

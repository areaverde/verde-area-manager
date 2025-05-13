
import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/lib/supabase";

type TableName = keyof Tables;

/**
 * Utility for handling common database operations
 */
export const submitToDatabase = {
  /**
   * Create a new record in a specified table
   */
  create: async <T extends Record<string, any>>(
    table: TableName, 
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
      .insert(recordData as any);
      
    if (error) throw error;
  },

  /**
   * Update an existing record in a specified table
   */
  update: async <T extends Record<string, any>>(
    table: TableName, 
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
      .update(updateData as any)
      .eq('id', id);
      
    if (error) throw error;
  }
};

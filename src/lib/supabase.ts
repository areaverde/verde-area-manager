
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://vnluarrexswqzakywlow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubHVhcnJleHN3cXpha3l3bG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzM3OTgsImV4cCI6MjA2MjY0OTc5OH0.zRDt0GRVh1YyTcv5WGukV4dzKtyiBMVm7AMQ_4_uIkg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

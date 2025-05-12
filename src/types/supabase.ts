
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: string
          name: string
          street: string
          number: string
          neighborhood: string
          city: string
          state: string
          zip_code: string
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          name: string
          street: string
          number: string
          neighborhood: string
          city: string
          state: string
          zip_code: string
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          street?: string
          number?: string
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      units: {
        Row: {
          id: string
          address_id: string
          unit_number: string
          description: string | null
          status: string
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          address_id: string
          unit_number: string
          description?: string | null
          status: string
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          address_id?: string
          unit_number?: string
          description?: string | null
          status?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_address_id_fkey"
            columns: ["address_id"]
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      guests: {
        Row: {
          id: string
          full_name: string
          phone: string
          email: string
          document_id: string
          notes: string | null
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          full_name: string
          phone: string
          email: string
          document_id: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          email?: string
          document_id?: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stays: {
        Row: {
          id: string
          unit_id: string
          guest_id: string
          start_date: string
          end_date: string | null
          monthly_rent: number
          status: string
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          unit_id: string
          guest_id: string
          start_date: string
          end_date?: string | null
          monthly_rent: number
          status: string
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          unit_id?: string
          guest_id?: string
          start_date?: string
          end_date?: string | null
          monthly_rent?: number
          status?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stays_unit_id_fkey"
            columns: ["unit_id"]
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stays_guest_id_fkey"
            columns: ["guest_id"]
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stays_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stays_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          stay_id: string
          payment_date: string
          amount_paid: number
          reference_month: number
          reference_year: number
          status: string
          notes: string | null
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          stay_id: string
          payment_date: string
          amount_paid: number
          reference_month: number
          reference_year: number
          status: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          stay_id?: string
          payment_date?: string
          amount_paid?: number
          reference_month?: number
          reference_year?: number
          status?: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_stay_id_fkey"
            columns: ["stay_id"]
            referencedRelation: "stays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      items: {
        Row: {
          id: string
          unit_id: string
          name: string
          type: string
          brand: string | null
          model: string | null
          purchase_date: string | null
          condition: string
          notes: string | null
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          unit_id: string
          name: string
          type: string
          brand?: string | null
          model?: string | null
          purchase_date?: string | null
          condition: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          type?: string
          brand?: string | null
          model?: string | null
          purchase_date?: string | null
          condition?: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_unit_id_fkey"
            columns: ["unit_id"]
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      maintenance_logs: {
        Row: {
          id: string
          unit_id: string
          item_id: string | null
          description: string
          date_reported: string
          date_completed: string | null
          cost: number | null
          service_provider: string | null
          status: string
          notes: string | null
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          unit_id: string
          item_id?: string | null
          description: string
          date_reported: string
          date_completed?: string | null
          cost?: number | null
          service_provider?: string | null
          status: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          unit_id?: string
          item_id?: string | null
          description?: string
          date_reported?: string
          date_completed?: string | null
          cost?: number | null
          service_provider?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_unit_id_fkey"
            columns: ["unit_id"]
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      employees: {
        Row: {
          id: string
          full_name: string
          role: string
          phone: string | null
          email: string | null
          start_date: string
          end_date: string | null
          salary: number | null
          notes: string | null
          created_at: string
          created_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          full_name: string
          role: string
          phone?: string | null
          email?: string | null
          start_date: string
          end_date?: string | null
          salary?: number | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          role?: string
          phone?: string | null
          email?: string | null
          start_date?: string
          end_date?: string | null
          salary?: number | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

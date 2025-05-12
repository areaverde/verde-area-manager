export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at: string | null
          updated_by: string | null
          zip_code: string
        }
        Insert: {
          city: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at?: string | null
          updated_by?: string | null
          zip_code: string
        }
        Update: {
          city?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          updated_at?: string | null
          updated_by?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          end_date: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"]
          salary: number | null
          start_date: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          end_date?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          salary?: number | null
          start_date: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          end_date?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          salary?: number | null
          start_date?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          brand: string | null
          condition: Database["public"]["Enums"]["item_condition"]
          created_at: string
          created_by: string | null
          id: string
          model: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          type: string
          unit_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          brand?: string | null
          condition?: Database["public"]["Enums"]["item_condition"]
          created_at?: string
          created_by?: string | null
          id?: string
          model?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          type: string
          unit_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          brand?: string | null
          condition?: Database["public"]["Enums"]["item_condition"]
          created_at?: string
          created_by?: string | null
          id?: string
          model?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          type?: string
          unit_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          cost: number | null
          created_at: string
          created_by: string | null
          date_completed: string | null
          date_reported: string
          description: string
          id: string
          item_id: string | null
          notes: string | null
          service_provider: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          unit_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          created_by?: string | null
          date_completed?: string | null
          date_reported: string
          description: string
          id?: string
          item_id?: string | null
          notes?: string | null
          service_provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          unit_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          created_by?: string | null
          date_completed?: string | null
          date_reported?: string
          description?: string
          id?: string
          item_id?: string | null
          notes?: string | null
          service_provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          unit_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_paid: number
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          payment_date: string
          reference_month: number
          reference_year: number
          status: Database["public"]["Enums"]["payment_status"]
          stay_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          reference_month: number
          reference_year: number
          status?: Database["public"]["Enums"]["payment_status"]
          stay_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          reference_month?: number
          reference_year?: number
          status?: Database["public"]["Enums"]["payment_status"]
          stay_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_stay_id_fkey"
            columns: ["stay_id"]
            isOneToOne: false
            referencedRelation: "stays"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stays: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string | null
          guest_id: string
          id: string
          monthly_rent: number
          start_date: string
          status: Database["public"]["Enums"]["stay_status"]
          unit_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          guest_id: string
          id?: string
          monthly_rent: number
          start_date: string
          status?: Database["public"]["Enums"]["stay_status"]
          unit_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          guest_id?: string
          id?: string
          monthly_rent?: number
          start_date?: string
          status?: Database["public"]["Enums"]["stay_status"]
          unit_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stays_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stays_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          address_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          status: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
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
      employee_role:
        | "manager"
        | "receptionist"
        | "cleaner"
        | "maintenance"
        | "security"
        | "other"
      item_condition: "excellent" | "good" | "fair" | "poor" | "broken"
      maintenance_status:
        | "reported"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      stay_status: "active" | "completed" | "cancelled"
      unit_status: "available" | "occupied" | "maintenance" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employee_role: [
        "manager",
        "receptionist",
        "cleaner",
        "maintenance",
        "security",
        "other",
      ],
      item_condition: ["excellent", "good", "fair", "poor", "broken"],
      maintenance_status: [
        "reported",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "overdue", "cancelled"],
      stay_status: ["active", "completed", "cancelled"],
      unit_status: ["available", "occupied", "maintenance", "inactive"],
    },
  },
} as const

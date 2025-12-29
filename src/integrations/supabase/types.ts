export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      connected_devices: {
        Row: {
          created_at: string | null
          device_name: string
          device_type: string
          id: string
          last_active: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_name: string
          device_type: string
          id?: string
          last_active?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_name?: string
          device_type?: string
          id?: string
          last_active?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connected_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          created_at: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          location: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_sources: {
        Row: {
          amount: number | null
          created_at: string
          credit_limit: number | null
          display_name: string | null
          due_date: string | null
          id: string
          interest_rate: number | null
          last_four_digits: string | null
          linked: boolean | null
          name: string
          statement_date: string | null
          type: string
          updated_at: string
          upi_apps: string[] | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          credit_limit?: number | null
          display_name?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          last_four_digits?: string | null
          linked?: boolean | null
          name: string
          statement_date?: string | null
          type: string
          updated_at?: string
          upi_apps?: string[] | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          credit_limit?: number | null
          display_name?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          last_four_digits?: string | null
          linked?: boolean | null
          name?: string
          statement_date?: string | null
          type?: string
          updated_at?: string
          upi_apps?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          biometric_credentials: Json | null
          created_at: string
          currency_format: string | null
          data_sharing: boolean | null
          date_of_birth: string | null
          due_reminders: boolean | null
          first_name: string | null
          id: string
          language: string | null
          last_name: string | null
          notification_time: string | null
          phone_number: string | null
          pin_hash: string | null
          preferred_auth_method: string | null
          text_size: string | null
          theme: string | null
          timezone: string | null
          transaction_alerts: boolean | null
          trusted_devices: Json[] | null
          updated_at: string
          weekly_reports: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          biometric_credentials?: Json | null
          created_at?: string
          currency_format?: string | null
          data_sharing?: boolean | null
          date_of_birth?: string | null
          due_reminders?: boolean | null
          first_name?: string | null
          id: string
          language?: string | null
          last_name?: string | null
          notification_time?: string | null
          phone_number?: string | null
          pin_hash?: string | null
          preferred_auth_method?: string | null
          text_size?: string | null
          theme?: string | null
          timezone?: string | null
          transaction_alerts?: boolean | null
          trusted_devices?: Json[] | null
          updated_at?: string
          weekly_reports?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          biometric_credentials?: Json | null
          created_at?: string
          currency_format?: string | null
          data_sharing?: boolean | null
          date_of_birth?: string | null
          due_reminders?: boolean | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          notification_time?: string | null
          phone_number?: string | null
          pin_hash?: string | null
          preferred_auth_method?: string | null
          text_size?: string | null
          theme?: string | null
          timezone?: string | null
          transaction_alerts?: boolean | null
          trusted_devices?: Json[] | null
          updated_at?: string
          weekly_reports?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          audit_trail: Json[] | null
          base_source_id: string
          category: string
          created_at: string
          date: string
          description: string | null
          display_source: string | null
          excuse_reason: string | null
          id: string
          last_reminder_sent: string | null
          next_occurrence_date: string | null
          next_reminder_date: string | null
          original_transaction_id: string | null
          parent_transaction_id: string | null
          previous_status: string | null
          reference_id: string | null
          reference_type: string | null
          remaining_balance: number | null
          reminder_count: number | null
          repayment_date: string | null
          repeat_frequency: string | null
          repeat_until: string | null
          source: string
          status: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          audit_trail?: Json[] | null
          base_source_id: string
          category: string
          created_at?: string
          date?: string
          description?: string | null
          display_source?: string | null
          excuse_reason?: string | null
          id?: string
          last_reminder_sent?: string | null
          next_occurrence_date?: string | null
          next_reminder_date?: string | null
          original_transaction_id?: string | null
          parent_transaction_id?: string | null
          previous_status?: string | null
          reference_id?: string | null
          reference_type?: string | null
          remaining_balance?: number | null
          reminder_count?: number | null
          repayment_date?: string | null
          repeat_frequency?: string | null
          repeat_until?: string | null
          source: string
          status?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          audit_trail?: Json[] | null
          base_source_id?: string
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          display_source?: string | null
          excuse_reason?: string | null
          id?: string
          last_reminder_sent?: string | null
          next_occurrence_date?: string | null
          next_reminder_date?: string | null
          original_transaction_id?: string | null
          parent_transaction_id?: string | null
          previous_status?: string | null
          reference_id?: string | null
          reference_type?: string | null
          remaining_balance?: number | null
          reminder_count?: number | null
          repayment_date?: string | null
          repeat_frequency?: string | null
          repeat_until?: string | null
          source?: string
          status?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_base_source_fkey"
            columns: ["base_source_id"]
            isOneToOne: false
            referencedRelation: "payment_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_original_transaction_id_fkey"
            columns: ["original_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_amount: {
        Args: { decrement_by: number; source_id: string }
        Returns: number
      }
      increment_amount: {
        Args: { increment_by: number; source_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

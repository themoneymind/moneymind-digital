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
        Args: {
          source_id: string
          decrement_by: number
        }
        Returns: number
      }
      increment_amount: {
        Args: {
          source_id: string
          increment_by: number
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

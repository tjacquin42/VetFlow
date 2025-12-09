import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Type exports for database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          clinic: string | null;
          phone: string | null;
          plan: 'free' | 'premium' | 'clinic';
          subscription_date: string | null;
          subscription_expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      croquettes: {
        Row: {
          id: string;
          brand: string;
          name: string;
          range: string;
          species: 'dog' | 'cat' | 'both';
          type: string;
          kcal_per_100g: number;
          protein: number | null;
          fat: number | null;
          fiber: number | null;
          product_url: string;
          approximate_price: number | null;
          availability: 'france' | 'europe';
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['croquettes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['croquettes']['Insert']>;
      };
      calculs: {
        Row: {
          id: string;
          user_id: string;
          animal_name: string | null;
          species: 'dog' | 'cat';
          weight: number;
          age_years: number;
          age_months: number;
          is_neutered: boolean;
          body_score: number;
          goal: 'maintenance' | 'weight-loss' | 'weight-gain' | 'growth';
          activity_level: 'low' | 'moderate' | 'high';
          physiological_status: 'normal' | 'gestation' | 'lactation' | 'senior';
          rer: number;
          mer: number;
          factor: number;
          selected_croquettes: any; // JSONB
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['calculs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['calculs']['Insert']>;
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          calculation_count: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['usage_tracking']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['usage_tracking']['Insert']>;
      };
    };
  };
};

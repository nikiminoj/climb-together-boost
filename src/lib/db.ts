
// For browser compatibility, we'll use Supabase's database functions
// instead of direct postgres connection
import { supabase } from '@/integrations/supabase/client';

// Export supabase client for database operations
export const db = supabase;

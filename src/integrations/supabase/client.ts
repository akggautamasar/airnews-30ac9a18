// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://axqiqnrpdqqnijynagwb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cWlxbnJwZHFxbmlqeW5hZ3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NzU0ODQsImV4cCI6MjA1MjQ1MTQ4NH0.H4bn9VeQ7oJyNycp8vfnszikG8gr2dtfKOHZ91jXp_M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
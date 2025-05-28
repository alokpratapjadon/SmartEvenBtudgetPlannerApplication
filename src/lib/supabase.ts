import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myrvupqjneviypnqqjhy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnZ1cHFqbmV2aXlwbnFxamh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTQ3MzgsImV4cCI6MjA2NDAzMDczOH0.eyzpTL-qnTIMeqO8QtFpicn_Fwdn0EmFUzbZoIA3YKk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
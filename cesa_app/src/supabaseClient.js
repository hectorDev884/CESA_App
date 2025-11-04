import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fysfjscjaewotikomjjm.supabase.co"; // URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5c2Zqc2NqYWV3b3Rpa29tamptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTEzNDMsImV4cCI6MjA3NTk2NzM0M30.CJFAm93WZBGKfGLrNX1BSwQpn7DDzIMfstDHy59wuUY"; // clave pública

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

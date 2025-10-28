import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lrkpmnausxkvcuwmptqm.supabase.co"; // URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxya3BtbmF1c3hrdmN1d21wdHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTU2NjMsImV4cCI6MjA3Njg5MTY2M30.bSGx3cRDmRyp0WlYPC6yNuNAujC0F1GZXtVu76kb4rA"; // clave pública

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

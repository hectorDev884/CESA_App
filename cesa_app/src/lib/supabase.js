import { createClient } from '@supabase/supabase-js'

// 🔹 URL del proyecto Supabase (la copias desde tu panel)
const supabaseUrl = 'https://fysfjscjaewotikomjjm.supabase.co'

// 🔹 Clave pública (anon key), se guarda en variables de entorno
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// 🔹 Crear cliente de conexión
export const supabase = createClient(supabaseUrl, supabaseKey)

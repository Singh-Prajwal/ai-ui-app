import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hguyjryhzsddnprqvnxh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndXlqcnloenNkZG5wcnF2bnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MzE3MzEsImV4cCI6MjA2MzIwNzczMX0.TfM48igVKm-ooGDF_ymI6KV4kI_dbEsYUlNK2txoEhs";

export const supabase = createClient(supabaseUrl, supabaseKey!);

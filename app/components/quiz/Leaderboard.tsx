// backend/config/supabaseClient.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createClient } from "@supabase/supabase-js";

// 🧩 Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🔍 Quick environment check (only log in dev)
if (process.env.NODE_ENV !== "production") {
  console.log("🔧 Supabase Environment Check:");
  console.log("SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
  console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Set" : "❌ Missing");
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "✅ Set" : "❌ Missing"
  );
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing required Supabase environment variables");
}

// 🧠 Public Supabase client (safe to use for regular queries)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// 🛡️ Admin Supabase client (service role key — never expose to frontend)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

// 🧪 Connection test utility
export const testConnection = async () => {
  try {
    const { error } = await supabase.from("quiz_results").select("id").limit(1);
    if (error && error.code !== "PGRST116") throw error;
    console.log("✅ Supabase connected successfully!");
    return true;
  } catch (err) {
    console.error("❌ Supabase connection failed:", err instanceof Error ? err.message : 'Unknown error');
    return false;
  }
};

export default supabase;

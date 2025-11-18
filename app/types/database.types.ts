/**
 * Database TypeScript Types
 * 
 * This file will be auto-generated from the Supabase schema.
 * Run: npm run supabase:types
 * 
 * After creating database migrations, regenerate types with:
 * npx supabase gen types typescript --local > app/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tables will be generated here after running migrations
    }
    Views: {
      // Views will be generated here
    }
    Functions: {
      // Functions will be generated here
    }
    Enums: {
      // Enums will be generated here
    }
  }
}

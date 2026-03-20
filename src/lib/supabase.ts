import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Proposal {
  id: string;
  session_id: string;
  url: string;
  url_title: string | null;
  content: string;
  prompt_used: string | null;
  created_at: string;
  is_starred: boolean;
}

export interface PromptTemplate {
  id: string;
  session_id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
}

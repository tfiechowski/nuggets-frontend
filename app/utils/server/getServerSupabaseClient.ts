import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export function getServerSupabaseClient() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return supabase;
}

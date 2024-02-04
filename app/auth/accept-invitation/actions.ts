'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const signInOtp = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const invitationToken = formData.get('email') as string;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `http://127.0.0.1:3000/auth/callback/accept-invitation?invitationToken=${invitationToken}`,
    },
  });
  console.log('🚀 ~ signInOtp ~ data, error:', data, error);
};

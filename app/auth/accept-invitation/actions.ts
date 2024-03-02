'use server';

import { DEFAULT_URL } from '@/app/utils/config';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const signInOtp = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const invitationToken = formData.get('invitationToken') as string;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const url = `${DEFAULT_URL}/auth/callback/accept-invitation?invitationToken=${invitationToken}`;
  console.log('🚀 accept-invitation ~ signInOtp ~ url:', url);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: url,
    },
  });
  console.log('🚀 ~ signInOtp ~ data, error:', data, error);
};

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  useEffect(() => {
    async function handle() {
      await supabase.auth.signOut();
      router.push('/');
    }
    handle();
  }, []);
  return <div>Logging out...</div>;
}

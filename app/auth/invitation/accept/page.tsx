import { createClient } from '@/utils/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AcceptInvitationPage({ searchParams }: { searchParams: any }) {
  const { invitationToken } = searchParams;
  console.log('🚀 ~ AcceptInvitationPage ~ searchParams:', searchParams);

  const signUp = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const emailRedirectTo =
      `${origin}/auth/callback` + invitationToken ? `invitationToken=${invitationToken}` : '';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/login?message=Check email to continue sign in process');
  };

  return <div>You have been invited {JSON.stringify(searchParams)}</div>;
}

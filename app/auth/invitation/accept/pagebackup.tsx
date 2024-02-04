import { createClient } from '@/utils/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AcceptInvitationPage({ searchParams }: { searchParams: any }) {
  const { invitationToken, code } = searchParams;
  console.log("🚀 ~ AcceptInvitationPage ~ searchParams:", searchParams)

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const res = await supabase.auth.exchangeCodeForSession(code);
    console.log("🚀 ~ AcceptInvitationPage ~ res:", res)
    
    const user = await supabase.auth.getUser();
    console.log("🚀 ~ AcceptInvitationPage ~ user:", user)
  }


  // const signUp = async (formData: FormData) => {
  //   'use server';

  //   const origin = headers().get('origin');
  //   const email = formData.get('email') as string;
  //   const password = formData.get('password') as string;
  //   const cookieStore = cookies();
  //   const supabase = createClient(cookieStore);

  //   const emailRedirectTo =
  //     `${origin}/auth/callback` + invitationToken ? `invitationToken=${invitationToken}` : '';

  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo,
  //     },
  //   });

  //   if (error) {
  //     return redirect('/login?message=Could not authenticate user');
  //   }

  //   return redirect('/login?message=Check email to continue sign in process');
  // };

  return redirect('/app');

  return <div>You have been invited {JSON.stringify(searchParams)}</div>;
}

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  console.log('/auth/callback GET', request.url);

  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
  }

  // const invitationToken = requestUrl.searchParams.get('invitationToken');
  // if (invitationToken) {
  //   console.log('Accepting invitation token');
  //   const cookieStore = cookies();
  //   const supabase = createClient(cookieStore);

  //   // User should be authenticated at this point
  //   const user = await supabase.auth.getUser();

  //   const { data, error } = await supabase.rpc('accept_invitation', {
  //     lookup_invitation_token: invitationToken,
  //   });

  //   console.log('accept_invitation data, error:', data, error);
  // }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}

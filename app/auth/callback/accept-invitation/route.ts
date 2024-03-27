import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import { prisma } from '@/lib/db';
import { OrganizationService } from '@/app/utils/server/OrganizationService';

export async function GET(request: Request) {
  console.log('🚀 ~ /auth/invitation/accept ~ GET:');
  const { searchParams, origin } = new URL(request.url);
  console.log('🚀 ~ GET ~ origin:', origin, ' NEXT_PUBLIC_DEFAULT_URL:', NEXT_PUBLIC_DEFAULT_URL);
  console.log('🚀 ~ GET ~ searchParams:', searchParams);

  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/app';
  const invitationToken = searchParams.get('invitationToken') ?? '/app';

  // TODO: no invitation token - no honey, throw an error here
  if (invitationToken === null) {
    return NextResponse.redirect(
      `${NEXT_PUBLIC_DEFAULT_URL}/auth/auth-code-error?reason=no-invitation-token`
    );
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${NEXT_PUBLIC_DEFAULT_URL}/auth/auth-code-error`);
    }

    await OrganizationService.acceptInvite(invitationToken);

    const user = await supabase.auth.getUser();

    console.log('Invitation accept user:', user);

    const url = `${NEXT_PUBLIC_DEFAULT_URL}${next}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(`${NEXT_PUBLIC_DEFAULT_URL}/auth/auth-code-error`);
}

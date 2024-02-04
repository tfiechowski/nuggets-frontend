import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; invitationToken: string; company: string; email: string };
}) {
  const { invitationToken, company, email } = searchParams;

  const signInOtp = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `http://127.0.0.1:3000/auth/callback/accept-invitation?invitationToken=${invitationToken}&message=Elo`,
      },
    });
    console.log('🚀 ~ signInOtp ~ data, error:', data, error);

    // return redirect('/app');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signInOtp}
      >
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You've been invited to join {company ? company : 'your organisation'} in Nuggets!
          </AlertDescription>
        </Alert>

        <div className="py-8">
          Please confirm your email below and use Magic Link to log in to the app:
        </div>

        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          defaultValue={email}
          required
        />
        <button
          formAction={signInOtp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Send magic link 🪄
        </button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
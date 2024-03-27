import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const signInMagicLink = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const url = `${NEXT_PUBLIC_DEFAULT_URL}/auth/callback`;

    console.log('🚀 ~ signInMagicLink ~ url:', url);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: url,
      },
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/login-magic?message=Please check your email for magic link!');
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
        action={signInMagicLink}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />

        <div className="pb-6">
          <Link
            href="/login"
            className="text-slate-400 bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
          >
            You can also login email and password
          </Link>
        </div>

        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Sign In With Magic Link
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

'use client';

import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';
import { signInOtp } from '@/app/auth/accept-invitation/actions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function Login({
  searchParams,
}: {
  searchParams: { invitationToken: string; company: string; email: string };
}) {
  const { invitationToken, company, email } = searchParams;
  const [state, setState] = useState<{ isLoading: boolean; error: any; success: boolean }>({
    isLoading: false,
    error: null,
    success: false,
  });

  async function handleFormAction(formData: FormData) {
    setState({ isLoading: true, error: null, success: false });
    try {
      await signInOtp(formData);
      setState((_state) => ({ ..._state, success: true }));
    } catch (error) {
      setState((_state) => ({ ..._state, error }));
    } finally {
      setState((_state) => ({ ..._state, isLoading: false }));
    }
  }

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

        {state.success ? (
          <>
            <h2 className="px-4 py-20 text-lg font-semibold tracking-tight">
              Please check your inbox for the magic link! 🪄
            </h2>
          </>
        ) : (
          <>
            <div className="py-6">
              Please confirm your email below and use Magic Link to log in to the app:
            </div>

            <input type="hidden" name="invitationToken" value={invitationToken} />

            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="you@example.com"
              defaultValue={email}
              required
            />
            <Button variant="outline" formAction={handleFormAction} disabled={state.isLoading}>
              {state.isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Send magic link 🪄'
              )}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

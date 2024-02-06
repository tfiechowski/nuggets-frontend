'use client';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { headers, cookies } from 'next/headers';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FormEvent, useState } from 'react';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

function formDataToJson(formData: FormData): Record<string, any> {
  const json: Record<string, any> = {};

  formData.forEach((value, key) => {
    json[key] = value;
  });

  return json;
}

export default function CreateTeam({ searchParams }: { searchParams: { message: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget);
      const body = formDataToJson(formData);
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log("Team Create response:", response);

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.');
      }

      // Handle response if necessary
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        router.push('/app');
      }

      console.log('Success!', data);
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error as any);
      console.error(error);
    } finally {
      setIsLoading(false);
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

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={onSubmit}
      >
        <label className="text-md" htmlFor="name">
          Company name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="name"
          placeholder="Company name"
          required
        />

        <label className="text-md" htmlFor="slug">
          Company name slug
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="slug"
          placeholder="Slug"
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          required
        />

        <button className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2">
          Create a team
        </button>
      </form>

      {/* {formErrors && <div>{JSON.stringify(formErrors)}</div>} */}
    </div>
  );
}

import { createClient } from '@/utils/supabase/server';
import { SupabaseClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

interface RequestBody {
  name: string;
  slug: string;
}

const RequestBody = z.object({
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

async function validateSlug(supabase: SupabaseClient, slug: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('get_account_by_slug', { slug });
  console.log('🚀 ~ validateSlug ~ data, error:', data, error);

  if (error?.message === 'Not found') {
    return true;
  }

  return false;
}

async function validateFirstTeam(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc('get_accounts');
  console.log('🚀 ~ validateFirstTeam ~ data, error:', data, error);

  if (error) {
    return false;
  }

  console.log('🚀 ~ validateFirstTeam ~ data.length:', data.length);

  // User can have both personal and team account, that's why two
  if (data.length >= 2) {
    return false;
  }
  return true;
}

async function handle(
  supabase: SupabaseClient,
  body: { name: string; slug: string }
): Promise<{ data?: any; error?: any }> {
  const { name, slug } = body;

  if (!(await validateSlug(supabase, slug))) {
    return { error: `Slug already exists: ${slug}` };
  }

  if (!(await validateFirstTeam(supabase))) {
    return { error: 'User already has a team' };
  }

  const response = await supabase.rpc('create_account', {
    name,
    slug,
  });

  console.log('Created an account!');

  return response;
}

export async function POST(request: Request) {
  try {
    const body = RequestBody.parse(await request.json());

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await handle(supabase, body);

    if (error) {
      return NextResponse.json({ error });
    }
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues });
    } else {
      return NextResponse.json({}, { status: 400 });
    }
  }
}

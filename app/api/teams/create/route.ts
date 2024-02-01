import {
  FunctionalValidator,
  IRuleValidator,
  IFunctionalRuleValidator,
  RuleValidator,
  Validator,
} from '@/lib/validator';
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

const validateSlug: IFunctionalRuleValidator =
  (supabase: SupabaseClient, slug: string) => async () => {
    const { error } = await supabase.rpc('get_account_by_slug', { slug });
    console.log('🚀 ~ validateSlug ~ error:', error);

    if (error?.message === 'Not found') {
      return {};
    }

    return { error: 'Slug already exists' };
  };

const validateFirstTeam: IFunctionalRuleValidator = (supabase: SupabaseClient) => async () => {
  const { data, error } = await supabase.rpc('get_accounts');

  if (error) {
    return { error: `Error happened: ${error}` };
  }

  // User can have both personal and team account, that's why two
  if (data.length >= 2) {
    return { error: 'User already has a team' };
  }
  return {};
};

async function handle(
  supabase: SupabaseClient,
  body: { name: string; slug: string }
): Promise<{ data?: any; error?: any }> {
  const { name, slug } = body;

  const functionalValidator = new FunctionalValidator([
    validateSlug(supabase, slug),
    validateFirstTeam(supabase),
  ]);

  const error = await functionalValidator.validate();
  if (error) {
    return error;
  }

  const response = await supabase.rpc('create_account', {
    name,
    slug,
  });

  console.log(`Created an "${name} account (${slug})!`);

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

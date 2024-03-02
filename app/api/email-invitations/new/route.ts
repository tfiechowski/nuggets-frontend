
import {
  FunctionalValidator,
  IRuleValidator,
  IFunctionalRuleValidator,
  RuleValidator,
  Validator,
} from '@/lib/validator';
import { SupabaseClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { createClient } from '@/utils/supabase/server';

interface RequestBody {
  attachment: string;
}

const RequestBody = z.object({
  attachment: z.string(),
});

async function handle(
  supabase: SupabaseClient,
  body: { name: string; slug: string }
): Promise<{ data?: any; error?: any }> {
  const { name, slug } = body;


  const response = await supabase.from('basejump.', {
    name,
    slug,
  });
  console.log('🚀 rpc.create_account ~ response:', response);

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
    console.error('Error: ', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  }
}
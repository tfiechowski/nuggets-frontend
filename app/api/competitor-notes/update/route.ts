import { FunctionalValidator, IFunctionalRuleValidator } from '@/lib/validator';
import { SupabaseClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

interface RequestBody {
  id: string;
  content: string;
}

const RequestBody = z.object({
  id: z.string(),
  content: z.string(),
});

const validateTeam: IFunctionalRuleValidator =
  (supabase: SupabaseClient, accountId: string) => async () => {
    const { data, error } = await supabase.rpc('get_accounts');

    if (error) {
      return { error: `Error happened: ${error}` };
    }

    return data.find((account: any) =>
      account.account_id === accountId ? {} : { error: 'User does belong to this' }
    );
  };

const validateOwner: IFunctionalRuleValidator =
  (supabase: SupabaseClient, accountId: string) => async () => {
    const { data, error } = await supabase.rpc('get_accounts');

    if (error) {
      return { error: `Error happened: ${error}` };
    }

    return data.find((account: any) =>
      account.account_id === accountId && account.account_role === 'owner'
        ? {}
        : { error: "User doesn't have edit rights to this resource" }
    );
  };

async function handle(
  supabase: SupabaseClient,
  body: { id: string; content: string }
): Promise<{ data?: any; error?: any }> {
  const { id, content } = body;

  const functionalValidator = new FunctionalValidator([
    validateTeam(supabase, id),
    validateOwner(supabase, id),
  ]);

  const error = await functionalValidator.validate();
  if (error) {
    return error;
  }

  const competitorNote = await supabase.from('competitor_note').select('*').eq('id', id);

  if (!competitorNote) {
    return { error: `No competitor note found with ID: ${id}` };
  }

  supabase.from('competitor_note').update({ content }).eq('id', id);

  return {};
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

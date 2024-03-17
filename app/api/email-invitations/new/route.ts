import { CallInvitationService } from '@/app/utils/server/CallInvitationService';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

interface RequestBody {
  attachment: string;
}

const RequestBody = z.object({
  attachment: z.string(),
});

async function handle(body: RequestBody): Promise<{ data?: any; error?: any }> {
  const { attachment } = body;
  console.log('🚀 ~ attachment:', attachment);

  await CallInvitationService.processEmailInvitation(attachment);

  // const response = await supabase.from('basejump.', {
  //   name,
  //   slug,
  // });
  // console.log('🚀 rpc.create_account ~ response:', response);

  // console.log(`Created an "${name} account (${slug})!`);

  // return response;
  return {};
}

export async function POST(request: Request) {
  try {
    const body = RequestBody.parse(await request.json());

    const { data, error } = await handle(body);

    if (error) {
      return NextResponse.json({ error });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error: ', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  }
}

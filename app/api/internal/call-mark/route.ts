import { API_KEY } from '@/app/api/internal/apiKey';
import { NextResponse } from 'next/server';

import { BotCallService } from '@/app/utils/server/BotCallService/BotCallService';
import { BotCallStatus } from '@prisma/client';
import { ZodError, z } from 'zod';

const RequestBodySchema = z.object({
  callIds: z.string().array(),
  status: z.nativeEnum(BotCallStatus),
});

async function handle(callIds: Array<string>, status: BotCallStatus) {
  return BotCallService.markCalls(callIds, status);
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (authHeader === null) {
      return NextResponse.json({}, { status: 403 });
    }

    if (!authHeader.includes(API_KEY)) {
      return NextResponse.json({}, { status: 403 });
    }

    const { callIds, status } = RequestBodySchema.parse(await request.json());

    const data = await handle(callIds, status);
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

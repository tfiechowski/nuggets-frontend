import { NextResponse } from 'next/server';

import { InternalAPIView } from '@/app/api/internal/apiView';
import { BotCallService } from '@/app/utils/server/BotCallService/BotCallService';
import { BotCallStatus } from '@prisma/client';
import { z } from 'zod';

const RequestBodySchema = z.object({
  callIds: z.string().array(),
  status: z.nativeEnum(BotCallStatus),
});

async function handle(callIds: Array<string>, status: BotCallStatus) {
  return BotCallService.markCalls(callIds, status);
}

export const POST = InternalAPIView(async (request: Request) => {
  const { callIds, status } = RequestBodySchema.parse(await request.json());

  const data = await handle(callIds, status);
  return NextResponse.json({ data });
});

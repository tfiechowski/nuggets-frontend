import { InternalAPIView } from '@/app/api/internal/apiView';
import { BotCallService } from '@/app/utils/server/BotCallService/BotCallService';
import { NextResponse } from 'next/server';

async function handle(): Promise<any[]> {
  return BotCallService.selectAndMarkForSchedule();
}

export const GET = InternalAPIView(async (request: Request) => {
  const data = await handle();
  return NextResponse.json({ data });
});

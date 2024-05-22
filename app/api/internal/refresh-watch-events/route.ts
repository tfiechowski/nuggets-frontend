import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';
import { InternalAPIView } from '@/app/api/internal/apiView';
import { NextResponse } from 'next/server';

async function handle(): Promise<any> {
  return GoogleCalendarService.refreshUsersCalendarIntegrations();
}
export const POST = InternalAPIView(async () => {
  const result = await handle();
  return NextResponse.json(result);
});

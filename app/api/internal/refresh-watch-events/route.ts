import { API_KEY } from '@/app/api/internal/apiKey';
import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

async function handle(): Promise<any[]> {
  return GoogleCalendarService.refreshUsersCalendarIntegrations();
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
    await handle();

    return NextResponse.json({});
  } catch (error) {
    console.error('Error: ', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  }
}

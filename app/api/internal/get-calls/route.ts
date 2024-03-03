import { API_KEY } from '@/app/api/internal/apiKey';
import { BotCallService } from '@/app/utils/server/BotCallService/BotCallService';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

async function handle(): Promise<any[]> {
  return BotCallService.selectAndMarkForSchedule();
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (authHeader === null) {
      return NextResponse.json({}, { status: 403 });
    }

    if (!authHeader.includes(API_KEY)) {
      return NextResponse.json({}, { status: 403 });
    }

    const data = await handle();
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

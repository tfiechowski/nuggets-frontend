import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import dayjs from 'dayjs';
import { API_KEY } from '@/app/api/internal/apiKey';

/*

curl http://localhost:3000/api/internal/get-calls
   -H "Accept: application/json"
   -H "Authorization: Bearer 93ER2tuPHrh3Wr4AjPhnatLeC4T6iekbrXZXdwxQsF2p2KLaJGRreV8m66yDeAxhrj6hNgfNWdYQLdrfH4EePGLAEW6eEaeBsFTG"

*/

async function handle(): Promise<any[]> {
  const interval = dayjs().add(1, 'hour').toISOString();
  console.log('🚀 ~ handle ~ interval:', interval);

  const data = await prisma.customerCall.findMany({
    where: {
      scheduledAt: {
        lte: interval,
      },
    },
  });

  return data;
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

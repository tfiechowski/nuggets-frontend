import { CustomerCallService } from '@/app/utils/server/CustomerCallService';
import { UnauthorizedError } from '@/app/utils/server/errors';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

async function handle(): Promise<any[]> {
  const userMembership = await getUserMembership();

  return CustomerCallService.getUpcoming(userMembership);
}

export async function GET(request: Request) {
  console.log('REQUEST');
  try {
    const data = await handle();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error: ', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    } else if(error instanceof UnauthorizedError) {
      return NextResponse.json({}, { status: 401 });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  }
}

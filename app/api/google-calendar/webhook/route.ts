import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';

import { prisma } from '@/lib/db';

export async function POST(request: NextApiRequest) {
  console.log('Google webhook event request:', request.body);

  // const googleHeaders = Object.entries(request.headers).filter(([key, value]) => {
  //   console.log("Key:", key)
  //   return key.toLocaleLowerCase().includes('x-goog')
  // })

  // const googleHeaders = [
  //   "X-Goog-Channel-ID",
  //   "X-Goog-Message-Number",
  //   "X-Goog-Resource-ID",
  //   "X-Goog-Resource-State",
  //   "X-Goog-Resource-URI"
  // ]

  const headers: Headers = request.headers as unknown as Headers;

  const googleHeaders = Object.fromEntries(
    Array.from(headers.entries()).filter((key, _) =>
      key.toString().toLowerCase().includes('x-goog')
    )
  );

  console.log('Entries:', headers.entries());

  console.log('🚀 ~ POST ~ request.googleHeaders:', googleHeaders);

  // Call GoogleCalendarService.runCalendarSync()
  // 'x-goog-channel-id' header should be the ID of a userMembership
  // so it should be enough to call the mentioned function
  const userMembershipId = googleHeaders['x-goog-channel-id'];

  if (userMembershipId === undefined) {
    console.log('Cannot get userMembershipId from Google Calendar watch event');
    return NextResponse.json({});
  }
  console.log('🚀 ~ POST ~ userMembershipId:', userMembershipId);

  const membership = await prisma.membership.findFirstOrThrow({
    where: {
      id: userMembershipId,
    },
  });

  // TODO: Dirty hack, improve
  GoogleCalendarService.runCalendarSync({
    membershipId: userMembershipId,
    organization: { id: membership.organizationId },
  } as any);

  // What happens here, is that Google only notifies that something changed
  // but doesn't tell exactly what. Use channelId to retrieve Google Calendar
  // Events for specific user (channelId = userId) and do an update on Nuggets
  // side. For handling sync properly, see:
  // https://developers.google.com/calendar/api/guides/sync

  return NextResponse.json({});
}

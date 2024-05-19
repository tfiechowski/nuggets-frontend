import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';

import { prisma } from '@/lib/db';

export async function POST(request: NextApiRequest) {
  const headers: Headers = request.headers as unknown as Headers;

  const googleHeaders = Object.fromEntries(
    Array.from(headers.entries()).filter((key, _) =>
      key.toString().toLowerCase().includes('x-goog')
    )
  );

  const channelId = googleHeaders['x-goog-channel-id'];

  if (channelId === undefined) {
    console.log('Cannot get channelId from Google Calendar watch event');
    return NextResponse.json({});
  }

  const notificationChannel = await prisma.googleEventsNotificationChannel.findFirst({
    where: {
      id: channelId,
    },
  });

  // Notification can be technically correct, but the notification channel
  // is expired at this point from our DB.
  if (notificationChannel === null) {
    return NextResponse.json({});
  }

  const membership = await prisma.membership.findFirstOrThrow({
    where: {
      id: notificationChannel.membershipId,
    },
  });

  // TODO: Dirty hack with casting the data, improve
  GoogleCalendarService.runCalendarSync({
    membershipId: notificationChannel.membershipId,
    organization: { id: membership.organizationId },
  } as any);

  // What happens here, is that Google only notifies that something changed
  // but doesn't tell exactly what. Use channelId to retrieve Google Calendar
  // Events for specific user (channelId = userId) and do an update on Nuggets
  // side. For handling sync properly, see:
  // https://developers.google.com/calendar/api/guides/sync

  return NextResponse.json({});
}

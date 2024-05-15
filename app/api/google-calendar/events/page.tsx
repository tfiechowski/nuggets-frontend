import {
  GoogleCalendar,
  GoogleOAuth2Client,
} from '@/app/utils/server/GoogleCalendarService/GoogleOAuthClient';
import { prisma } from '@/lib/db';
import { getUserId } from '@/app/utils/server/getUserId';
import { getUserMembership } from '@/app/utils/server/getUserTeam';

async function getEvents() {
  const userMembership = await getUserMembership();
  const { refreshToken } = await prisma.googleCalendarIntegration.findFirstOrThrow({
    where: {
      membershipId: {
        equals: userMembership.membershipId,
      },
    },
  });
  console.log('🚀 ~ getEvents ~ refreshToken:', refreshToken);

  const oAuthClient = GoogleOAuth2Client();
  oAuthClient.setCredentials({
    refresh_token: refreshToken,
  });

  // console.log("🚀 ~ getEvents ~ GoogleCalendar:", GoogleCalendar)
  try {
    const res = await GoogleCalendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      // maxResults: 1,
      // singleEvents: true,
      // orderBy: 'startTime',
      auth: oAuthClient,
    });

    // To get sync token, select only calendarIr, timeMin and auth

    console.log('Sync token:', res.data.nextSyncToken);

    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }

    return events;
  } catch (error) {
    console.log('🚀 ~ getEvents ~ error:', error);
    return [];
  }
}

export default async function GoogleEvents() {
  const events = await getEvents();

  return (
    <div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(events)}</pre>
    </div>
  );
}

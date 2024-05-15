import {
  GoogleCalendar,
  GoogleOAuth2Client,
} from '@/app/utils/server/GoogleCalendarService/GoogleOAuthClient';
import { prisma } from '@/lib/db';
import { getUserId } from '@/app/utils/server/getUserId';
import { redirect } from 'next/navigation';
import { google } from 'googleapis';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';
import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';

async function setupEventsWatch() {
  const userMembership = await getUserMembership();
  const { refreshToken } = await prisma.googleCalendarIntegration.findFirstOrThrow({
    where: {
      membershipId: {
        equals: userMembership.membershipId,
      },
    },
  });
  console.log('🚀 ~ setupEventsWatch ~ refreshToken:', refreshToken);

  const oAuthClient = GoogleOAuth2Client();
  oAuthClient.setCredentials({
    refresh_token: refreshToken,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.events.readonly',
    ].join(','),
  });

  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.events.readonly',
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
    authClient: oAuthClient,
  });

  // Acquire an auth client, and bind it to all future calls
  const calendar = google.calendar('v3');
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  try {
    const id = userMembership.membershipId;

    const response = await calendar.events.watch({
      calendarId: 'primary',
      requestBody: {
        id,
        address: 'https://f775-213-134-186-96.ngrok-free.app/api/google-calendar/webhook',
        // address: 'https://getnuggets.io/api/google-calendar/webhook',
        type: 'web_hook',
        params: {
          ttl: '30000',
        },
      },
    });

    console.log('Watch setup:', response);

    return response;
  } catch (error) {
    console.log('🚀 ~ watch setup ~ error:', error);
    return error;
  }
}

export default async function GoogleEvents() {
  const userMembership = await getUserMembership();

  await GoogleCalendarService.setupCalendarSync(userMembership);
  await GoogleCalendarService.runCalendarSync(userMembership);

  const redirectUrl = `${NEXT_PUBLIC_DEFAULT_URL}/app/settings/calendar`;
  console.log(`Calendar Sync is done, redirecting to ${redirectUrl}`);

  return redirect(redirectUrl);

  // return (
  //   <div>
  //     <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(events, null, 2)}</pre>
  //   </div>
  // );
}

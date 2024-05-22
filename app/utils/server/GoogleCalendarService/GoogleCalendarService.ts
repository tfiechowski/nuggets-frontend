import { ENV_WEBHOOK_ENDPOINT, GOOGLE_NOTIFICATIONS_TTL } from '@/app/utils/config';
import { CustomerCallService } from '@/app/utils/server/CustomerCallService';
import {
  GoogleCalendar,
  GoogleOAuth2Client,
  generateAuthUrl,
} from '@/app/utils/server/GoogleCalendarService/GoogleOAuthClient';
import { UserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import dayjs from 'dayjs';
import { GoogleEventsNotificationChannel } from '@prisma/client';

export class GoogleCalendarService {
  public static async isUserIntegrated(userMembership: UserMembership): Promise<boolean> {
    const data = await prisma.googleCalendarIntegration.findUnique({
      where: {
        membershipId: userMembership.membershipId,
      },
    });

    return data !== null;
  }

  public static async isUserCalendarSynced(userMembership: UserMembership): Promise<boolean> {
    const data = await prisma.googleCalendarIntegration.findUnique({
      where: {
        membershipId: userMembership.membershipId,
      },
    });

    if (data === null) {
      return false;
    }

    return data.nextSyncToken !== null;
  }

  public static async generateAuthUrl(): Promise<string> {
    return generateAuthUrl();
  }

  public static async syncUpcomingEvents(userMembership: UserMembership): Promise<boolean> {
    const oAuthClient = await GoogleCalendarService.getOAuthClient(userMembership);

    const res = await GoogleCalendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      orderBy: 'startTime',
      singleEvents: true,
      auth: oAuthClient,
      maxResults: 50,
    });

    console.log(res.data.items?.map((item) => [item.start, item.iCalUID, item.id, item.summary]));

    // TODO: HERE NEXT - parse events, add then to CustomerCall db
    // use id to identify specific event, iCalUID is the same for recurring events

    return true;
  }

  private static getExpiringTimeThreshold() {
    return dayjs().add(60, 'minute').toDate();
  }

  public static async refreshUsersCalendarIntegrations() {
    const nearExpirationIntegrations = await prisma.googleEventsNotificationChannel.findMany({
      where: {
        expiresAt: {
          lte: GoogleCalendarService.getExpiringTimeThreshold(),
        },
      },
      orderBy: {
        expiresAt: 'asc',
      },
      take: 10,
    });

    if (nearExpirationIntegrations.length === 0) {
      return true;
    }

    const uniqueMemberships = Array.from(
      new Set(nearExpirationIntegrations.map((i) => i.membershipId))
    );
    const memberships = uniqueMemberships.map((id) => ({ membershipId: id }) as UserMembership);

    console.log(
      `Refreshing ${nearExpirationIntegrations.length} calendar integrations for ${memberships.length} users`
    );

    await Promise.all(
      memberships.map((membership) => GoogleCalendarService.refreshEventsWatch(membership, true))
    );

    return true;
  }

  public static async refreshEventsWatch(userMembership: UserMembership, force: boolean) {
    if (force) {
      const allUserNotificationChannels = await prisma.googleEventsNotificationChannel.findMany({
        where: { membershipId: userMembership.membershipId },
      });

      await GoogleCalendarService.setupCalendarSync(userMembership);

      if (allUserNotificationChannels.length > 0) {
        await GoogleCalendarService.stopNotifications(userMembership, allUserNotificationChannels);
      }
    } else {
      const existingNotificationChannels = await prisma.googleEventsNotificationChannel.findMany({
        where: {
          membershipId: userMembership.membershipId,
          expiresAt: {
            lte: GoogleCalendarService.getExpiringTimeThreshold(),
          },
        },
        orderBy: {
          expiresAt: 'asc',
        },
      });

      await GoogleCalendarService.setupCalendarSync(userMembership);
      await GoogleCalendarService.stopNotifications(userMembership, existingNotificationChannels);
    }
  }

  private static async stopNotifications(
    userMembership: UserMembership,
    channels: Array<GoogleEventsNotificationChannel>
  ) {
    const calendar = await GoogleCalendarService.getCalendar(userMembership);
    const results = await Promise.allSettled(
      channels.map((channel) =>
        calendar.channels.stop({
          requestBody: {
            id: channel.id,
            resourceId: channel.resourceId,
          },
        })
      )
    );

    const channelIds = channels.map(({ id }) => id);

    return prisma.googleEventsNotificationChannel.deleteMany({
      where: {
        id: {
          in: channelIds,
        },
      },
    });
  }

  private static async getCalendar(userMembership: UserMembership): Promise<calendar_v3.Calendar> {
    const oAuthClient = await GoogleCalendarService.getOAuthClient(userMembership);

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
    google.options({ auth: authClient as any });

    return calendar;
  }

  public static async setupCalendarSync(userMembership: UserMembership) {
    const calendar = await GoogleCalendarService.getCalendar(userMembership);

    try {
      const id = randomUUID();

      const response = await calendar.events.watch({
        calendarId: 'primary',
        requestBody: {
          id,
          address: `${ENV_WEBHOOK_ENDPOINT}/api/google-calendar/webhook`,
          type: 'web_hook',
          params: {
            ttl: GOOGLE_NOTIFICATIONS_TTL as any,
          },
        },
      });

      const expiresAt = parseInt((response as any).data.expiration);
      const resourceId = (response as any).data.resourceId;

      await prisma.googleEventsNotificationChannel.create({
        data: {
          membershipId: userMembership.membershipId,
          id,
          expiresAt: new Date(expiresAt),
          resourceId,
        },
      });

      return response;
    } catch (error) {
      console.log('🚀 ~ watch setup ~ error:', error);
      return error;
    }
  }

  private static async getOAuthClient(userMembership: UserMembership): Promise<OAuth2Client> {
    const refreshToken = await GoogleCalendarService.getRefreshToken(userMembership);
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

    return oAuthClient;
  }

  private static async getRefreshToken(userMembership: UserMembership) {
    const { refreshToken } = await prisma.googleCalendarIntegration.findFirstOrThrow({
      where: {
        membershipId: {
          equals: userMembership.membershipId,
        },
      },
    });

    return refreshToken;
  }

  public static async runCalendarSync(userMembership: UserMembership) {
    const oAuthClient = await GoogleCalendarService.getOAuthClient(userMembership);
    const calendar = google.calendar('v3');

    let settings: calendar_v3.Params$Resource$Events$List = {
      calendarId: 'primary',
      auth: oAuthClient,
    };

    const syncToken = (
      await prisma.googleCalendarIntegration.findFirstOrThrow({
        where: {
          membershipId: {
            equals: userMembership.membershipId,
          },
        },
      })
    ).nextSyncToken;

    if (syncToken === null) {
      console.log('Performing full sync');
      settings.timeMin = new Date().toISOString();
    } else {
      settings.syncToken = syncToken;
    }

    let pageToken = undefined;
    let lastSyncToken = null;

    do {
      settings.pageToken = pageToken as any;

      try {
        const response = await calendar.events.list(settings);

        console.log('Total events in response', response.data.items?.length);

        pageToken = response.data.nextPageToken;
        lastSyncToken = response.data.nextSyncToken;

        // console.log('Events:', JSON.stringify(response.data.items, null, 2));

        if (response.data.items !== undefined) {
          CustomerCallService.processEventsSync(userMembership, response.data.items, '@gmail.com');
        }
      } catch (error) {
        console.log('Error on sync:', error);
      }
    } while (pageToken !== undefined);

    // Save sync token from last response
    // const lastSyncToken = response?.data.nextSyncToken;

    if (lastSyncToken) {
      console.log('Updaing new sync token');
      await prisma.googleCalendarIntegration.update({
        where: {
          membershipId: userMembership.membershipId,
        },
        data: {
          nextSyncToken: lastSyncToken,
        },
      });
    }
  }
}

import { CallInvitationService } from '@/app/utils/server/CallInvitationService';
import { parseLocation } from '@/app/utils/server/CallInvitationService/parseProvider';
import { UserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';
import { CustomerCall } from '@prisma/client';
import { calendar_v3 } from 'googleapis';

export class CustomerCallService {
  public static async getCalls(organizationId: string) {
    console.log('🚀 ~ CustomerCallService ~ getCalls ~ organizationId:', organizationId);
    return prisma.customerCall.findMany({
      where: {
        organizer: {
          organizationId: {
            equals: organizationId,
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });
  }

  public static async getCall(id: string, userMembership: UserMembership) {
    return prisma.customerCall.findUniqueOrThrow({
      where: {
        id: id,
        organizer: {
          organizationId: userMembership.organization.id,
        },
      },
    });
  }

  public static async getUpcoming(userMembership: UserMembership) {
    const now = new Date();

    return prisma.customerCall.findMany({
      where: {
        organizerId: {
          equals: userMembership.membershipId,
        },
        OR: [
          {
            AND: [{ scheduledAt: { lte: now } }, { scheduledEndAt: { gte: now } }],
          },
          { scheduledAt: { gt: now } },
        ],
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 5,
    });
  }

  public static async processEventsSync(
    userMembership: UserMembership,
    events: Array<calendar_v3.Schema$Event>,
    customerEmailDomain: string
  ) {
    // TODO: Improve efficiency here by creating a helper to apply skips per event
    // inside a single filter function, not calling filter multiple times
    const skipNoIds = (event: calendar_v3.Schema$Event) => Boolean(event.id);
    const skipFullDayEvents = (event: calendar_v3.Schema$Event) => Boolean(event.start?.dateTime);
    const skipNoAttendees = (event: calendar_v3.Schema$Event) => event.attendees?.length;
    const skipInternalMeetings = (event: calendar_v3.Schema$Event) =>
      event.attendees?.some((attendee) => !attendee.email?.endsWith(customerEmailDomain));

    const pickCancelled = (event: calendar_v3.Schema$Event) => event.status === 'cancelled';

    const filteredEvents = events
      .filter(skipNoIds)
      .filter(skipNoAttendees)
      .filter(skipFullDayEvents)
      .filter(skipInternalMeetings);
    console.log('Updating', filteredEvents.length, 'events for', userMembership.membershipId);

    const cancelledEvents = events.filter(pickCancelled);

    if (cancelledEvents.length > 0) {
      await prisma.customerCall.updateMany({
        where: {
          eventId: {
            in: cancelledEvents.map((event) => event.id) as any,
          },
        },
        data: {
          cancelled: true,
        },
      });
    }

    const existingEvents = await prisma.customerCall.findMany({
      where: {
        eventId: {
          in: filteredEvents.map((event) => event.id as string),
        },
        organizerId: userMembership.membershipId,
      },
      select: {
        id: true,
        eventId: true,
      },
    });

    const newEvents = filteredEvents.filter(
      (event) => !existingEvents.find((e) => e.eventId === event.id)
    );

    console.log('Existing:', existingEvents.length, 'New:', newEvents.length);

    // Do upsert for all events
    await Promise.all(
      filteredEvents.map(async (event) => {
        if (typeof event.id !== 'string') {
          console.log("Event doesn't have an ID");
          return {};
        }

        let additionalData: Partial<CustomerCall> = { data: {} };

        if (event.location) {
          // Todo: refactor to builder pattern?
          additionalData = addCallProviderData(additionalData, event.location);
        }

        // TODO: update attendees too?
        return prisma.customerCall.upsert({
          where: {
            eventId: event.id,
            organizerId: userMembership.membershipId,
          },
          create: {
            eventId: event.id,
            title: event.summary || 'Summary',
            createdAt: event.created || 'Unknown',
            timezone: event.start?.timeZone,
            scheduledAt: event.start?.dateTime,
            scheduledEndAt: event.end?.dateTime,
            organizerId: userMembership.membershipId,
            ...additionalData,
          },
          update: {
            title: event.summary || 'Summary',
            createdAt: event.created || 'Unknown',
            timezone: event.start?.timeZone,
            scheduledAt: event.start?.dateTime,
            scheduledEndAt: event.end?.dateTime,
            ...additionalData,
          },
        });
      })
    );

    const newCustomerCalls = await prisma.customerCall.findMany({
      where: {
        eventId: {
          in: newEvents.map((event) => event.id as string),
        },
      },
      select: {
        id: true,
      },
    });

    // Create resources for remaining events
    // this should ideally be updated as currently it's not
    // efficient to set up resources like this, there are a
    // lot of underlying DB calls and logic.
    await Promise.all(
      newCustomerCalls.map((customerCall) =>
        CallInvitationService.setupCallResources(customerCall.id, userMembership.organization.id)
      )
    );

    console.log('All events updated');
  }
}

function addCallProviderData(data: any, location: string) {
  const callProviderData = parseLocation(location);

  if (callProviderData) {
    return {
      ...data,
      provider: callProviderData.provider,
      data: {
        [callProviderData.provider.toLowerCase()]: callProviderData.data,
      },
    };
  }
}

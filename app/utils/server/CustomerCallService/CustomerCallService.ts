import { CallInvitationService } from '@/app/utils/server/CallInvitationService';
import { parseLocation } from '@/app/utils/server/CallInvitationService/parseProvider';
import { filterEvents } from '@/app/utils/server/CustomerCallService/utils';
import { UserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';
import { CustomerCall } from '@prisma/client';
import Bottleneck from 'bottleneck';
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
        scheduledAt: 'asc',
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

  public static async getPastCalls(userMembership: UserMembership) {
    const now = new Date();

    return prisma.customerCall.findMany({
      where: {
        organizerId: {
          equals: userMembership.membershipId,
        },
        scheduledAt: {
          lt: now,
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
      take: 5,
    });
  }

  public static async processEventsSync(
    userMembership: UserMembership,
    events: Array<calendar_v3.Schema$Event>,
    customerEmailDomains: Array<string>
  ) {
    const pickCancelled = (event: calendar_v3.Schema$Event) => event.status === 'cancelled';

    const filteredEvents = filterEvents(events, customerEmailDomains);
    console.log(
      `Syncing events (${events.length}) for user ${userMembership.membershipId}, skipping ${customerEmailDomains} emails`
    );

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

    const existingEventsNewData = events.filter((event) =>
      existingEvents.some(({ id, eventId }) => eventId === event.id)
    );

    const newEvents = filteredEvents.filter(
      (event) => !existingEvents.find((e) => e.eventId === event.id)
    );

    console.log('Existing:', existingEvents.length, 'New:', newEvents.length);

    // Bulk create new events
    await prisma.customerCall.createMany({
      data: newEvents.map((newEvent) => {
        if (typeof newEvent.id !== 'string') {
          console.log("Event doesn't have an ID");
          return {};
        }

        let additionalData: Partial<CustomerCall> = { data: {} };

        if (newEvent.location) {
          // Todo: refactor to builder pattern?
          additionalData = addCallProviderData(additionalData, newEvent.location);
        }

        return {
          eventId: newEvent.id,
          title: newEvent.summary || 'Summary',
          createdAt: newEvent.created || 'Unknown',
          timezone: newEvent.start?.timeZone as any,
          scheduledAt: newEvent.start?.dateTime as any,
          scheduledEndAt: newEvent.end?.dateTime as any,
          organizerId: userMembership.membershipId,
          ...additionalData,
        } as any;
      }),
    });

    // Update for existing events
    const limiter = new Bottleneck({
      maxConcurrent: 15,
    });

    await Promise.all(
      existingEventsNewData.map((existingEventNewData: calendar_v3.Schema$Event) => {
        if (typeof existingEventNewData.id !== 'string') {
          console.log("Event doesn't have an ID");
          return {};
        }

        let additionalData: Partial<CustomerCall> = { data: {} };

        if (existingEventNewData.location) {
          // Todo: refactor to builder pattern?
          additionalData = addCallProviderData(additionalData, existingEventNewData.location);
        }
        console.log(
          '🚀 upsert: eventId, membershipId, additionalData',
          existingEventNewData.id,
          userMembership.membershipId,
          additionalData
        );

        // TODO: update attendees too?
        // TODO: Fix types as well
        return limiter.schedule(() =>
          prisma.customerCall.update({
            where: {
              eventId: existingEventNewData.id as string,
              organizerId: userMembership.membershipId,
            },
            data: {
              title: existingEventNewData.summary || 'Summary',
              createdAt: existingEventNewData.created || 'Unknown',
              timezone: existingEventNewData.start?.timeZone as any,
              scheduledAt: existingEventNewData.start?.dateTime as any,
              scheduledEndAt: existingEventNewData.end?.dateTime as any,
              ...additionalData,
            } as any,
          })
        );
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
        limiter.schedule(() =>
          CallInvitationService.setupCallResources(customerCall.id, userMembership.organization.id)
        )
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

  return data;
}

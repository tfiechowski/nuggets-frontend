import { CallInvitationService } from '@/app/utils/server/CallInvitationService';
import { UserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';
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
    return prisma.customerCall.findMany({
      where: {
        organizerId: {
          equals: userMembership.membershipId,
        },
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 10,
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

    const pickDeleted = (event: calendar_v3.Schema$Event) => event.status === 'cancelled';

    const filteredEvents = events
      .filter(skipNoIds)
      .filter(skipNoAttendees)
      .filter(skipFullDayEvents)
      .filter(skipInternalMeetings);
    console.log('Updating', filteredEvents.length, 'events for', userMembership.membershipId);

    const deletedEvents = events.filter(pickDeleted);
    console.log('Deleted events:', deletedEvents.length);

    if (deletedEvents.length > 0) {
      await prisma.customerCall.updateMany({
        where: {
          eventId: {
            in: deletedEvents.map((event) => event.id) as any,
          },
        },
        data: {
          cancelled: true,
        },
      });
    }

    // console.log(
    //   '🚀 ~ CustomerCallService ~ processEventsSync ~ filteredEvents:',
    //   filteredEvents.map((event) => JSON.stringify([event.id, event.attendees]))
    // );

    const existingEvents = await prisma.customerCall.findMany({
      where: {
        eventId: {
          in: filteredEvents.map((event) => event.id as string),
        },
        organizerId: userMembership.membershipId,
      },
      select: {
        id: true,
      },
    });
    console.log('Existing events:', existingEvents.length);

    const newEvents = filteredEvents.filter(
      (event) => !existingEvents.find((e) => e.id === event.id)
    );
    console.log('New events:', newEvents.length);

    // Do upsert for all events
    await Promise.all(
      filteredEvents.map(async (event) => {
        if (typeof event.id !== 'string') {
          console.log("Event doesn't have an ID");
          return {};
        }

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
            provider: 'ZOOM',
            data: {},
          },
          update: {
            title: event.summary || 'Summary',
            createdAt: event.created || 'Unknown',
            timezone: event.start?.timeZone,
            scheduledAt: event.start?.dateTime,
            scheduledEndAt: event.end?.dateTime,
          },
        });

        // TODO: continue from here
        // make sure all calls have Notes and Playbook Templates
      })
    );

    const newCustomerCalls = (await prisma.customerCall.findMany({
      where: {
        eventId: {
          in: newEvents.map(event => event.id as string)
        }
      },
      select: {
        id: true
      }
    }));
    console.log("🚀 ~ CustomerCallService ~ newCustomerCallIds:", newCustomerCalls)

    console.log('All events updated or created');

    // Create resources for remaining events
    // this should ideally be updated as currently it's not
    // efficient to set up resources like this, there are a
    // lot of underlying DB calls and logic.
    await Promise.all(
      newCustomerCalls.map((customerCall) => {
        console.log("🚀 ~ CustomerCallService ~ newEvents.map ~ customerCallId:", customerCall.id, "org id:",  userMembership.organization.id)
        return CallInvitationService.setupCallResources(
          customerCall.id,
          userMembership.organization.id
        );
      })
    );

    console.log('All events updated');

    // TODO: continue here
  }
}

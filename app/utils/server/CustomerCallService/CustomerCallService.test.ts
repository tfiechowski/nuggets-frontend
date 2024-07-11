import { CustomerCallService } from '@/app/utils/server/CustomerCallService/CustomerCallService';
import { UserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';
import range from 'lodash/range';

async function defaultUserAndOrg() {
  const user = await prisma.user.create({
    data: {
      email: 'tf@nuggets.com',
      name: 'Tomasz Fiechowski',
      memberships: {
        create: {
          role: 'OWNER',
          organization: {
            create: {
              name: 'Nuggets',
            },
          },
        },
      },
    },
  });

  const membership = await prisma.membership.findFirstOrThrow({
    where: {
      userId: {
        equals: user.id,
      },
    },
  });

  const m: UserMembership = {
    membershipId: membership.id,
    organization: {
      id: membership.organizationId,
    },
  } as any;

  return { user, membership: m };
}

function setupEvents(membershipId: string) {
  return prisma.customerCall.createMany({
    data: range(100).map((id) => {
      return {
        eventId: id.toString(),
        title: `Summary ${id}`,
        createdAt: '2024-05-15T20:25:43.000Z',
        timezone: 'Europe/Warsaw',
        scheduledAt: '2024-05-15T22:45:00+02:00',
        scheduledEndAt: '2024-05-15T23:15:00+02:00',
        organizerId: membershipId,
        data: {},
      } as any;
    }),
  });
}

test('should upsert Google Calendar events', async () => {
  const { membership } = await defaultUserAndOrg();
  await setupEvents(membership.membershipId);
  const events = require('./newEvent.json');

  expect(await prisma.customerCall.count()).toEqual(109);

  await CustomerCallService.processEventsSync(membership, events, ['@codility.com']);

  expect(await prisma.customerCall.count()).toEqual(110);

  const updatedEvent1 = await prisma.customerCall.findFirstOrThrow({ where: { eventId: '1' } });
  const updatedEvent2 = await prisma.customerCall.findFirstOrThrow({ where: { eventId: '2' } });
  expect(updatedEvent1.title).toBe('Existing event #1');
  expect(updatedEvent2.title).toBe('Existing event #2');
});

import { BotCallService } from '@/app/utils/server/BotCallService/BotCallService';
import { prisma } from '@/lib/db';
import { BotCallStatus } from '@prisma/client';
import dayjs from 'dayjs';

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

  return { user, membershipId: membership.id };
}

test('should mark a call for schedule', async () => {
  const { membershipId } = await defaultUserAndOrg();
  const start = dayjs().add(90, 'second');
  const end = dayjs().add(30, 'minute');

  expect(await prisma.botCall.count()).toEqual(0);

  await prisma.customerCall.create({
    data: {
      eventId: '123',
      provider: 'ZOOM',
      organizerId: membershipId,
      scheduledAt: start.toISOString(),
      scheduledEndAt: end.toISOString(),
      timezone: 'Europe/Warsaw',
      data: {
        zoom: {
          id: '89404747101',
          url: 'https://codility.zoom.us/j/89404747101?pwd=7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1',
          password: '7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1',
          customerDomain: 'codility',
        },
      },
    },
  });

  const botCalls = await BotCallService.selectAndMarkForSchedule();

  expect(botCalls.length).toEqual(1);
  expect(botCalls[0].data).toEqual(
    '{"zoom":{"id":"89404747101","url":"https://codility.zoom.us/j/89404747101?pwd=7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1","password":"7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1","customerDomain":"codility"}}'
  );
  expect(botCalls[0].provider).toEqual('ZOOM');

  expect(await prisma.botCall.count()).toEqual(1);

  const botCall = await prisma.botCall.findFirstOrThrow();
  expect(botCall.data).toEqual(
    '{"zoom":{"id":"89404747101","url":"https://codility.zoom.us/j/89404747101?pwd=7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1","password":"7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1","customerDomain":"codility"}}'
  );
  expect(botCall.status).toEqual('MARKED_FOR_SCHEDULE');
});

test('should not mark for schedule calls that are later than 90 seconds ', async () => {
  const { membershipId } = await defaultUserAndOrg();
  const start = dayjs().add(91, 'second');
  const end = dayjs().add(30, 'minute');

  expect(await prisma.botCall.count()).toEqual(0);

  await prisma.customerCall.create({
    data: {
      eventId: '123',
      provider: 'ZOOM',
      organizerId: membershipId,
      scheduledAt: start.toISOString(),
      scheduledEndAt: end.toISOString(),
      timezone: 'Europe/Warsaw',
      data: {
        zoom: {
          id: '89404747101',
          url: 'https://codility.zoom.us/j/89404747101?pwd=7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1',
          password: '7QoEqiQccaSpHmhUTHCLvmRyjGRhrI.1',
          customerDomain: 'codility',
        },
      },
    },
  });

  const botCalls = await BotCallService.selectAndMarkForSchedule();

  expect(botCalls.length).toEqual(0);
  expect(await prisma.botCall.count()).toEqual(0);
});

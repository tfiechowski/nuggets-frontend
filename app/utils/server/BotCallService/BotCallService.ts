import { prisma } from '@/lib/db';
import { BotCallStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

export class BotCallService {
  public static async selectAndMarkForSchedule() {
    const interval = dayjs().add(90, 'second').toISOString();

    return await prisma.$transaction(async (tx) => {
      const callsToSchedule = await tx.customerCall.findMany({
        where: {
          scheduledAt: {
            lte: interval,
          },
        },
      });

      // Prisma cannot return created rows directly from createMany, use idempotencyKey to return them
      const key = randomUUID();
      await tx.botCall.createMany({
        data: callsToSchedule.map((call) => ({
          id: call.id,
          callId: call.id,
          data: JSON.stringify(call.data),
          organizer: call.organizerId,
          provider: call.provider,
          scheduledAt: call.scheduledAt,
          scheduledEndAt: call.scheduledEndAt,
          status: BotCallStatus.MARKED_FOR_SCHEDULE,
          idempotencyKey: key,
          timezone: call.timezone,
        })),
        skipDuplicates: true,
      });

      const botCalls = tx.botCall.findMany({
        where: {
          idempotencyKey: key,
        },
      });

      return botCalls;
    });
  }

  public static async markCalls(botCallIds: Array<string>, status: BotCallStatus) {
    return prisma.botCall.updateMany({
      where: { id: { in: botCallIds } },
      data: {
        status,
      },
    });
  }
}

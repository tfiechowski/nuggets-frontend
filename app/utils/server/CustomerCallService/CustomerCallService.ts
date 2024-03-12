import { prisma } from '@/lib/db';

export class CustomerCallService {
  public static async getCalls(organizationId: string) {
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
}

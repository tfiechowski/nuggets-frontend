import { UserMembership } from '@/app/utils/server/getUserTeam';
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
}

import { prisma } from '@/lib/db';
import { UserMembership } from '@/app/utils/server/getUserTeam';

export class CallNoteService {
  public static async getByCustomerCallId(id: string) {
    return prisma.callNote.findFirstOrThrow({
      where: {
        customerCallId: {
          equals: id,
        },
      },
    });
  }

  public static async create(customerCallId: string) {
    return prisma.callNote.create({
      data: {
        content: '',
        customerCall: {
          connect: {
            id: customerCallId,
          },
        },
      },
    });
  }

  public static async updateContent(userMembership: UserMembership, id: string, content: string) {
    return prisma.callNote.update({
      data: {
        content,
      },
      where: {
        id,
        customerCall: {
          organizer: {
            userId: {
              equals: userMembership.userId,
            },
          },
        },
      },
    });
  }
}

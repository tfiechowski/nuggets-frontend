import { UserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';
import { Battlecard, MembershipRole } from '@prisma/client';

export class BattlecardsService {
  public static async createNewCompetitor(
    userMembership: UserMembership,
    competitorName: string
  ): Promise<any> {
    if (
      ![MembershipRole.ADMIN.toString(), MembershipRole.OWNER.toString()].includes(
        userMembership.role.toString()
      )
    ) {
      throw new Error('Unsufficient role');
    }

    return await prisma.$transaction(async (tx) => {
      const res = await tx.competitor.create({
        data: {
          name: competitorName,
          organizationId: userMembership.organization.id,
          battlecard: {
            create: {
              content: '# Sample battlecard title',
            },
          },
        },
      });

      return res;
    });
  }

  public static async listBattlecards(userMembership: UserMembership) {
    return prisma.battlecard.findMany({
      where: {
        competitor: {
          organizationId: {
            equals: userMembership.organization.id,
          },
        },
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        competitor: true,
      },
    });
  }

  public static async updateContent(userMembership: UserMembership, id: string, content: string) {
    await prisma.battlecard.update({
      data: {
        content,
      },
      where: {
        id,
        competitor: {
          organizationId: {
            equals: userMembership.organization.id,
          },
        },
      },
    });
  }

  public static async delete(userMembership: UserMembership, id: string) {
    // todo: in the future, this should be handled to just remove
    // battlecard, not customer

    return await prisma.$transaction(async (tx) => {
      const battlecard = await tx.battlecard.findFirstOrThrow({
        where: {
          id: { equals: id },
          competitor: {
            organizationId: { equals: userMembership.organization.id },
          },
        },
      });

      await tx.battlecard.delete({
        where: {
          id: battlecard.id,
        },
      });

      await tx.competitor.delete({
        where: {
          id: battlecard.competitorId,
          organizationId: {
            equals: userMembership.organization.id,
          },
        },
      });
    });
  }
}

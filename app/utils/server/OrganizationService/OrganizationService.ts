import { prisma } from '@/lib/db';
import { MembershipRole } from '@prisma/client';

export class OrganizationService {
  public static async createOrganization(userId: string, name: string) {
    return prisma.organization.create({
      data: {
        name,
        membership: {
          create: {
            userId,
            role: MembershipRole.OWNER,
          },
        },
      },
    });
  }

  public static async getOrganizationMembers(organizationId: string) {
    return prisma.user.findMany({
      where: {
        memberships: {
          every: {
            organizationId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        memberships: true,
        name: true,
      },
    });
  }

  public static async getOrganizationInvitations(organizationId: string) {
    return prisma.organizationInvitation.findMany({
      where: {
        organizationId,
      },
    });
  }

  public static async getUserOrganisations(userId: string) {
    return prisma.organization.findMany({
      where: {
        membership: {
          some: {
            userId,
          },
        },
      },
    });
  }
}

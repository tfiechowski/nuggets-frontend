import { prisma } from '@/lib/db';
import dayjs from 'dayjs';
import { MembershipRole, OrganizationInvitation, User } from '@prisma/client';

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
    const users = await prisma.user.findMany({
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

    return users.map((user) => ({
      ...user,
      memberships: undefined,
      role: user.memberships.find((membership) => membership.organizationId === organizationId)
        ?.role as MembershipRole,
    }));
  }

  public static async getOrganizationInvitations(organizationId: string) {
    return prisma.organizationInvitation.findMany({
      where: {
        organizationId,
      },
    });
  }

  public static async inviteUser(
    organizationId: string,
    userId: string,
    role: MembershipRole
  ): Promise<OrganizationInvitation> {
    await prisma.membership.create({
      data: {
        organizationId,
        userId,
        role,
      },
    });

    return prisma.organizationInvitation.create({
      data: {
        organizationId,
        userId,
      },
    });
  }

  public static async acceptInvite(invitationId: string) {
    const invitation = await prisma.organizationInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (invitation === null) {
      return { error: 'Cannot accept invitation' };
    }

    const sevenDaysAgo = dayjs().subtract(7, 'days').format();

    if (invitation.createdAt.toISOString() < sevenDaysAgo) {
      throw new Error('Invitation no longer valid');
    }

    prisma.organization.delete({
      where: {
        id: invitationId,
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

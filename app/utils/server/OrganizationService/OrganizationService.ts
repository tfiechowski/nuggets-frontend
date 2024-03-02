import { prisma } from '@/lib/db';

export class OrganizationService {
  public static async createOrganization(userId: string, name: string) {
    return prisma.organization.create({
      data: {
        name,
        membership: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
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

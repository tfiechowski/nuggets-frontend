import { prisma } from '@/lib/db';
import { User } from '@prisma/client';

export class UserService {
  public static async exists(email: string): Promise<boolean> {
    const result = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return result !== null;
  }

  public static async getByEmail(email: string): Promise<User> {
    return prisma.user.findUniqueOrThrow({ where: { email } });
  }
}

import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { MembershipRole } from '@prisma/client';

export async function getUserRole(): Promise<MembershipRole> {
  const { role } = await getUserMembership();

  return role;
}

import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUserId } from '@/app/utils/server/getUserId';
import { Membership, MembershipRole } from '@prisma/client';

export interface UserMembership {
  organization: { id: string };
  role: MembershipRole;
  team: { id: string; name: string };
  userId: string;
  membershipId: string;
}

export async function getUserMembership(): Promise<UserMembership> {
  // TODO: move this to repo/service method?
  const userId = await getUserId();

  const r = await prisma.membership.findMany({
    where: {
      userId,
    },
    select: {
      role: true,
      organization: true,
      id: true,
    },
  });

  const result = r.map((m) => ({ ...m.organization, role: m.role, membershipId: m.id }));

  if (result.length > 1) {
    console.warn('User has more than one team');
  }

  const team = result[0];

  if (!team) {
    // should be handled by global catch?
    return redirect('/app/team/create');
  }
  // Redirect here?

  const res = result.map((t) => ({
    userId,
    organization: { id: t.id },
    role: t.role,
    team: { id: t.id, name: t.name },
    membershipId: t.membershipId,
  }))[0];
  return res;
}

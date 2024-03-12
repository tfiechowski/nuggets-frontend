import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUserId } from '@/app/utils/server/getUserId';
import { MembershipRole } from '@prisma/client';

export async function getUserOrganization(): Promise<{
  organizationId: string;
  role: MembershipRole;
  name: string;
}> {
  // TODO: move this to repo/service method?
  const userId = await getUserId();

  const r = await prisma.membership.findMany({
    where: {
      userId,
    },
    select: {
      role: true,
      organization: true,
    },
  });

  const result = r.map((m) => ({ ...m.organization, role: m.role }));

  if (result.length > 1) {
    console.warn('User has more than one team');
  }

  const team = result[0];

  if (!team) {
    // should be handled by global catch?
    return redirect('/app/team/create');
  }
  // Redirect here?

  const res = result.map((t) => ({ accountId: t.id, role: t.role, name: t.name }))[0];
  return res;
}

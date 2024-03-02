import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function getUserTeam(): Promise<{
  accountId: string;
  role: any;
  name: string;
}> {
  const supabase = getServerSupabaseClient();

  const user = await supabase.auth.getUser();

  const userId = user.data.user?.id;

  if (userId === undefined) {
    throw new Error('Invalid user session. No userId');
  }

  const result = await prisma.organization.findMany({
    where: {
      membership: {
        every: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      membership: true,
    },
  });
  console.log('🚀 ~ getUserTeam ~ result:', JSON.stringify(result));

  if (result.length > 1) {
    console.warn('User has more than one team');
  }

  const team = result[0];

  if (!team) {
    // should be handled by global catch?
    return redirect('/app/team/create');
  }
  // Redirect here?

  const res = result.map((t) => ({ accountId: t.id, role: t.membership[0].role, name: t.name }))[0];
  return res;
}

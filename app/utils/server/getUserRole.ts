import { getUserTeam } from '@/app/utils/server/getUserTeam';

export async function getUserRole(): Promise<'member' | 'owner'> {
  const { role } = await getUserTeam();

  return role;
}

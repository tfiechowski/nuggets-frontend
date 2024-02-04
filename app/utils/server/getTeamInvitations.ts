import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserTeam } from '@/app/utils/server/getUserTeam';

export async function getTeamInvitations(): Promise<number> {
  const supabase = getServerSupabaseClient();

  const userTeamAccount = await getUserTeam();

  const { data, error } = await supabase.rpc('get_account_invitations', {
    account_id: userTeamAccount.accountId,
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data.length;
}

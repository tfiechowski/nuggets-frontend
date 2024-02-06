import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserTeam } from '@/app/utils/server/getUserTeam';

export async function getTeamInvitations(): Promise<number> {
  const supabase = getServerSupabaseClient();
  const user = await supabase.auth.getUser();

  const userTeamAccount = await getUserTeam();

  const response = await supabase.rpc('get_account_invitations', {
    account_id: userTeamAccount.accountId,
  });
  const { data, error } = response;

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  if (data) {
    return data.length;
  }

  console.error(
    `Error listing invitations for account: ${userTeamAccount.accountId} by ${user.data.user?.email}. Response data was null, not an array as expected.`
  );
  return 0;
}

import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';

export async function getUserTeam(): Promise<{ accountId: string; role: 'member' | 'owner' }> {
  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase.rpc('get_accounts');

  if (error) {
    throw new Error(error.message);
  }

  const team = data.find((account: any) => account.personal_account === false);

  if (!team) {
    // should be handled by global catch?
    throw new Error('User has no team');
  }
  // Redirect here?

  return { accountId: team.account_id, role: team.account_role };
}

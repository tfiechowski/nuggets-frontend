import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { redirect } from 'next/navigation';

export async function getUserTeam(): Promise<{
  accountId: string;
  role: 'member' | 'owner';
  name: string;
}> {
  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase.rpc('get_accounts');

  if (error) {
    throw new Error(error.message);
  }

  const team = data.find((account: any) => account.personal_account === false);

  if (!team) {
    // should be handled by global catch?
    return redirect('/team/create');
  }
  // Redirect here?

  return { accountId: team.account_id, role: team.account_role, name: team.account_name };
}

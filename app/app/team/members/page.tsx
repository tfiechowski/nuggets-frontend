'use server';

import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';

async function getUserTeam(): Promise<{ accountId: string }> {
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

  return { accountId: team.account_id };
}

async function getMembers() {
  const supabase = getServerSupabaseClient();

  const userTeamAccount = await getUserTeam();

  return supabase.rpc('get_account_members', {
    account_id: userTeamAccount.accountId,
  });
}

export default async function Manage() {
  const members = await getMembers();

  return (
    <div>
      Members!
      <div>{JSON.stringify(members)}</div>
    </div>
  );
}

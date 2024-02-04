import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserTeam } from '@/app/utils/server/getUserTeam';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  name: string;
  email: string;
  role: string;
};

export async function getTeamMembers(): Promise<User[]> {
  const supabase = getServerSupabaseClient();

  const userTeamAccount = await getUserTeam();

  const { data, error } = await supabase.rpc('get_account_members', {
    account_id: userTeamAccount.accountId,
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data.map((member: any) => ({
    name: member.name,
    email: member.email,
    role: member.account_role,
  }));
}

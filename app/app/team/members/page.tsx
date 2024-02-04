import { DataTable } from '@/app/app/team/members/MembersTable';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  name: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

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

async function getMembers(): Promise<User[]> {
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

export default async function Manage() {
  const members = await getMembers();
  console.log('🚀 ~ Manage ~ members:', members);

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your team members</h2>
        </div>
      </div>
      <DataTable columns={columns} data={members} />
    </div>
  );
}

import { DataTable } from '@/app/app/team/members/MembersTable';
import { getTeamMembers } from '@/app/utils/server/getTeamMembers';
import { getUserTeam } from '@/app/utils/server/getUserTeam';
import { Button } from '@/registry/new-york/ui/button';
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

async function getIsTeamOwner() {
  const team = await getUserTeam();

  return team.role === 'owner';
}

export default async function Manage() {
  const members = await getTeamMembers();
  const isTeamOwner = await getIsTeamOwner();

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your team members</h2>
        </div>
        {isTeamOwner && (
          <div className="flex  items-center space-x-2">
            <Button variant="outline">Invite</Button>
          </div>
        )}
      </div>
      <DataTable columns={columns} data={members} />
    </div>
  );
}

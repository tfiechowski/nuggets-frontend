import { DataTable } from '@/app/app/team/members/MembersTable';
import { UserInviteDialog } from '@/app/app/team/members/UserInviteDialog';
import { getUserOrganization } from '@/app/utils/server/getUserTeam';

import { ColumnDef } from '@tanstack/react-table';
import { OrganizationService } from '@/app/utils/server/OrganizationService';
import { MembershipRole } from '@prisma/client';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  name: string;
  email: string;
  role: MembershipRole;
};

const columns: ColumnDef<User>[] = [
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
  const team = await getUserOrganization();

  return team.role === MembershipRole.OWNER;
}

export default async function Manage() {
  const userOrganization = await getUserOrganization();
  const members = await OrganizationService.getOrganizationMembers(userOrganization.accountId);
  const isTeamOwner = await getIsTeamOwner();

  const invitations = await OrganizationService.getOrganizationInvitations(
    userOrganization.accountId
  );

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your team members</h2>
        </div>
        {isTeamOwner && (
          <div className="flex  items-center space-x-2">
            <UserInviteDialog />
          </div>
        )}
      </div>
      <DataTable columns={columns} data={members} />

      <div className="py-8">
        <h3 className="text-xl font-bold tracking-tight pb-8">Invitations</h3>
        <div>You have {invitations.length} pending invitations</div>
      </div>
    </div>
  );
}

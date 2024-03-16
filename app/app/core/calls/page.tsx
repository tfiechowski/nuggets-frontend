import { DataTable } from '@/app/app/team/members/DataTable';
import { CustomerCallService } from '@/app/utils/server/CustomerCallService';
import { getUserMembership } from '@/app/utils/server/getUserTeam';

import { CustomerCall } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<CustomerCall>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'scheduledAt',
    header: 'Date',
  },
];

export default async function Calls() {
  const userMembership = await getUserMembership();
  const calls = await CustomerCallService.getCalls(userMembership.organization.id);

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Calls</h2>
      </div>

      <div className="py-8">
        <DataTable columns={columns} data={calls} />
      </div>
    </div>
  );
}

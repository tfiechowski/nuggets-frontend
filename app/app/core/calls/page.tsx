import { CallsTable } from '@/app/app/core/calls/Table';
import { CustomerCallService } from '@/app/utils/server/CustomerCallService';
import { getUserMembership } from '@/app/utils/server/getUserTeam';

export default async function Calls() {
  const userMembership = await getUserMembership();
  const calls = await CustomerCallService.getCalls(userMembership.organization.id);

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Calls</h2>
      </div>

      <div className="py-8">
        <CallsTable data={calls} />
      </div>
    </div>
  );
}

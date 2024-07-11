import { CallsTable } from '@/app/app/core/calls/Table';
import { CustomerCallService } from '@/app/utils/server/CustomerCallService';
import { getUserMembership } from '@/app/utils/server/getUserTeam';

export default async function Calls() {
  const userMembership = await getUserMembership();
  const upcomingCalls = await CustomerCallService.getUpcoming(userMembership);
  const pastCalls = await CustomerCallService.getPastCalls(userMembership);

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Calls</h2>
      </div>

      <div className="py-8">
        <CallsTable data={upcomingCalls} />
      </div>

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Past calls</h2>
      </div>

      <div className="py-8">
        <CallsTable data={pastCalls} />
      </div>
    </div>
  );
}

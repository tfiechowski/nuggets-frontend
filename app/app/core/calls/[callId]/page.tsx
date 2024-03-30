import { ReadOnlyEditor } from '@/app/app/core/competitors/Editor';
import { CallNoteService } from '@/app/utils/server/CallNoteService';
import { CustomerCallService } from '@/app/utils/server/CustomerCallService';
import { UnauthorizedError } from '@/app/utils/server/errors';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import get from 'lodash/get';

import { CustomerCall } from '@prisma/client';

const loadCall = async (id: string): Promise<CustomerCall> => {
  'use server';

  const userMembership = await getUserMembership();
  return CustomerCallService.getCall(id, userMembership);
};
export default async function Page({ params }: { params: { callId: string } }) {
  try {
    const call = await loadCall(params.callId);

    if (call === null) {
      return <div>Not found!</div>;
    }

    const note = await CallNoteService.getByCustomerCallId(call.id);
    const customerDomain = get(call.data, 'zoom.customerDomain', null);

    return (
      <div className="h-screen">
        <div className="py-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {call.title}

            {customerDomain && <span> with {customerDomain}</span>}
          </h2>
          <h4 className="text-m tracking-tight">{call.scheduledAt.toString()}</h4>
        </div>
        <div className="py-8">
          <h2 className="text-xl font-bold tracking-tight">Notes</h2>
          <ReadOnlyEditor initialContent={note.content} />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return <div>Unauthorized</div>;
    }
    return <div>404!</div>;
  }
}

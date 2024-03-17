import { Battlecards } from '@/app/call/[callId]/Battlecards';
import { Note } from '@/app/call/[callId]/Note';
import { BattlecardsService } from '@/app/utils/server/BattlecardsService';
import { CallNoteService } from '@/app/utils/server/CallNoteService';
import { UnauthorizedError } from '@/app/utils/server/errors';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';

const handleUpdateNote = async (id: string, content: string) => {
  'use server';
  const userMembership = await getUserMembership();

  return CallNoteService.updateContent(userMembership, id, content);
};

export default async function Page({ params }: { params: { callId: string } }) {
  try {
    const userMembership = await getUserMembership();
    const call = await prisma.customerCall.findUnique({
      where: {
        id: params.callId,
        organizer: {
          organizationId: userMembership.organization.id,
        },
      },
    });

    if (call === null) {
      return <div>Not found! TODO: Add some sales pitch, swag here!</div>;
    }

    const battlecards = await BattlecardsService.listBattlecards(userMembership);
    const note = await CallNoteService.getByCustomerCallId(call.id);

    return (
      <div>
        <Battlecards battlecards={battlecards} call={call} />

        <Note note={note} onUpdate={handleUpdateNote} />
      </div>
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return <div>Unauthorized</div>;
    }
    return <div>404!</div>;
  }
}

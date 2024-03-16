import { Battlecards } from '@/app/call/[callId]/Battlecards';
import { BattlecardsService } from '@/app/utils/server/BattlecardsService';
import { UnauthorizedError } from '@/app/utils/server/errors';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { prisma } from '@/lib/db';

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

    return <Battlecards battlecards={battlecards} call={call} />;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return <div>Unauthorized</div>;
    }
    return <div>404!</div>;
  }
}

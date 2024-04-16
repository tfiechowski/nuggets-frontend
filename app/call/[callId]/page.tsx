import { Battlecards } from '@/app/call/[callId]/Battlecards';
import { Note } from '@/app/call/[callId]/Note';
import { Playbooks } from '@/app/call/[callId]/Playbooks';
import { BattlecardsService } from '@/app/utils/server/BattlecardsService';
import { CallNoteService } from '@/app/utils/server/CallNoteService';
import { PlaybookService } from '@/app/utils/server/PlaybookService';
import { UnauthorizedError } from '@/app/utils/server/errors';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { prisma } from '@/lib/db';

const handleUpdateNote = async (id: string, content: string) => {
  'use server';
  const userMembership = await getUserMembership();

  return CallNoteService.updateContent(userMembership, id, content);
};

const handleUpdatePlaybook = async (id: string, content: string) => {
  'use server';
  const userMembership = await getUserMembership();

  return PlaybookService.updateContent(userMembership, id, content);
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

    const [battlecards, note, playbooks] = await Promise.all([
      BattlecardsService.listBattlecards(userMembership),
      CallNoteService.getByCustomerCallId(call.id),
      PlaybookService.getPlaybooks(userMembership, call.id),
    ]);

    return (
      <div className="h-screen">
        <Tabs defaultValue="playbooks" className="w-[440px] h-full flex flex-col">
          <TabsContent value="battlecards" className="flex-1 overflow-y-scroll">
            <Battlecards battlecards={battlecards} call={call} />
          </TabsContent>

          <TabsContent value="notes" className="flex-1 overflow-y-scroll">
            <Note note={note} onUpdate={handleUpdateNote} />
          </TabsContent>

          <TabsContent value="playbooks" className="flex-1 overflow-y-scroll">
            <Playbooks playbooks={playbooks} onUpdate={handleUpdatePlaybook} />
          </TabsContent>

          <TabsList className="grid w-full grid-cols-3 flex-none">
            <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="battlecards">Battlecards</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.log('🚀 ~ Page ~ error:', error);
    if (error instanceof UnauthorizedError) {
      return <div>Unauthorized</div>;
    }
    return <div>404!</div>;
  }
}

import { CreateNewCompetitorNoteDialog } from '@/app/app/core/battlecards/CreateNewCompetitorNoteDialog';
import { DeleteConfirmationDialog } from '@/app/app/core/battlecards/DeleteConfirmationDialog';
import Editor from '@/app/app/core/battlecards/Editor';
import { BattlecardsService } from '@/app/utils/server/BattlecardsService';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import '@blocknote/react/style.css';
import { MembershipRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import './blocknote-styles.css';

interface CompetitorNote {
  id: string;
  competitor_name: string;
  content: string;
}

const handleUpdateNote = async (id: string, content: string) => {
  'use server';
  const userMembership = await getUserMembership();

  await BattlecardsService.updateContent(userMembership, id, content);

  revalidatePath('/app/core/battlecards');
};

const handleCreateNote = async (competitorName: string): Promise<CompetitorNote> => {
  'use server';
  const userMembership = await getUserMembership();

  const response = await BattlecardsService.createNewCompetitor(userMembership, competitorName);

  if (response.error) {
    throw new Error(response.error.message);
  }

  revalidatePath('/app/core/battlecards');

  return response.data;
};

const handleDeleteNote = async (id: string) => {
  'use server';
  const userMembership = await getUserMembership();
  await BattlecardsService.delete(userMembership, id);

  console.log(`Note ${id} deleted by user: ${userMembership.userId}`);

  revalidatePath('/app/core/battlecards');
};

export default async function App() {
  const userMembership = await getUserMembership();
  const battlecards = await BattlecardsService.listBattlecards(userMembership);

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your battle cards</h2>
        </div>
        {userMembership.role === MembershipRole.OWNER && (
          <div className="flex  items-center space-x-2">
            <CreateNewCompetitorNoteDialog onCreate={handleCreateNote} />
          </div>
        )}
      </div>

      <Accordion type="single" collapsible>
        {battlecards?.map((battlecard) => (
          <div className="p-2">
            <AccordionItem value={battlecard.id}>
              <AccordionTrigger>{battlecard.competitor.name}</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-between space-y-2">
                  <div>Note:</div>
                  <DeleteConfirmationDialog id={battlecard.id} onDelete={handleDeleteNote} />
                </div>

                <Editor
                  editable={userMembership.role === MembershipRole.OWNER}
                  initialContent={battlecard.content}
                  noteId={battlecard.id}
                  onUpdate={handleUpdateNote}
                />
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
}

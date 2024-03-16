import { CreateNewCompetitorNoteDialog } from '@/app/app/core/competitors/CreateNewCompetitorNoteDialog';
import Editor from '@/app/app/core/competitors/Editor';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserRole } from '@/app/utils/server/getUserRole';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import '@blocknote/react/style.css';
import { revalidatePath } from 'next/cache';
import './blocknote-styles.css';
import { Button } from '@/registry/new-york/ui/button';
import { DeleteConfirmationDialog } from '@/app/app/core/competitors/DeleteConfirmationDialog';
import { MembershipRole } from '@prisma/client';
import { BattlecardsService } from '@/app/utils/server/BattlecardsService';

interface CompetitorNote {
  id: string;
  competitor_name: string;
  content: string;
}

const handleUpdateNote = async (id: string, content: string) => {
  'use server';
  const userMembership = await getUserMembership();

  return BattlecardsService.updateContent(userMembership, id, content);
};

const handleCreateNote = async (competitorName: string): Promise<CompetitorNote> => {
  'use server';
  const userMembership = await getUserMembership();

  const response = await BattlecardsService.createNewCompetitor(userMembership, competitorName);

  // const { data, error } = await supabase
  //   .from('competitor_notes')
  //   .insert({
  //     content: '# Sample note',
  //     competitor_name: competitorName,
  //     account_id: userMembership.organization.id,
  //   })
  //   .returns<CompetitorNote>();

  if (response.error) {
    throw new Error(response.error.message);
  }

  revalidatePath('/app/core/competitors');

  return response.data;
};

const handleDeleteNote = async (id: string) => {
  'use server';
  const userMembership = await getUserMembership();
  await BattlecardsService.delete(userMembership, id);

  console.log(`Note ${id} deleted by user: ${userMembership.userId}`);

  revalidatePath('/app/core/competitors');
};

export default async function App() {
  const competitiveNotes = getServerSupabaseClient();
  const userMembership = await getUserMembership();
  const battlecards = await BattlecardsService.listBattlecards(userMembership);

  const { data } = await competitiveNotes.from('competitor_notes').select('*').order('created_at');

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

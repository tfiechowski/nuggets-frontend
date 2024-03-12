import { CreateNewCompetitorNoteDialog } from '@/app/app/core/competitors/CreateNewCompetitorNoteDialog';
import Editor from '@/app/app/core/competitors/Editor';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserRole } from '@/app/utils/server/getUserRole';
import { getUserOrganization } from '@/app/utils/server/getUserTeam';
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

interface CompetitorNote {
  id: string;
  competitor_name: string;
  content: string;
}

const handleUpdateNote = async (id: string, content: string) => {
  'use server';
  const supabase = getServerSupabaseClient();

  await supabase.from('competitor_notes').update({ content }).eq('id', id);
};

const handleCreateNote = async (competitorName: string): Promise<CompetitorNote> => {
  'use server';
  const supabase = getServerSupabaseClient();
  const team = await getUserOrganization();

  const { data, error } = await supabase
    .from('competitor_notes')
    .insert({
      content: '# Sample note',
      competitor_name: competitorName,
      account_id: team.organizationId,
    })
    .returns<CompetitorNote>();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/app/core/competitors');

  return data;
};

const handleDeleteNote = async (id: string) => {
  'use server';
  const supabase = getServerSupabaseClient();
  const user = await supabase.auth.getUser();

  await supabase.from('competitor_notes').delete().eq('id', id);

  console.log(`Note ${id} deleted by user: ${user.data.user?.email}`);

  revalidatePath('/app/core/competitors');
};

export default async function App() {
  const competitiveNotes = getServerSupabaseClient();
  const userRole = await getUserRole();
  const { data } = await competitiveNotes.from('competitor_notes').select('*').order('created_at');

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your battle cards</h2>
        </div>
        {userRole === MembershipRole.OWNER && (
          <div className="flex  items-center space-x-2">
            <CreateNewCompetitorNoteDialog onCreate={handleCreateNote} />
          </div>
        )}
      </div>

      <Accordion type="single" collapsible>
        {data?.map((competitorNote) => (
          <div className="p-2">
            <AccordionItem value={competitorNote.id}>
              <AccordionTrigger>{competitorNote.competitor_name}</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-between space-y-2">
                  <div>Note:</div>
                  <DeleteConfirmationDialog id={competitorNote.id} onDelete={handleDeleteNote} />
                </div>

                <Editor
                  editable={userRole === MembershipRole.OWNER}
                  initialContent={competitorNote.content}
                  noteId={competitorNote.id}
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

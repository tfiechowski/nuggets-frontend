import Editor from '@/app/app/core/competitors/Editor';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserTeam } from '@/app/utils/server/getUserTeam';
import { Button } from '@/registry/new-york/ui/button';
import '@blocknote/react/style.css';
import { revalidatePath } from 'next/cache';
import './blocknote-styles.css';

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

const handleCreateNote = async (): Promise<CompetitorNote> => {
  'use server';
  const supabase = getServerSupabaseClient();
  const team = await getUserTeam();

  const { data, error } = await supabase
    .from('competitor_notes')
    .insert({ content: '# Sample note', competitor_name: 'Test Name', account_id: team.accountId })
    .returns<CompetitorNote>();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/app/core/competitors');

  return data;
};

export default async function App() {
  const competitiveNotes = getServerSupabaseClient();
  const { data } = await competitiveNotes.from('competitor_notes').select('*').order('created_at');

  return (
    <div>
      <form action={handleCreateNote}>
        <Button>Add new</Button>
      </form>
      {data?.map((competitorNote) => (
        <div>
          <h2>{competitorNote.competitor_name}</h2>

          <Editor
            initialContent={competitorNote.content}
            noteId={competitorNote.id}
            onUpdate={handleUpdateNote}
          />
        </div>
      ))}
    </div>
  );
}

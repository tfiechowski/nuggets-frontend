import Editor from '@/app/app/core/battlecards/Editor';
import { CallNote } from '@prisma/client';

export function Note({
  note,
  onUpdate,
}: {
  note: CallNote;
  onUpdate: (id: string, content: string) => void;
}) {
  return (
    <div>
      <Editor editable={true} initialContent={note.content} noteId={note.id} onUpdate={onUpdate} />
    </div>
  );
}

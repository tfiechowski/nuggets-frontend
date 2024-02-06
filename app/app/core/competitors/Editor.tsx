'use client';

import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';
import './blocknote-styles.css';
import { useDebounceCallback } from 'usehooks-ts';
import { useCallback } from 'react';
// import './styles-compiled.css'

export default function Editor({
  initialContent,
  noteId,
  onUpdate,
}: {
  initialContent: string;
  noteId: string;
  onUpdate: (id: string, content: string) => void;
}) {
  const debouncedSaveContent = useDebounceCallback(onUpdate, 200);

  const editor = useBlockNote({
    onEditorReady: async (editor) => {
      const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
      editor.replaceBlocks(editor.topLevelBlocks, blocks);
    },
    onEditorContentChange: async (editor) => {
      const markdown = await editor.blocksToMarkdownLossy();
      debouncedSaveContent(noteId, markdown);
      editor.tryParseMarkdownToBlocks;
    },
  });

  return <BlockNoteView editor={editor} />;
}

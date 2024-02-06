'use client';

import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';
import { useDebounceCallback } from 'usehooks-ts';
import './blocknote-styles.css';

export default function Editor({
  initialContent,
  editable,
  noteId,
  onUpdate,
}: {
  editable: boolean;
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
    domAttributes: {
      blockContainer: {
        class: 'block-container',
      },
    },
    defaultStyles: false,
    editable,
  });

  return <BlockNoteView editor={editor} />;
}

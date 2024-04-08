'use client';

import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';
import { useDebounceCallback } from 'usehooks-ts';
import './blocknote-styles.css';

const defaultDomAttributes = {
  blockContainer: {
    class: 'block-container',
  },
};

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
      ...defaultDomAttributes,
    },
    defaultStyles: false,
    editable,
  });

  return <BlockNoteView editor={editor} />;
}

export function ReadOnlyEditor({ initialContent }: { initialContent: string }) {
  const editor = useBlockNote({
    onEditorReady: async (editor) => {
      const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
      editor.replaceBlocks(editor.topLevelBlocks, blocks);
    },
    domAttributes: {
      ...defaultDomAttributes,
    },
    editable: false,
    defaultStyles: false,
  });

  return <BlockNoteView editor={editor} />;
}

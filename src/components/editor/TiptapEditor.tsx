
import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEditorStore } from '@/stores/editorStore';
import { Card, CardContent } from '@/components/ui/card';

interface TiptapEditorProps {
  placeholder?: string;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  placeholder = "Start writing...",
  readOnly = false,
  onFocus,
  onBlur
}) => {
  const { setEditor, content, setContent } = useEditorStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  useEffect(() => {
    setEditor(editor);
    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const focusEditor = useCallback(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardContent className="p-6">
        <div 
          className="min-h-[500px] p-4 bg-white rounded-lg text-slate-800 cursor-text relative prose prose-sm max-w-none"
          onClick={focusEditor}
        >
          <EditorContent 
            editor={editor}
            className="min-h-[500px] focus:outline-none"
          />
          {!editor?.getText() && (
            <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TiptapEditor;

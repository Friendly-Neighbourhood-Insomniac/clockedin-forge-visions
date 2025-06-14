
import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEditorStore } from '@/stores/editorStore';
import { Card, CardContent } from '@/components/ui/card';
import { ResizableImage } from './extensions/ResizableImage';
import { Mathematics } from './extensions/Mathematics';

const lowlight = createLowlight(common);

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
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-400 underline hover:text-cyan-300',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Mathematics,
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
          className="min-h-[500px] p-4 bg-white rounded-lg text-slate-800 cursor-text relative"
          onClick={focusEditor}
        >
          <EditorContent 
            editor={editor}
            className="min-h-[500px] focus:outline-none prose prose-sm max-w-none
              [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:outline-none
              [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:border-spacing-0
              [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:p-2
              [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_th]:bg-gray-100
              [&_.task-list]:list-none [&_.task-item]:flex [&_.task-item]:items-start
              [&_.math-block]:bg-gray-50 [&_.math-block]:p-2 [&_.math-block]:rounded [&_.math-block]:my-2
              [&_.resizable-image-wrapper]:relative [&_.resizable-image-wrapper]:inline-block
              [&_.resize-handles]:absolute [&_.resize-handles]:inset-0 [&_.resize-handles]:pointer-events-none
              [&_.resize-handle]:absolute [&_.resize-handle]:w-2 [&_.resize-handle]:h-2 [&_.resize-handle]:bg-blue-500 [&_.resize-handle]:pointer-events-auto
              [&_.resize-handle-nw]:top-0 [&_.resize-handle-nw]:left-0 [&_.resize-handle-nw]:cursor-nw-resize
              [&_.resize-handle-ne]:top-0 [&_.resize-handle-ne]:right-0 [&_.resize-handle-ne]:cursor-ne-resize
              [&_.resize-handle-sw]:bottom-0 [&_.resize-handle-sw]:left-0 [&_.resize-handle-sw]:cursor-sw-resize
              [&_.resize-handle-se]:bottom-0 [&_.resize-handle-se]:right-0 [&_.resize-handle-se]:cursor-se-resize"
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

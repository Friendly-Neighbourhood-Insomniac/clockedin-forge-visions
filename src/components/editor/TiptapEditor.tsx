
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
import FontFamily from '@tiptap/extension-font-family';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEditorStore } from '@/stores/editorStore';
import { Card, CardContent } from '@/components/ui/card';
import { ResizableImage } from './extensions/ResizableImage';
import { Mathematics } from './extensions/Mathematics';
import FloatingToolbar from './FloatingToolbar';
import SaveStatusIndicator from './SaveStatusIndicator';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
  const [floatingToolbar, setFloatingToolbar] = useState({
    show: false,
    position: { top: 0, left: 0 }
  });
  const isUpdatingFromStore = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,
      Color,
      Underline,
      FontFamily,
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
      Mathematics.configure({
        HTMLAttributes: {
          class: 'math-expression bg-gray-50 p-4 rounded border text-center my-4',
        },
      }),
    ],
    content: content || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (!isUpdatingFromStore.current) {
        const html = editor.getHTML();
        setContent(html);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      
      if (hasSelection && !readOnly) {
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        
        setFloatingToolbar({
          show: true,
          position: {
            top: start.top,
            left: (start.left + end.left) / 2
          }
        });
      } else {
        setFloatingToolbar(prev => ({ ...prev, show: false }));
      }
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      setFloatingToolbar(prev => ({ ...prev, show: false }));
      onBlur?.();
    },
    onCreate: ({ editor }) => {
      console.log('TiptapEditor initialized successfully');
    },
  });

  // Auto-save functionality - only save when content actually changes
  const { saveStatus } = useAutoSave({
    content: content || '',
    onSave: (savedContent) => {
      // Auto-save is handled by the parent component through onBlur
      console.log('Content auto-saved');
    },
    delay: 2000 // Increased delay to reduce frequency
  });

  // Keyboard shortcuts
  useKeyboardShortcuts(editor);

  useEffect(() => {
    setEditor(editor);
    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  // Update editor content when store content changes (but not from our own updates)
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      isUpdatingFromStore.current = true;
      editor.commands.setContent(content, false);
      setTimeout(() => {
        isUpdatingFromStore.current = false;
      }, 100);
    }
  }, [content, editor]);

  const focusEditor = useCallback(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  return (
    <>
      <Card className="bg-slate-800/50 border-cyan-400/30">
        <CardContent className="p-6">
          {/* Header with save status */}
          <div className="flex justify-between items-center mb-4">
            <SaveStatusIndicator status={saveStatus} />
            <div className="text-xs text-slate-400">
              Press Ctrl+K for links, Ctrl+H for highlight, Ctrl+1-6 for headings
            </div>
          </div>
          
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
                [&_.math-expression]:bg-gray-50 [&_.math-expression]:p-4 [&_.math-expression]:rounded [&_.math-expression]:my-4 [&_.math-expression]:border
                [&_.resizable-image]:relative [&_.resizable-image]:inline-block [&_.resizable-image]:max-w-full
                sm:text-sm md:text-base lg:text-lg
                touch-manipulation"
            />
            {!editor?.getText() && (
              <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">
                {placeholder}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Floating Toolbar */}
      <FloatingToolbar
        editor={editor}
        show={floatingToolbar.show}
        position={floatingToolbar.position}
      />
    </>
  );
};

export default TiptapEditor;

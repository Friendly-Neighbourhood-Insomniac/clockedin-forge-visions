
import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

export function useKeyboardShortcuts(editor: Editor | null) {
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isModifier = ctrlKey || metaKey;

      if (!isModifier) return;

      switch (key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (shiftKey) {
            editor.chain().focus().redo().run();
          } else {
            editor.chain().focus().undo().run();
          }
          break;
        case 'y':
          event.preventDefault();
          editor.chain().focus().redo().run();
          break;
        case 's':
          event.preventDefault();
          // Save is handled by auto-save
          break;
        case 'k':
          event.preventDefault();
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
          break;
        case 'e':
          event.preventDefault();
          editor.chain().focus().toggleCode().run();
          break;
        case 'd':
          event.preventDefault();
          editor.chain().focus().toggleStrike().run();
          break;
        case 'h':
          event.preventDefault();
          editor.chain().focus().toggleHighlight().run();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          event.preventDefault();
          const level = parseInt(key) as 1 | 2 | 3 | 4 | 5 | 6;
          editor.chain().focus().toggleHeading({ level }).run();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);
}

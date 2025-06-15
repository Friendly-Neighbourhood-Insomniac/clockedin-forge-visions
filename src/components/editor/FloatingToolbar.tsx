
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Link, Highlighter } from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor | null;
  show: boolean;
  position: { top: number; left: number };
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor, show, position }) => {
  if (!editor || !show) return null;

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Bold (Ctrl+B)'
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Italic (Ctrl+I)'
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      title: 'Underline (Ctrl+U)'
    },
    {
      icon: Link,
      action: () => {
        const url = window.prompt('Enter URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: editor.isActive('link'),
      title: 'Add Link (Ctrl+K)'
    },
    {
      icon: Highlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
      title: 'Highlight'
    }
  ];

  return (
    <div
      className="fixed z-50 flex items-center gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        top: position.top - 60,
        left: position.left,
        transform: 'translateX(-50%)'
      }}
    >
      {toolbarButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={index}
            size="sm"
            variant={button.isActive ? "default" : "ghost"}
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};

export default FloatingToolbar;

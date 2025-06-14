
import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Undo,
  Redo,
  Type,
  Palette
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MediaInsertion from './MediaInsertion';

const BLOCK_TYPES = [
  { label: 'H1', command: () => ({ level: 1 }) },
  { label: 'H2', command: () => ({ level: 2 }) },
  { label: 'H3', command: () => ({ level: 3 }) },
];

const EditorToolbar: React.FC = () => {
  const { editor, undo, redo } = useEditorStore();

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.commands.toggleBold();
  const toggleItalic = () => editor.commands.toggleItalic();
  const toggleUnderline = () => {
    // Check if underline is available, if not just log it
    if (editor.commands.toggleUnderline) {
      editor.commands.toggleUnderline();
    } else {
      console.log('Underline command not available');
    }
  };
  const toggleBulletList = () => editor.commands.toggleBulletList();
  const toggleOrderedList = () => editor.commands.toggleOrderedList();
  const toggleBlockquote = () => editor.commands.toggleBlockquote();
  const toggleCodeBlock = () => editor.commands.toggleCodeBlock();

  const setHeading = (level: 1 | 2 | 3) => {
    editor.commands.toggleHeading({ level });
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-400/30 mb-4">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex gap-1 mr-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={undo}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={redo}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Inline Styles */}
          <div className="flex gap-1 mr-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleBold}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('bold') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleItalic}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('italic') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleUnderline}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('underline') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Block Types */}
          <div className="flex gap-1 mr-4">
            {BLOCK_TYPES.map(({ label }, index) => {
              const level = (index + 1) as 1 | 2 | 3;
              return (
                <Button
                  key={label}
                  size="sm"
                  variant="ghost"
                  onClick={() => setHeading(level)}
                  className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                    editor.isActive('heading', { level }) ? 'bg-cyan-600/20 text-cyan-300' : ''
                  }`}
                >
                  {label}
                </Button>
              );
            })}
          </div>

          {/* Lists */}
          <div className="flex gap-1 mr-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleBulletList}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('bulletList') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleOrderedList}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('orderedList') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>

          {/* Media Insertion */}
          <div className="flex gap-1 mr-4 border-l border-slate-600 pl-4">
            <MediaInsertion />
          </div>

          {/* Additional Tools */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleBlockquote}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('blockquote') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Type className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleCodeBlock}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('codeBlock') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Palette className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditorToolbar;

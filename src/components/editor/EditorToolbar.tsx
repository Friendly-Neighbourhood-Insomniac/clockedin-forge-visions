
import React from 'react';
import { EditorState, RichUtils } from 'draft-js';
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

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'Quote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code', style: 'code-block' }
];

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD', icon: Bold },
  { label: 'Italic', style: 'ITALIC', icon: Italic },
  { label: 'Underline', style: 'UNDERLINE', icon: Underline }
];

const EditorToolbar: React.FC = () => {
  const { editorState, setEditorState, undo, redo } = useEditorStore();

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

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
            {INLINE_STYLES.map(({ label, style, icon: Icon }) => (
              <Button
                key={style}
                size="sm"
                variant="ghost"
                onClick={() => toggleInlineStyle(style)}
                className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                  currentStyle.has(style) ? 'bg-cyan-600/20 text-cyan-300' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* Block Types */}
          <div className="flex gap-1 mr-4">
            {BLOCK_TYPES.slice(0, 3).map(({ label, style }) => (
              <Button
                key={style}
                size="sm"
                variant="ghost"
                onClick={() => toggleBlockType(style)}
                className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                  blockType === style ? 'bg-cyan-600/20 text-cyan-300' : ''
                }`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Lists */}
          <div className="flex gap-1 mr-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleBlockType('unordered-list-item')}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                blockType === 'unordered-list-item' ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleBlockType('ordered-list-item')}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                blockType === 'ordered-list-item' ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>

          {/* Additional Tools */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Type className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-700"
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

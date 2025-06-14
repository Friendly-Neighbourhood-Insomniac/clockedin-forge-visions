
import React, { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Undo,
  Redo,
  Table,
  Code,
  Highlighter,
  Calculator,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  CheckSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MediaInsertion from './MediaInsertion';

const FONT_FAMILIES = [
  'Inter', 'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 'Verdana', 
  'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Courier New', 'Roboto', 'Open Sans'
];

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'
];

const EnhancedToolbar: React.FC = () => {
  const { editor } = useEditorStore();
  const [mathExpression, setMathExpression] = useState('');
  const [showMathDialog, setShowMathDialog] = useState(false);

  if (!editor) {
    return null;
  }

  const insertTable = () => {
    editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true });
  };

  const insertMathEquation = () => {
    if (mathExpression.trim()) {
      editor.commands.insertContent(`<div class="math-block" data-math="${mathExpression}">${mathExpression}</div>`);
      setMathExpression('');
      setShowMathDialog(false);
    }
  };

  const toggleTaskList = () => {
    editor.commands.toggleTaskList();
  };

  const insertCodeBlock = () => {
    editor.commands.toggleCodeBlock();
  };

  const setTextAlign = (alignment: 'left' | 'center' | 'right') => {
    editor.commands.setTextAlign(alignment);
  };

  const setFontFamily = (font: string) => {
    editor.commands.setFontFamily(font);
  };

  const setFontSize = (size: string) => {
    editor.commands.setFontSize(size);
  };

  const setTextColor = (color: string) => {
    editor.commands.setColor(color);
  };

  const toggleHighlight = (color?: string) => {
    if (color) {
      editor.commands.toggleHighlight({ color });
    } else {
      editor.commands.toggleHighlight();
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-400/30 mb-4">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.undo()}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.redo()}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Font Controls */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <Select onValueChange={setFontFamily}>
              <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600 text-slate-200 text-xs">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font} value={font} className="text-slate-200 hover:bg-slate-600">
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={setFontSize}>
              <SelectTrigger className="w-20 h-8 bg-slate-700 border-slate-600 text-slate-200 text-xs">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={size} className="text-slate-200 hover:bg-slate-600">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Formatting */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.toggleBold()}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('bold') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.toggleItalic()}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('italic') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.toggleUnderline()}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('underline') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Text Colors */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <div className="flex items-center gap-1">
              <Type className="w-4 h-4 text-slate-300" />
              {COLORS.slice(0, 5).map((color) => (
                <button
                  key={color}
                  onClick={() => setTextColor(color)}
                  className="w-4 h-4 rounded border border-slate-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Highlighter className="w-4 h-4 text-slate-300" />
              {['#FFFF00', '#00FF00', '#FF9900', '#FF00FF', '#00FFFF'].map((color) => (
                <button
                  key={color}
                  onClick={() => toggleHighlight(color)}
                  className="w-4 h-4 rounded border border-slate-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign('left')}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign('center')}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign('right')}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Lists and Structure */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.toggleBulletList()}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('bulletList') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.toggleOrderedList()}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('orderedList') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleTaskList}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('taskList') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <CheckSquare className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.commands.toggleBlockquote()}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('blockquote') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Quote className="w-4 h-4" />
            </Button>
          </div>

          {/* Advanced Tools */}
          <div className="flex gap-1 mr-2 border-r border-slate-600 pr-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={insertTable}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Table className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={insertCodeBlock}
              className={`text-slate-300 hover:text-white hover:bg-slate-700 ${
                editor.isActive('codeBlock') ? 'bg-cyan-600/20 text-cyan-300' : ''
              }`}
            >
              <Code className="w-4 h-4" />
            </Button>
            
            <Dialog open={showMathDialog} onOpenChange={setShowMathDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Calculator className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-cyan-400/30">
                <DialogHeader>
                  <DialogTitle className="text-cyan-100">Insert Math Equation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={mathExpression}
                    onChange={(e) => setMathExpression(e.target.value)}
                    placeholder="Enter LaTeX expression (e.g., x^2 + y^2 = z^2)"
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                  <div className="text-xs text-slate-400">
                    Examples: x^2, \frac{a}{b}, \sqrt{x}, \sum_{i=1}^{n} x_i
                  </div>
                  <Button onClick={insertMathEquation} className="bg-cyan-600 hover:bg-cyan-700">
                    Insert Equation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Media Tools */}
          <MediaInsertion />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedToolbar;

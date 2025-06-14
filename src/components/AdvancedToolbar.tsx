
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Type,
  Palette
} from 'lucide-react';
import EnhancedImageUpload from './EnhancedImageUpload';
import EmbedInsert from './EmbedInsert';

interface AdvancedToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onImageInsert: (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => void;
  onEmbedInsert: (embedData: { url: string; title: string; type: 'video' | 'website' }) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

const AdvancedToolbar: React.FC<AdvancedToolbarProps> = ({
  onFormat,
  onImageInsert,
  onEmbedInsert,
  onFontChange,
  onFontSizeChange,
  onColorChange,
}) => {
  const fonts = [
    'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 'Verdana', 
    'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Courier New'
  ];

  const fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'];

  return (
    <div className="border-b border-slate-700 p-3 bg-slate-800/30">
      <div className="flex flex-wrap items-center gap-2">
        {/* Font Controls */}
        <Select onValueChange={onFontChange}>
          <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-slate-200">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {fonts.map((font) => (
              <SelectItem key={font} value={font} className="text-slate-200 hover:bg-slate-600">
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={onFontSizeChange}>
          <SelectTrigger className="w-16 bg-slate-700 border-slate-600 text-slate-200">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size} className="text-slate-200 hover:bg-slate-600">
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 bg-slate-600" />

        {/* Text Formatting */}
        <Button
          onClick={() => onFormat('bold')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onFormat('italic')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onFormat('underline')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-slate-600" />

        {/* Alignment */}
        <Button
          onClick={() => onFormat('justifyLeft')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onFormat('justifyCenter')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onFormat('justifyRight')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-slate-600" />

        {/* Lists */}
        <Button
          onClick={() => onFormat('insertUnorderedList')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onFormat('insertOrderedList')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onFormat('formatBlock', 'blockquote')}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-slate-600" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          <Palette className="w-4 h-4 text-slate-300" />
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="w-4 h-4 rounded border border-slate-600 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 bg-slate-600" />

        {/* Media */}
        <EnhancedImageUpload onImageInsert={onImageInsert} />
        <EmbedInsert onEmbedInsert={onEmbedInsert} />

        <Button
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) {
              onFormat('createLink', url);
            }
          }}
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Link className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdvancedToolbar;

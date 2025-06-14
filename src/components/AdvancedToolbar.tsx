
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Type, Palette } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface AdvancedToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onImageInsert: (imageUrl: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

const AdvancedToolbar: React.FC<AdvancedToolbarProps> = ({
  onFormat,
  onImageInsert,
  onFontChange,
  onFontSizeChange,
  onColorChange
}) => {
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 border-t border-slate-700 bg-slate-800/30">
      {/* Font Family */}
      <Select onValueChange={onFontChange}>
        <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Garamond">Garamond</SelectItem>
          <SelectItem value="Palatino">Palatino</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select onValueChange={onFontSizeChange}>
        <SelectTrigger className="w-20 bg-slate-700/50 border-slate-600 text-white">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">8pt</SelectItem>
          <SelectItem value="2">10pt</SelectItem>
          <SelectItem value="3">12pt</SelectItem>
          <SelectItem value="4">14pt</SelectItem>
          <SelectItem value="5">18pt</SelectItem>
          <SelectItem value="6">24pt</SelectItem>
          <SelectItem value="7">36pt</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-px h-6 bg-slate-600 mx-2" />

      {/* Basic Formatting */}
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

      <div className="w-px h-6 bg-slate-600 mx-2" />

      {/* Text Color */}
      <Select onValueChange={onColorChange}>
        <SelectTrigger className="w-20 bg-slate-700/50 border-slate-600 text-white">
          <SelectValue placeholder={<Palette className="w-4 h-4" />} />
        </SelectTrigger>
        <SelectContent>
          {colors.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="w-px h-6 bg-slate-600 mx-2" />

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

      <div className="w-px h-6 bg-slate-600 mx-2" />

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

      <div className="w-px h-6 bg-slate-600 mx-2" />

      {/* Image Upload */}
      <ImageUpload onImageInsert={onImageInsert} />
    </div>
  );
};

export default AdvancedToolbar;

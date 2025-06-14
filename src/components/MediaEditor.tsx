
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Move, RotateCcw } from 'lucide-react';

interface MediaEditorProps {
  element: HTMLElement;
  onClose: () => void;
  onUpdate: (element: HTMLElement) => void;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ element, onClose, onUpdate }) => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [alignment, setAlignment] = useState('left');
  const [margin, setMargin] = useState('10');

  useEffect(() => {
    // Initialize values from element
    const computedStyle = window.getComputedStyle(element);
    setWidth(element.style.width || '100%');
    setHeight(element.style.height || 'auto');
    setAlignment(element.style.float || computedStyle.textAlign || 'left');
    setMargin(element.style.margin?.replace(/px/g, '') || '10');
  }, [element]);

  const handleUpdate = () => {
    // Apply styles to element
    element.style.width = width;
    element.style.height = height;
    element.style.margin = `${margin}px`;
    
    // Handle alignment
    element.style.float = alignment === 'left' || alignment === 'right' ? alignment : 'none';
    if (alignment === 'center') {
      element.style.display = 'block';
      element.style.marginLeft = 'auto';
      element.style.marginRight = 'auto';
    }

    onUpdate(element);
  };

  const handleReset = () => {
    element.style.width = '';
    element.style.height = '';
    element.style.margin = '';
    element.style.float = '';
    element.style.display = '';
    element.style.marginLeft = '';
    element.style.marginRight = '';
    onUpdate(element);
    onClose();
  };

  return (
    <Card className="absolute z-50 bg-slate-800 border-cyan-400/30 shadow-xl" style={{ minWidth: '300px' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-cyan-100 flex items-center justify-between text-sm">
          Edit Media
          <Button onClick={onClose} size="sm" variant="ghost" className="text-slate-400">
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-300 text-xs">Width</Label>
            <Input
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="100% or 300px"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
          <div>
            <Label className="text-slate-300 text-xs">Height</Label>
            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="auto or 200px"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-slate-300 text-xs">Alignment</Label>
          <Select value={alignment} onValueChange={setAlignment}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="left" className="text-slate-200">Left</SelectItem>
              <SelectItem value="center" className="text-slate-200">Center</SelectItem>
              <SelectItem value="right" className="text-slate-200">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-300 text-xs">Margin (px)</Label>
          <Input
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            placeholder="10"
            className="bg-slate-700 border-slate-600 text-slate-100 h-8"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleUpdate} size="sm" className="bg-cyan-600 hover:bg-cyan-700 flex-1">
            Apply Changes
          </Button>
          <Button onClick={handleReset} size="sm" variant="ghost" className="text-slate-300">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaEditor;

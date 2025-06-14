
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Move, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [position, setPosition] = useState('static');

  useEffect(() => {
    // Initialize values from element's current styles
    const computedStyle = window.getComputedStyle(element);
    
    // Get actual dimensions
    const currentWidth = element.style.width || computedStyle.width;
    const currentHeight = element.style.height || computedStyle.height;
    
    setWidth(currentWidth === 'auto' ? '' : currentWidth);
    setHeight(currentHeight === 'auto' ? '' : currentHeight);
    
    // Determine alignment from current styles
    const float = element.style.float || computedStyle.float;
    const textAlign = element.style.textAlign || computedStyle.textAlign;
    const marginLeft = element.style.marginLeft;
    const marginRight = element.style.marginRight;
    
    if (float === 'left') setAlignment('left');
    else if (float === 'right') setAlignment('right');
    else if (marginLeft === 'auto' && marginRight === 'auto') setAlignment('center');
    else setAlignment('left');
    
    // Get margin value
    const currentMargin = element.style.margin?.replace(/px/g, '') || '10';
    setMargin(currentMargin);
    
    // Get position
    setPosition(element.style.position || 'static');
  }, [element]);

  const handleUpdate = () => {
    try {
      // Clear previous alignment styles
      element.style.float = '';
      element.style.marginLeft = '';
      element.style.marginRight = '';
      element.style.display = '';
      
      // Apply dimensions
      if (width) {
        element.style.width = width.includes('px') || width.includes('%') ? width : `${width}px`;
      }
      if (height) {
        element.style.height = height.includes('px') || height.includes('%') ? height : `${height}px`;
      }
      
      // Apply margin
      const marginValue = margin && !isNaN(Number(margin)) ? `${margin}px` : '10px';
      element.style.margin = marginValue;
      
      // Apply position
      element.style.position = position;
      
      // Apply alignment
      switch (alignment) {
        case 'left':
          element.style.float = 'left';
          break;
        case 'right':
          element.style.float = 'right';
          break;
        case 'center':
          element.style.display = 'block';
          element.style.marginLeft = 'auto';
          element.style.marginRight = 'auto';
          element.style.float = 'none';
          break;
      }
      
      // Ensure element remains editable
      element.classList.add('editable-media');
      
      onUpdate(element);
    } catch (error) {
      console.error('Error updating media element:', error);
    }
  };

  const handleReset = () => {
    // Reset all styles to defaults
    element.style.width = '';
    element.style.height = '';
    element.style.margin = '';
    element.style.float = '';
    element.style.display = '';
    element.style.marginLeft = '';
    element.style.marginRight = '';
    element.style.position = '';
    element.style.top = '';
    element.style.left = '';
    element.style.right = '';
    element.style.bottom = '';
    
    onUpdate(element);
    onClose();
  };

  const moveElement = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 10;
    const currentMarginTop = parseInt(element.style.marginTop) || 0;
    const currentMarginLeft = parseInt(element.style.marginLeft) || 0;
    
    switch (direction) {
      case 'up':
        element.style.marginTop = `${Math.max(0, currentMarginTop - step)}px`;
        break;
      case 'down':
        element.style.marginTop = `${currentMarginTop + step}px`;
        break;
      case 'left':
        element.style.marginLeft = `${Math.max(0, currentMarginLeft - step)}px`;
        break;
      case 'right':
        element.style.marginLeft = `${currentMarginLeft + step}px`;
        break;
    }
    onUpdate(element);
  };

  return (
    <Card className="absolute z-50 bg-slate-800 border-cyan-400/30 shadow-xl" style={{ minWidth: '320px' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-cyan-100 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Move className="w-4 h-4" />
            Edit Media
          </span>
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
              placeholder="300px or 50%"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
          <div>
            <Label className="text-slate-300 text-xs">Height</Label>
            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="200px or auto"
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
          <Label className="text-slate-300 text-xs">Position</Label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="static" className="text-slate-200">Static</SelectItem>
              <SelectItem value="relative" className="text-slate-200">Relative</SelectItem>
              <SelectItem value="absolute" className="text-slate-200">Absolute</SelectItem>
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

        <div>
          <Label className="text-slate-300 text-xs mb-2 block">Move Element</Label>
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <Button
              onClick={() => moveElement('up')}
              size="sm"
              variant="ghost"
              className="text-slate-300 h-8 p-1"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div></div>
            <Button
              onClick={() => moveElement('left')}
              size="sm"
              variant="ghost"
              className="text-slate-300 h-8 p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div></div>
            <Button
              onClick={() => moveElement('right')}
              size="sm"
              variant="ghost"
              className="text-slate-300 h-8 p-1"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div></div>
            <Button
              onClick={() => moveElement('down')}
              size="sm"
              variant="ghost"
              className="text-slate-300 h-8 p-1"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <div></div>
          </div>
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

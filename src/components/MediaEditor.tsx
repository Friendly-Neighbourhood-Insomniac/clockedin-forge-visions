
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Move, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';

interface MediaEditorProps {
  element: HTMLElement;
  onClose: () => void;
  onUpdate: (element: HTMLElement) => void;
  position: { x: number; y: number };
}

const MediaEditor: React.FC<MediaEditorProps> = ({ element, onClose, onUpdate, position }) => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [alignment, setAlignment] = useState('left');
  const [margin, setMargin] = useState('10');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize values from element's current styles
    const computedStyle = window.getComputedStyle(element);
    
    setWidth(element.style.width || '300px');
    setHeight(element.style.height || 'auto');
    
    // Determine alignment
    const float = element.style.float || computedStyle.float;
    if (float === 'left') setAlignment('left');
    else if (float === 'right') setAlignment('right');
    else if (element.style.marginLeft === 'auto' && element.style.marginRight === 'auto') setAlignment('center');
    else setAlignment('left');
    
    const currentMargin = element.style.margin?.replace(/px/g, '') || '10';
    setMargin(currentMargin);
  }, [element]);

  const handleUpdate = () => {
    // Clear previous styles
    element.style.float = '';
    element.style.marginLeft = '';
    element.style.marginRight = '';
    element.style.display = '';
    
    // Apply dimensions
    if (width) {
      element.style.width = width.includes('px') || width.includes('%') ? width : `${width}px`;
    }
    if (height && height !== 'auto') {
      element.style.height = height.includes('px') || height.includes('%') ? height : `${height}px`;
    }
    
    // Apply margin
    const marginValue = margin && !isNaN(Number(margin)) ? `${margin}px` : '10px';
    element.style.margin = marginValue;
    
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
        break;
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

  const quickResize = (size: 'small' | 'medium' | 'large') => {
    const sizes = {
      small: { width: '200px', height: 'auto' },
      medium: { width: '400px', height: 'auto' },
      large: { width: '600px', height: 'auto' }
    };
    
    const { width: newWidth, height: newHeight } = sizes[size];
    setWidth(newWidth);
    setHeight(newHeight);
    
    element.style.width = newWidth;
    element.style.height = newHeight;
    onUpdate(element);
  };

  return (
    <div
      ref={cardRef}
      className="fixed z-[9999] bg-slate-800 border border-cyan-400/30 shadow-2xl rounded-lg"
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '320px',
        maxWidth: '400px'
      }}
    >
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-cyan-100 font-medium text-sm flex items-center gap-2">
            <Move className="w-4 h-4" />
            Edit Media
          </span>
          <Button onClick={onClose} size="sm" variant="ghost" className="text-slate-400 h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Quick Resize */}
        <div>
          <Label className="text-slate-300 text-xs mb-2 block">Quick Resize</Label>
          <div className="flex gap-2">
            <Button onClick={() => quickResize('small')} size="sm" variant="outline" className="text-xs">
              <Minimize2 className="w-3 h-3 mr-1" />
              Small
            </Button>
            <Button onClick={() => quickResize('medium')} size="sm" variant="outline" className="text-xs">
              Medium
            </Button>
            <Button onClick={() => quickResize('large')} size="sm" variant="outline" className="text-xs">
              <Maximize2 className="w-3 h-3 mr-1" />
              Large
            </Button>
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-300 text-xs">Width</Label>
            <Input
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="300px"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
          <div>
            <Label className="text-slate-300 text-xs">Height</Label>
            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="auto"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
        </div>
        
        {/* Alignment */}
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

        {/* Margin */}
        <div>
          <Label className="text-slate-300 text-xs">Margin (px)</Label>
          <Input
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            placeholder="10"
            className="bg-slate-700 border-slate-600 text-slate-100 h-8"
          />
        </div>

        {/* Movement Controls */}
        <div>
          <Label className="text-slate-300 text-xs mb-2 block">Fine Positioning</Label>
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <Button onClick={() => moveElement('up')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div></div>
            <Button onClick={() => moveElement('left')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div></div>
            <Button onClick={() => moveElement('right')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div></div>
            <Button onClick={() => moveElement('down')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
              <ArrowDown className="w-4 h-4" />
            </Button>
            <div></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleUpdate} size="sm" className="bg-cyan-600 hover:bg-cyan-700 flex-1">
            Apply
          </Button>
          <Button onClick={handleReset} size="sm" variant="ghost" className="text-slate-300">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaEditor;

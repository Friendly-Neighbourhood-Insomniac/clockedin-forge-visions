import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { X, Move, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2, Minimize2, Grid3X3, Layers, ZoomIn, ZoomOut, Trash2, Copy, MousePointer } from 'lucide-react';

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
  const [padding, setPadding] = useState('0');
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [zIndex, setZIndex] = useState(1);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('free');
  const [borderRadius, setBorderRadius] = useState(0);
  const [shadow, setShadow] = useState('none');
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
    
    const currentPadding = element.style.padding?.replace(/px/g, '') || '0';
    setPadding(currentPadding);
    
    const currentOpacity = parseFloat(element.style.opacity || '1') * 100;
    setOpacity(currentOpacity);
    
    const currentZIndex = parseInt(element.style.zIndex || '1');
    setZIndex(currentZIndex);
    
    const transform = element.style.transform || '';
    const rotateMatch = transform.match(/rotate\((-?\d+)deg\)/);
    if (rotateMatch) {
      setRotation(parseInt(rotateMatch[1]));
    }
    
    const currentBorderRadius = parseInt(element.style.borderRadius?.replace(/px/g, '') || '0');
    setBorderRadius(currentBorderRadius);
  }, [element]);

  const handleUpdate = () => {
    // Clear previous styles
    element.style.float = '';
    element.style.marginLeft = '';
    element.style.marginRight = '';
    element.style.display = '';
    
    // Apply dimensions with aspect ratio constraint
    let finalWidth = width;
    let finalHeight = height;
    
    if (aspectRatio !== 'free' && width && height !== 'auto') {
      const ratio = aspectRatio === '16:9' ? 16/9 : aspectRatio === '4:3' ? 4/3 : aspectRatio === '1:1' ? 1 : 16/9;
      const widthNum = parseInt(width.replace(/px|%/g, ''));
      finalHeight = `${Math.round(widthNum / ratio)}px`;
      setHeight(finalHeight);
    }
    
    if (finalWidth) {
      element.style.width = finalWidth.includes('px') || finalWidth.includes('%') ? finalWidth : `${finalWidth}px`;
    }
    if (finalHeight && finalHeight !== 'auto') {
      element.style.height = finalHeight.includes('px') || finalHeight.includes('%') ? finalHeight : `${finalHeight}px`;
    }
    
    // Apply spacing
    const marginValue = margin && !isNaN(Number(margin)) ? `${margin}px` : '10px';
    const paddingValue = padding && !isNaN(Number(padding)) ? `${padding}px` : '0px';
    element.style.margin = marginValue;
    element.style.padding = paddingValue;
    
    // Apply transform effects
    const transforms = [];
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    element.style.transform = transforms.join(' ');
    
    // Apply visual effects
    element.style.opacity = (opacity / 100).toString();
    element.style.zIndex = zIndex.toString();
    element.style.borderRadius = `${borderRadius}px`;
    
    // Apply shadow
    if (shadow === 'small') element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    else if (shadow === 'medium') element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    else if (shadow === 'large') element.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    else element.style.boxShadow = 'none';
    
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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      element.remove();
      onUpdate(element);
      onClose();
    }
  };

  const handleReset = () => {
    element.style.width = '';
    element.style.height = '';
    element.style.margin = '';
    element.style.padding = '';
    element.style.float = '';
    element.style.display = '';
    element.style.marginLeft = '';
    element.style.marginRight = '';
    element.style.transform = '';
    element.style.opacity = '';
    element.style.zIndex = '';
    element.style.borderRadius = '';
    element.style.boxShadow = '';
    
    onUpdate(element);
    onClose();
  };

  const moveElement = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = snapToGrid ? 20 : 5;
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

  const quickScale = (scale: number) => {
    const currentWidth = parseInt(width.replace(/px|%/g, '')) || 300;
    const newWidth = Math.round(currentWidth * scale);
    const newWidthStr = `${newWidth}px`;
    
    setWidth(newWidthStr);
    element.style.width = newWidthStr;
    
    if (aspectRatio !== 'free') {
      const ratio = aspectRatio === '16:9' ? 16/9 : aspectRatio === '4:3' ? 4/3 : aspectRatio === '1:1' ? 1 : 16/9;
      const newHeight = `${Math.round(newWidth / ratio)}px`;
      setHeight(newHeight);
      element.style.height = newHeight;
    }
    
    onUpdate(element);
  };

  const quickResize = (size: 'small' | 'medium' | 'large' | 'full') => {
    const sizes = {
      small: { width: '200px', height: 'auto' },
      medium: { width: '400px', height: 'auto' },
      large: { width: '600px', height: 'auto' },
      full: { width: '100%', height: 'auto' }
    };
    
    const { width: newWidth, height: newHeight } = sizes[size];
    setWidth(newWidth);
    setHeight(newHeight);
    
    element.style.width = newWidth;
    element.style.height = newHeight;
    onUpdate(element);
  };

  const duplicateElement = () => {
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.marginLeft = `${(parseInt(element.style.marginLeft) || 0) + 20}px`;
    clonedElement.style.marginTop = `${(parseInt(element.style.marginTop) || 0) + 20}px`;
    element.parentNode?.insertBefore(clonedElement, element.nextSibling);
    onUpdate(element);
    onClose();
  };

  return (
    <div
      ref={cardRef}
      className="fixed z-[9999] bg-slate-800 border border-cyan-400/30 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto"
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '380px',
        maxWidth: '420px'
      }}
    >
      <div className="p-3 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
        <div className="flex items-center justify-between">
          <span className="text-cyan-100 font-medium text-sm flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Element Editor
          </span>
          <div className="flex gap-1">
            <Button onClick={handleDelete} size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-6 w-6 p-0">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost" className="text-slate-400 h-6 w-6 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-medium">Quick Actions</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => quickScale(0.5)} size="sm" variant="outline" className="text-xs">
              <ZoomOut className="w-3 h-3 mr-1" />
              50%
            </Button>
            <Button onClick={() => quickScale(2)} size="sm" variant="outline" className="text-xs">
              <ZoomIn className="w-3 h-3 mr-1" />
              200%
            </Button>
            <Button onClick={duplicateElement} size="sm" variant="outline" className="text-xs">
              <Copy className="w-3 h-3 mr-1" />
              Duplicate
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive" className="text-xs">
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Quick Resize */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-medium">Quick Resize</Label>
          <div className="grid grid-cols-4 gap-1">
            <Button onClick={() => quickResize('small')} size="sm" variant="outline" className="text-xs">
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button onClick={() => quickResize('medium')} size="sm" variant="outline" className="text-xs">
              S
            </Button>
            <Button onClick={() => quickResize('large')} size="sm" variant="outline" className="text-xs">
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button onClick={() => quickResize('full')} size="sm" variant="outline" className="text-xs">
              Full
            </Button>
          </div>
        </div>

        {/* Precise Scaling */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-medium">Precise Scaling</Label>
          <div className="grid grid-cols-5 gap-1">
            <Button onClick={() => quickScale(0.75)} size="sm" variant="ghost" className="text-xs">75%</Button>
            <Button onClick={() => quickScale(0.9)} size="sm" variant="ghost" className="text-xs">90%</Button>
            <Button onClick={() => quickScale(1)} size="sm" variant="ghost" className="text-xs">100%</Button>
            <Button onClick={() => quickScale(1.25)} size="sm" variant="ghost" className="text-xs">125%</Button>
            <Button onClick={() => quickScale(1.5)} size="sm" variant="ghost" className="text-xs">150%</Button>
          </div>
        </div>

        {/* Movement Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-xs font-medium">Movement</Label>
            <div className="flex items-center gap-2">
              <Label className="text-slate-300 text-xs">Grid Snap</Label>
              <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <Button onClick={() => moveElement('up')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div></div>
            <Button onClick={() => moveElement('left')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-center text-xs text-slate-400 flex items-center justify-center">
              {snapToGrid ? '20px' : '5px'}
            </div>
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

        {/* Dimensions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-slate-300 text-xs">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="free" className="text-slate-200">Free</SelectItem>
                <SelectItem value="16:9" className="text-slate-200">16:9</SelectItem>
                <SelectItem value="4:3" className="text-slate-200">4:3</SelectItem>
                <SelectItem value="1:1" className="text-slate-200">1:1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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

        {/* Spacing */}
        <div className="grid grid-cols-2 gap-3">
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
            <Label className="text-slate-300 text-xs">Padding (px)</Label>
            <Input
              value={padding}
              onChange={(e) => setPadding(e.target.value)}
              placeholder="0"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="space-y-3">
          <div>
            <Label className="text-slate-300 text-xs mb-2 block">Rotation: {rotation}°</Label>
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              min={-180}
              max={180}
              step={5}
              className="w-full"
            />
          </div>
          
          <div>
            <Label className="text-slate-300 text-xs mb-2 block">Opacity: {opacity}%</Label>
            <Slider
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Layer Management */}
        <div className="space-y-3">
          <div>
            <Label className="text-slate-300 text-xs flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Layer Order
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Button 
                onClick={() => setZIndex(Math.max(1, zIndex - 1))} 
                size="sm" 
                variant="outline" 
                className="text-xs"
              >
                Back
              </Button>
              <span className="text-slate-300 text-xs flex-1 text-center">{zIndex}</span>
              <Button 
                onClick={() => setZIndex(zIndex + 1)} 
                size="sm" 
                variant="outline" 
                className="text-xs"
              >
                Forward
              </Button>
            </div>
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

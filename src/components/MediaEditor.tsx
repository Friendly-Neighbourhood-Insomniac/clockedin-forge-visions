
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import MediaEditorHeader from './media-editor/MediaEditorHeader';
import QuickActionsPanel from './media-editor/QuickActionsPanel';
import MovementControls from './media-editor/MovementControls';
import DimensionsPanel from './media-editor/DimensionsPanel';
import StylePanel from './media-editor/StylePanel';
import LayerPanel from './media-editor/LayerPanel';

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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowUp' && !e.shiftKey) {
        e.preventDefault();
        moveElement('up');
      } else if (e.key === 'ArrowDown' && !e.shiftKey) {
        e.preventDefault();
        moveElement('down');
      } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
        e.preventDefault();
        moveElement('left');
      } else if (e.key === 'ArrowRight' && !e.shiftKey) {
        e.preventDefault();
        moveElement('right');
      } else if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        quickScale(1.1);
      } else if (e.key === '-') {
        e.preventDefault();
        quickScale(0.9);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [snapToGrid, width, aspectRatio]);

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
      <MediaEditorHeader onClose={onClose} onDelete={handleDelete} />
      
      <div className="p-4 space-y-4">
        <QuickActionsPanel
          onScale={quickScale}
          onDuplicate={duplicateElement}
          onDelete={handleDelete}
          onQuickResize={quickResize}
        />

        <MovementControls
          snapToGrid={snapToGrid}
          onSnapToGridChange={setSnapToGrid}
          onMove={moveElement}
        />

        <DimensionsPanel
          width={width}
          height={height}
          aspectRatio={aspectRatio}
          alignment={alignment}
          margin={margin}
          padding={padding}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onAspectRatioChange={setAspectRatio}
          onAlignmentChange={setAlignment}
          onMarginChange={setMargin}
          onPaddingChange={setPadding}
        />

        <StylePanel
          rotation={rotation}
          opacity={opacity}
          borderRadius={borderRadius}
          onRotationChange={setRotation}
          onOpacityChange={setOpacity}
          onBorderRadiusChange={setBorderRadius}
        />

        <LayerPanel
          zIndex={zIndex}
          onZIndexChange={setZIndex}
        />

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

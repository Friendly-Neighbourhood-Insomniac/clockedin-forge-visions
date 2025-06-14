
import React, { useState, useRef, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface ResizableMediaProps {
  children: React.ReactNode;
  onResize?: (width: number, height: number) => void;
  initialWidth?: number;
  initialHeight?: number;
}

const ResizableMedia: React.FC<ResizableMediaProps> = ({ 
  children, 
  onResize, 
  initialWidth = 300, 
  initialHeight = 200 
}) => {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = (newWidth: number, newHeight: number) => {
    setDimensions({ width: newWidth, height: newHeight });
    onResize?.(newWidth, newHeight);
  };

  return (
    <div 
      ref={containerRef}
      className="inline-block border-2 border-dashed border-transparent hover:border-cyan-400/50 transition-all duration-200 group relative"
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full cursor-nw-resize"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full cursor-ne-resize"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full cursor-sw-resize"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full cursor-se-resize"></div>
      </div>
      {children}
    </div>
  );
};

export default ResizableMedia;

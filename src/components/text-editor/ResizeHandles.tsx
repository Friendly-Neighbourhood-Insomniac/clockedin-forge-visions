
import React from 'react';

interface ResizeHandlesProps {
  element: HTMLElement;
  onResize: () => void;
  setIsResizing: (resizing: boolean) => void;
}

export const createResizeHandles = (
  element: HTMLElement, 
  onResize: () => void, 
  setIsResizing: (resizing: boolean) => void
) => {
  // Remove existing handles
  const existingHandles = element.parentNode?.querySelectorAll('.resize-handle');
  existingHandles?.forEach(handle => handle.remove());

  const handles = ['nw', 'ne', 'sw', 'se', 'n', 'e', 's', 'w'];
  handles.forEach(direction => {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-${direction}`;
    handle.style.cssText = `
      position: absolute;
      background: #06b6d4;
      border: 1px solid white;
      width: 8px;
      height: 8px;
      cursor: ${direction.includes('n') || direction.includes('s') ? 
        (direction.includes('w') || direction.includes('e') ? 
          (direction === 'nw' || direction === 'se' ? 'nw-resize' : 'ne-resize') 
          : 'ns-resize') 
        : (direction.includes('w') || direction.includes('e') ? 'ew-resize' : 'move')};
      z-index: 1000;
    `;

    // Position handles
    switch (direction) {
      case 'nw': handle.style.top = '-4px'; handle.style.left = '-4px'; break;
      case 'ne': handle.style.top = '-4px'; handle.style.right = '-4px'; break;
      case 'sw': handle.style.bottom = '-4px'; handle.style.left = '-4px'; break;
      case 'se': handle.style.bottom = '-4px'; handle.style.right = '-4px'; break;
      case 'n': handle.style.top = '-4px'; handle.style.left = '50%'; handle.style.transform = 'translateX(-50%)'; break;
      case 's': handle.style.bottom = '-4px'; handle.style.left = '50%'; handle.style.transform = 'translateX(-50%)'; break;
      case 'w': handle.style.left = '-4px'; handle.style.top = '50%'; handle.style.transform = 'translateY(-50%)'; break;
      case 'e': handle.style.right = '-4px'; handle.style.top = '50%'; handle.style.transform = 'translateY(-50%)'; break;
    }

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.offsetWidth;
      const startHeight = element.offsetHeight;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        if (direction.includes('e')) {
          element.style.width = Math.max(50, startWidth + deltaX) + 'px';
        }
        if (direction.includes('w')) {
          const newWidth = Math.max(50, startWidth - deltaX);
          element.style.width = newWidth + 'px';
        }
        if (direction.includes('s')) {
          element.style.height = Math.max(50, startHeight + deltaY) + 'px';
        }
        if (direction.includes('n')) {
          const newHeight = Math.max(50, startHeight - deltaY);
          element.style.height = newHeight + 'px';
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        onResize();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    element.parentNode?.insertBefore(handle, element.nextSibling);
  });
};

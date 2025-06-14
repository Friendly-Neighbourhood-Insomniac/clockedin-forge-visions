
import { useEffect, useCallback } from 'react';

interface UseMediaEventHandlersProps {
  editorRef: React.RefObject<HTMLDivElement>;
  selectedElement: HTMLElement | null;
  isResizing: boolean;
  isDragging: boolean;
  selectElement: (element: HTMLElement) => void;
  moveElement: (element: HTMLElement, deltaX: number, deltaY: number) => void;
  resizeElement: (element: HTMLElement, factor: number) => void;
  syncEditorContent: () => void;
  setSelectedElement: (element: HTMLElement | null) => void;
  setIsDragging: (dragging: boolean) => void;
}

export const useMediaEventHandlers = ({
  editorRef,
  selectedElement,
  isResizing,
  isDragging,
  selectElement,
  moveElement,
  resizeElement,
  syncEditorContent,
  setSelectedElement,
  setIsDragging
}: UseMediaEventHandlersProps) => {
  const setupMediaHandlers = useCallback(() => {
    if (!editorRef.current) return;

    console.log('Setting up media handlers');

    // Handle all media elements
    const mediaElements = editorRef.current.querySelectorAll('img, iframe, .embed-container');
    
    mediaElements.forEach((element) => {
      const el = element as HTMLElement;
      
      // Make elements selectable and position relative for handles
      el.style.position = 'relative';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid transparent';
      el.style.transition = 'border-color 0.2s ease';
      el.style.display = 'inline-block';
      el.style.maxWidth = '100%';
      
      // Click to select
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectElement(el);
      });

      // Double click for advanced editing
      el.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Double clicked for advanced editing');
        // This will trigger the media editor
        el.dispatchEvent(new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: e.clientX,
          clientY: e.clientY
        }));
      });

      // Make draggable
      el.draggable = true;
      
      el.addEventListener('dragstart', (e) => {
        setIsDragging(true);
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
        }
        el.style.opacity = '0.5';
      });

      el.addEventListener('dragend', (e) => {
        setIsDragging(false);
        el.style.opacity = '1';
        syncEditorContent();
      });
    });
  }, [editorRef, selectElement, setIsDragging, syncEditorContent]);

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElement || isResizing || isDragging) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          if (confirm('Delete this media element?')) {
            // Remove resize handles
            const handles = selectedElement.parentNode?.querySelectorAll('.resize-handle');
            handles?.forEach(handle => handle.remove());
            
            selectedElement.remove();
            setSelectedElement(null);
            syncEditorContent();
          }
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          moveElement(selectedElement, 0, -10);
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          moveElement(selectedElement, 0, 10);
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          moveElement(selectedElement, -10, 0);
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          moveElement(selectedElement, 10, 0);
          break;
          
        case '=':
        case '+':
          e.preventDefault();
          resizeElement(selectedElement, 1.1);
          break;
          
        case '-':
          e.preventDefault();
          resizeElement(selectedElement, 0.9);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, isResizing, isDragging, moveElement, resizeElement, syncEditorContent, setSelectedElement]);

  return { setupMediaHandlers };
};

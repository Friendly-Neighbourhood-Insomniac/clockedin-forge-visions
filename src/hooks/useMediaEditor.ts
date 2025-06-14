
import { useCallback } from 'react';

interface MediaEditorState {
  element: HTMLElement;
  position: { x: number; y: number };
}

interface UseMediaEditorProps {
  editorRef: React.RefObject<HTMLDivElement>;
  onMediaEditorOpen: (state: MediaEditorState) => void;
  onContentSync: () => void;
}

export const useMediaEditor = ({ editorRef, onMediaEditorOpen, onContentSync }: UseMediaEditorProps) => {
  const setupMediaEventListeners = useCallback(() => {
    if (!editorRef.current) return;
    
    const mediaElements = editorRef.current.querySelectorAll('.editable-media');
    
    mediaElements.forEach((element) => {
      const mediaElement = element as HTMLElement;
      
      // Remove existing listeners by cloning
      const newElement = mediaElement.cloneNode(true) as HTMLElement;
      mediaElement.parentNode?.replaceChild(newElement, mediaElement);
      
      // Double-click to edit
      newElement.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = newElement.getBoundingClientRect();
        const x = Math.min(rect.right + 10, window.innerWidth - 350);
        const y = Math.max(10, rect.top);
        
        onMediaEditorOpen({
          element: newElement,
          position: { x, y }
        });
      });

      // Hover effects
      newElement.addEventListener('mouseenter', () => {
        newElement.style.border = '2px dashed rgb(6, 182, 212)';
        newElement.style.transform = 'scale(1.01)';
        newElement.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.2)';
        
        // Show drag indicator
        if (!newElement.querySelector('.drag-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'drag-indicator';
          indicator.style.cssText = `
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgb(6, 182, 212);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            z-index: 10;
            pointer-events: none;
          `;
          indicator.textContent = 'DRAG TO MOVE • DOUBLE-CLICK TO EDIT';
          newElement.style.position = 'relative';
          newElement.appendChild(indicator);
        }
      });

      newElement.addEventListener('mouseleave', () => {
        newElement.style.border = '2px solid transparent';
        newElement.style.transform = 'scale(1)';
        newElement.style.boxShadow = 'none';
        
        // Remove drag indicator
        const indicator = newElement.querySelector('.drag-indicator');
        if (indicator) {
          indicator.remove();
        }
      });

      // Drag and drop
      newElement.addEventListener('dragstart', (e) => {
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', newElement.outerHTML);
        newElement.style.opacity = '0.5';
        
        // Add visual feedback to editor
        if (editorRef.current) {
          editorRef.current.style.background = 'rgba(6, 182, 212, 0.05)';
          editorRef.current.style.border = '2px dashed rgb(6, 182, 212)';
        }
      });

      newElement.addEventListener('dragend', () => {
        newElement.style.opacity = '1';
        
        // Remove visual feedback
        if (editorRef.current) {
          editorRef.current.style.background = '';
          editorRef.current.style.border = '';
        }
      });
    });

    // Setup drop zone
    if (editorRef.current) {
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const htmlData = e.dataTransfer!.getData('text/html');
        
        if (htmlData) {
          // Remove the original element to prevent duplication
          const draggedElement = editorRef.current!.querySelector('.editable-media[style*="opacity: 0.5"]');
          if (draggedElement) {
            draggedElement.remove();
          }
          
          // Insert at drop position
          const range = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (range) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            const element = tempDiv.firstChild as HTMLElement;
            
            if (element) {
              element.style.opacity = '1';
              range.insertNode(element);
              onContentSync();
              
              // Re-setup listeners
              setTimeout(() => {
                setupMediaEventListeners();
              }, 100);
            }
          }
        }
        
        // Remove visual feedback
        if (editorRef.current) {
          editorRef.current.style.background = '';
          editorRef.current.style.border = '';
        }
      };

      editorRef.current.addEventListener('dragover', handleDragOver);
      editorRef.current.addEventListener('drop', handleDrop);
    }
  }, [editorRef, onMediaEditorOpen, onContentSync]);

  return { setupMediaEventListeners };
};

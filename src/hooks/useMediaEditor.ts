
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
        const x = Math.min(rect.right + 10, window.innerWidth - 450);
        const y = Math.max(10, rect.top);
        
        onMediaEditorOpen({
          element: newElement,
          position: { x, y }
        });
      });

      // Enhanced hover effects
      newElement.addEventListener('mouseenter', () => {
        newElement.style.border = '2px dashed rgb(6, 182, 212)';
        newElement.style.transform = 'scale(1.02)';
        newElement.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.25)';
        newElement.style.zIndex = '100';
        
        // Show enhanced drag indicator
        if (!newElement.querySelector('.drag-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'drag-indicator';
          indicator.style.cssText = `
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgb(6, 182, 212), rgb(8, 145, 178));
            color: white;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
            white-space: nowrap;
          `;
          indicator.innerHTML = '✋ DRAG TO MOVE • 🎯 DOUBLE-CLICK FOR ADVANCED EDITING';
          newElement.style.position = 'relative';
          newElement.appendChild(indicator);
        }
      });

      newElement.addEventListener('mouseleave', () => {
        newElement.style.border = '2px solid transparent';
        newElement.style.transform = 'scale(1)';
        newElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        newElement.style.zIndex = '';
        
        // Remove drag indicator
        const indicator = newElement.querySelector('.drag-indicator');
        if (indicator) {
          indicator.remove();
        }
      });

      // Enhanced drag and drop with grid snapping
      newElement.addEventListener('dragstart', (e) => {
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', newElement.outerHTML);
        e.dataTransfer!.setData('text/media-id', newElement.getAttribute('data-media-id') || '');
        newElement.style.opacity = '0.3';
        newElement.style.transform = 'rotate(5deg)';
        
        // Add visual feedback to editor
        if (editorRef.current) {
          editorRef.current.style.background = 'linear-gradient(45deg, rgba(6, 182, 212, 0.05) 25%, transparent 25%, transparent 75%, rgba(6, 182, 212, 0.05) 75%), linear-gradient(45deg, rgba(6, 182, 212, 0.05) 25%, transparent 25%, transparent 75%, rgba(6, 182, 212, 0.05) 75%)';
          editorRef.current.style.backgroundSize = '20px 20px';
          editorRef.current.style.backgroundPosition = '0 0, 10px 10px';
          editorRef.current.style.border = '3px dashed rgb(6, 182, 212)';
          editorRef.current.style.borderRadius = '8px';
        }
      });

      newElement.addEventListener('dragend', () => {
        newElement.style.opacity = '1';
        newElement.style.transform = '';
        
        // Remove visual feedback
        if (editorRef.current) {
          editorRef.current.style.background = '';
          editorRef.current.style.backgroundSize = '';
          editorRef.current.style.backgroundPosition = '';
          editorRef.current.style.border = '';
          editorRef.current.style.borderRadius = '';
        }
      });
    });

    // Enhanced drop zone with grid snapping
    if (editorRef.current) {
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        
        // Visual feedback for drop position
        const dropIndicator = document.getElementById('drop-indicator');
        if (dropIndicator) {
          dropIndicator.style.display = 'block';
          dropIndicator.style.left = `${e.clientX - 10}px`;
          dropIndicator.style.top = `${e.clientY - 10}px`;
        } else {
          const indicator = document.createElement('div');
          indicator.id = 'drop-indicator';
          indicator.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgb(6, 182, 212);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            opacity: 0.8;
            left: ${e.clientX - 10}px;
            top: ${e.clientY - 10}px;
          `;
          document.body.appendChild(indicator);
        }
      };

      const handleDragLeave = () => {
        const dropIndicator = document.getElementById('drop-indicator');
        if (dropIndicator) {
          dropIndicator.style.display = 'none';
        }
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const htmlData = e.dataTransfer!.getData('text/html');
        
        // Remove drop indicator
        const dropIndicator = document.getElementById('drop-indicator');
        if (dropIndicator) {
          dropIndicator.remove();
        }
        
        if (htmlData) {
          // Remove the original element to prevent duplication
          const draggedElement = editorRef.current!.querySelector('.editable-media[style*="opacity: 0.3"]');
          if (draggedElement) {
            draggedElement.remove();
          }
          
          // Grid snapping (optional, can be enabled via settings)
          let clientX = e.clientX;
          let clientY = e.clientY;
          
          // Snap to 20px grid if enabled
          const snapToGrid = localStorage.getItem('editor-snap-to-grid') === 'true';
          if (snapToGrid) {
            clientX = Math.round(clientX / 20) * 20;
            clientY = Math.round(clientY / 20) * 20;
          }
          
          // Insert at drop position
          const range = document.caretRangeFromPoint(clientX, clientY);
          if (range) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            const element = tempDiv.firstChild as HTMLElement;
            
            if (element) {
              element.style.opacity = '1';
              element.style.transform = '';
              
              // Add a subtle animation
              element.style.transition = 'all 0.3s ease';
              element.style.transform = 'scale(0.8)';
              
              range.insertNode(element);
              
              setTimeout(() => {
                element.style.transform = 'scale(1)';
              }, 50);
              
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
          editorRef.current.style.backgroundSize = '';
          editorRef.current.style.backgroundPosition = '';
          editorRef.current.style.border = '';
          editorRef.current.style.borderRadius = '';
        }
      };

      editorRef.current.addEventListener('dragover', handleDragOver);
      editorRef.current.addEventListener('dragleave', handleDragLeave);
      editorRef.current.addEventListener('drop', handleDrop);
    }
  }, [editorRef, onMediaEditorOpen, onContentSync]);

  return { setupMediaEventListeners };
};

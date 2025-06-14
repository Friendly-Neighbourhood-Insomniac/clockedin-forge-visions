
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
    
    const mediaContainers = editorRef.current.querySelectorAll('.editable-media-container');
    
    mediaContainers.forEach((container) => {
      const mediaContainer = container as HTMLElement;
      
      // Remove existing listeners by cloning
      const newContainer = mediaContainer.cloneNode(true) as HTMLElement;
      mediaContainer.parentNode?.replaceChild(newContainer, mediaContainer);
      
      const mediaElement = newContainer.querySelector('.editable-media') as HTMLElement;
      if (!mediaElement) return;

      // Enhanced selection with visual feedback
      newContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove previous selections
        editorRef.current?.querySelectorAll('.editable-media-container').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
          (el as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          (el as HTMLElement).classList.remove('media-selected');
          const handles = (el as HTMLElement).querySelector('.resize-handles') as HTMLElement;
          if (handles) handles.style.display = 'none';
        });
        
        // Select current element
        newContainer.style.outline = '3px solid rgb(6, 182, 212)';
        newContainer.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
        newContainer.classList.add('media-selected');
        
        // Show resize handles
        const handles = newContainer.querySelector('.resize-handles') as HTMLElement;
        if (handles) {
          handles.style.display = 'block';
          setupResizeHandles(newContainer, handles);
        }
      });

      // Double-click to edit
      newContainer.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = newContainer.getBoundingClientRect();
        const x = Math.min(rect.right + 10, window.innerWidth - 450);
        const y = Math.max(10, rect.top);
        
        onMediaEditorOpen({
          element: newContainer,
          position: { x, y }
        });
      });

      // Enhanced hover effects
      newContainer.addEventListener('mouseenter', () => {
        if (!newContainer.classList.contains('media-selected')) {
          newContainer.style.border = '2px dashed rgba(6, 182, 212, 0.6)';
        }
        newContainer.style.cursor = 'pointer';
        
        // Show tooltip
        if (!newContainer.querySelector('.quick-actions')) {
          const tooltip = document.createElement('div');
          tooltip.className = 'quick-actions';
          tooltip.style.cssText = `
            position: absolute;
            top: -45px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgb(6, 182, 212), rgb(8, 145, 178));
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
            white-space: nowrap;
          `;
          tooltip.innerHTML = '👆 CLICK TO SELECT • 🎯 DOUBLE-CLICK TO EDIT • 🖱️ DRAG TO MOVE';
          newContainer.appendChild(tooltip);
        }
      });

      newContainer.addEventListener('mouseleave', () => {
        if (!newContainer.classList.contains('media-selected')) {
          newContainer.style.border = '2px solid transparent';
        }
        newContainer.style.cursor = 'default';
        
        // Remove tooltip
        const tooltip = newContainer.querySelector('.quick-actions');
        if (tooltip) {
          tooltip.remove();
        }
      });

      // Keyboard shortcuts for selected elements
      newContainer.addEventListener('keydown', (e) => {
        if (newContainer.classList.contains('media-selected')) {
          e.preventDefault();
          const step = e.shiftKey ? 20 : 5;
          const scaleStep = e.shiftKey ? 0.2 : 0.1;
          
          switch (e.key) {
            case 'Delete':
            case 'Backspace':
              if (confirm('Delete this element?')) {
                newContainer.remove();
                onContentSync();
              }
              break;
            case 'ArrowUp':
              const currentTop = parseInt(newContainer.style.marginTop) || 0;
              newContainer.style.marginTop = `${Math.max(0, currentTop - step)}px`;
              onContentSync();
              break;
            case 'ArrowDown':
              const currentBottom = parseInt(newContainer.style.marginTop) || 0;
              newContainer.style.marginTop = `${currentBottom + step}px`;
              onContentSync();
              break;
            case 'ArrowLeft':
              const currentLeft = parseInt(newContainer.style.marginLeft) || 0;
              newContainer.style.marginLeft = `${Math.max(0, currentLeft - step)}px`;
              onContentSync();
              break;
            case 'ArrowRight':
              const currentRight = parseInt(newContainer.style.marginLeft) || 0;
              newContainer.style.marginLeft = `${currentRight + step}px`;
              onContentSync();
              break;
            case '=':
            case '+':
              scaleElement(newContainer, 1 + scaleStep);
              onContentSync();
              break;
            case '-':
              scaleElement(newContainer, 1 - scaleStep);
              onContentSync();
              break;
            case 'c':
              if (e.ctrlKey || e.metaKey) {
                duplicateElement(newContainer);
                onContentSync();
              }
              break;
          }
        }
      });

      // Make element focusable for keyboard navigation
      newContainer.setAttribute('tabindex', '0');

      // Enhanced drag and drop
      newContainer.addEventListener('dragstart', (e) => {
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', newContainer.outerHTML);
        newContainer.style.opacity = '0.4';
        newContainer.style.transform = 'rotate(2deg) scale(0.95)';
        
        // Store snap to grid preference
        const snapToGrid = localStorage.getItem('editor-snap-to-grid') === 'true';
        e.dataTransfer!.setData('text/plain', snapToGrid ? 'snap' : 'free');
      });

      newContainer.addEventListener('dragend', () => {
        newContainer.style.opacity = '1';
        newContainer.style.transform = '';
      });
    });

    // Enhanced drop zone
    if (editorRef.current) {
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const htmlData = e.dataTransfer!.getData('text/html');
        const snapMode = e.dataTransfer!.getData('text/plain') === 'snap';
        
        if (htmlData) {
          // Remove the original element
          const draggedElement = editorRef.current!.querySelector('.editable-media-container[style*="opacity: 0.4"]');
          if (draggedElement) {
            draggedElement.remove();
          }
          
          // Grid snapping
          let clientX = e.clientX;
          let clientY = e.clientY;
          
          if (snapMode) {
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
              
              range.insertNode(element);
              onContentSync();
              
              // Re-setup listeners
              setTimeout(() => {
                setupMediaEventListeners();
              }, 100);
            }
          }
        }
      };

      editorRef.current.addEventListener('dragover', handleDragOver);
      editorRef.current.addEventListener('drop', handleDrop);
    }

    // Global click handler to deselect elements
    const handleGlobalClick = (e: Event) => {
      if (!editorRef.current?.contains(e.target as Node)) {
        editorRef.current?.querySelectorAll('.editable-media-container').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
          (el as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          (el as HTMLElement).classList.remove('media-selected');
          const handles = (el as HTMLElement).querySelector('.resize-handles') as HTMLElement;
          if (handles) handles.style.display = 'none';
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [editorRef, onMediaEditorOpen, onContentSync]);

  return { setupMediaEventListeners };
};

// Helper functions for enhanced functionality
function setupResizeHandles(container: HTMLElement, handlesContainer: HTMLElement) {
  const handles = handlesContainer.querySelectorAll('.resize-handle');
  
  handles.forEach((handle) => {
    const handleElement = handle as HTMLElement;
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    
    handleElement.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const mediaElement = container.querySelector('img, .embed-content') as HTMLElement;
      if (mediaElement) {
        const rect = mediaElement.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
      }
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const mediaElement = container.querySelector('img, .embed-content') as HTMLElement;
      if (mediaElement) {
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        if (handleElement.classList.contains('se') || handleElement.classList.contains('ne')) {
          newWidth = Math.max(50, startWidth + deltaX);
        } else if (handleElement.classList.contains('sw') || handleElement.classList.contains('nw')) {
          newWidth = Math.max(50, startWidth - deltaX);
        }
        
        if (handleElement.classList.contains('se') || handleElement.classList.contains('sw')) {
          newHeight = Math.max(50, startHeight + deltaY);
        } else if (handleElement.classList.contains('ne') || handleElement.classList.contains('nw')) {
          newHeight = Math.max(50, startHeight - deltaY);
        }
        
        if (mediaElement.tagName === 'IMG') {
          mediaElement.style.width = `${newWidth}px`;
          mediaElement.style.height = 'auto'; // Maintain aspect ratio for images
        } else {
          container.style.width = `${newWidth}px`;
          mediaElement.style.height = `${newHeight}px`;
        }
      }
    };
    
    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });
}

function scaleElement(container: HTMLElement, factor: number) {
  const mediaElement = container.querySelector('img, .embed-content') as HTMLElement;
  if (!mediaElement) return;
  
  if (mediaElement.tagName === 'IMG') {
    const currentWidth = parseInt(mediaElement.style.width) || 300;
    const newWidth = Math.max(50, Math.round(currentWidth * factor));
    mediaElement.style.width = `${newWidth}px`;
    mediaElement.style.height = 'auto';
  } else {
    const currentWidth = parseInt(container.style.width) || 560;
    const currentHeight = parseInt(mediaElement.style.height) || 315;
    const newWidth = Math.max(200, Math.round(currentWidth * factor));
    const newHeight = Math.max(150, Math.round(currentHeight * factor));
    
    container.style.width = `${newWidth}px`;
    mediaElement.style.height = `${newHeight}px`;
  }
}

function duplicateElement(container: HTMLElement) {
  const clonedElement = container.cloneNode(true) as HTMLElement;
  clonedElement.style.marginLeft = `${(parseInt(container.style.marginLeft) || 0) + 20}px`;
  clonedElement.style.marginTop = `${(parseInt(container.style.marginTop) || 0) + 20}px`;
  clonedElement.classList.remove('media-selected');
  clonedElement.style.outline = 'none';
  const handles = clonedElement.querySelector('.resize-handles') as HTMLElement;
  if (handles) handles.style.display = 'none';
  container.parentNode?.insertBefore(clonedElement, container.nextSibling);
}

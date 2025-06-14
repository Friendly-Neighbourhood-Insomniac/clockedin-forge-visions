
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
      
      // Single-click to select with enhanced visual feedback
      newElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove previous selections
        editorRef.current?.querySelectorAll('.editable-media').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
          (el as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          (el as HTMLElement).classList.remove('media-selected');
        });
        
        // Select current element with enhanced styling
        newElement.style.outline = '3px solid rgb(6, 182, 212)';
        newElement.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
        newElement.classList.add('media-selected');
        
        // Add corner resize handles
        addResizeHandles(newElement);
      });

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

      // Enhanced hover effects with better visual feedback
      newElement.addEventListener('mouseenter', () => {
        if (!newElement.classList.contains('media-selected')) {
          newElement.style.border = '2px dashed rgba(6, 182, 212, 0.6)';
        }
        newElement.style.cursor = 'pointer';
        
        // Show enhanced tooltip
        if (!newElement.querySelector('.quick-actions')) {
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
          newElement.style.position = 'relative';
          newElement.appendChild(tooltip);
        }
      });

      newElement.addEventListener('mouseleave', () => {
        if (!newElement.classList.contains('media-selected')) {
          newElement.style.border = '2px solid transparent';
        }
        newElement.style.cursor = 'default';
        
        // Remove tooltip
        const tooltip = newElement.querySelector('.quick-actions');
        if (tooltip) {
          tooltip.remove();
        }
      });

      // Enhanced keyboard shortcuts for selected elements
      newElement.addEventListener('keydown', (e) => {
        if (newElement.classList.contains('media-selected')) {
          e.preventDefault();
          const step = e.shiftKey ? 20 : 5;
          const scaleStep = e.shiftKey ? 0.2 : 0.1;
          
          switch (e.key) {
            case 'Delete':
            case 'Backspace':
              if (confirm('Delete this element?')) {
                newElement.remove();
                onContentSync();
              }
              break;
            case 'ArrowUp':
              const currentTop = parseInt(newElement.style.marginTop) || 0;
              newElement.style.marginTop = `${Math.max(0, currentTop - step)}px`;
              onContentSync();
              break;
            case 'ArrowDown':
              const currentBottom = parseInt(newElement.style.marginTop) || 0;
              newElement.style.marginTop = `${currentBottom + step}px`;
              onContentSync();
              break;
            case 'ArrowLeft':
              const currentLeft = parseInt(newElement.style.marginLeft) || 0;
              newElement.style.marginLeft = `${Math.max(0, currentLeft - step)}px`;
              onContentSync();
              break;
            case 'ArrowRight':
              const currentRight = parseInt(newElement.style.marginLeft) || 0;
              newElement.style.marginLeft = `${currentRight + step}px`;
              onContentSync();
              break;
            case '=':
            case '+':
              scaleElement(newElement, 1 + scaleStep);
              onContentSync();
              break;
            case '-':
              scaleElement(newElement, 1 - scaleStep);
              onContentSync();
              break;
            case 'c':
              if (e.ctrlKey || e.metaKey) {
                duplicateElement(newElement);
                onContentSync();
              }
              break;
          }
        }
      });

      // Make element focusable for keyboard navigation
      newElement.setAttribute('tabindex', '0');

      // Enhanced drag and drop with grid snapping
      newElement.addEventListener('dragstart', (e) => {
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', newElement.outerHTML);
        newElement.style.opacity = '0.4';
        newElement.style.transform = 'rotate(2deg) scale(0.95)';
        
        // Store snap to grid preference
        const snapToGrid = localStorage.getItem('editor-snap-to-grid') === 'true';
        e.dataTransfer!.setData('text/plain', snapToGrid ? 'snap' : 'free');
        
        // Enhanced visual feedback for drop zone
        if (editorRef.current) {
          editorRef.current.style.background = `
            linear-gradient(45deg, rgba(6, 182, 212, 0.1) 25%, transparent 25%, transparent 75%, rgba(6, 182, 212, 0.1) 75%),
            linear-gradient(45deg, rgba(6, 182, 212, 0.1) 25%, transparent 25%, transparent 75%, rgba(6, 182, 212, 0.1) 75%)
          `;
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
        
        // Enhanced drop indicator with grid snapping preview
        const dropIndicator = document.getElementById('drop-indicator');
        const snapMode = e.dataTransfer!.getData('text/plain') === 'snap';
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (snapMode) {
          clientX = Math.round(clientX / 20) * 20;
          clientY = Math.round(clientY / 20) * 20;
        }
        
        if (dropIndicator) {
          dropIndicator.style.display = 'block';
          dropIndicator.style.left = `${clientX - 15}px`;
          dropIndicator.style.top = `${clientY - 15}px`;
          dropIndicator.style.background = snapMode ? 'rgb(34, 197, 94)' : 'rgb(6, 182, 212)';
          dropIndicator.innerHTML = snapMode ? '📐' : '📍';
        } else {
          const indicator = document.createElement('div');
          indicator.id = 'drop-indicator';
          indicator.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            background: ${snapMode ? 'rgb(34, 197, 94)' : 'rgb(6, 182, 212)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            opacity: 0.8;
            left: ${clientX - 15}px;
            top: ${clientY - 15}px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
          `;
          indicator.innerHTML = snapMode ? '📐' : '📍';
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
        const snapMode = e.dataTransfer!.getData('text/plain') === 'snap';
        
        // Remove drop indicator
        const dropIndicator = document.getElementById('drop-indicator');
        if (dropIndicator) {
          dropIndicator.remove();
        }
        
        if (htmlData) {
          // Remove the original element
          const draggedElement = editorRef.current!.querySelector('.editable-media[style*="opacity: 0.4"]');
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
              
              // Smooth drop animation
              element.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
              element.style.transform = 'scale(0.8) rotate(-2deg)';
              
              range.insertNode(element);
              
              setTimeout(() => {
                element.style.transform = 'scale(1) rotate(0deg)';
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

    // Global click handler to deselect elements
    const handleGlobalClick = (e: Event) => {
      if (!editorRef.current?.contains(e.target as Node)) {
        editorRef.current?.querySelectorAll('.editable-media').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
          (el as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          (el as HTMLElement).classList.remove('media-selected');
          removeResizeHandles(el as HTMLElement);
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
function addResizeHandles(element: HTMLElement) {
  // Remove existing handles
  removeResizeHandles(element);
  
  const handles = ['nw', 'ne', 'sw', 'se'];
  handles.forEach(handle => {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = `resize-handle resize-${handle}`;
    resizeHandle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgb(6, 182, 212);
      border: 1px solid white;
      cursor: ${handle}-resize;
      z-index: 1001;
      ${getHandlePosition(handle)}
    `;
    
    element.style.position = 'relative';
    element.appendChild(resizeHandle);
  });
}

function removeResizeHandles(element: HTMLElement) {
  const handles = element.querySelectorAll('.resize-handle');
  handles.forEach(handle => handle.remove());
}

function getHandlePosition(handle: string): string {
  switch (handle) {
    case 'nw': return 'top: -4px; left: -4px;';
    case 'ne': return 'top: -4px; right: -4px;';
    case 'sw': return 'bottom: -4px; left: -4px;';
    case 'se': return 'bottom: -4px; right: -4px;';
    default: return '';
  }
}

function scaleElement(element: HTMLElement, factor: number) {
  const currentWidth = parseInt(element.style.width) || 300;
  const newWidth = Math.max(50, Math.round(currentWidth * factor));
  element.style.width = `${newWidth}px`;
  
  // Maintain aspect ratio if it's an image
  if (element.tagName === 'IMG') {
    element.style.height = 'auto';
  }
}

function duplicateElement(element: HTMLElement) {
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.marginLeft = `${(parseInt(element.style.marginLeft) || 0) + 20}px`;
  clonedElement.style.marginTop = `${(parseInt(element.style.marginTop) || 0) + 20}px`;
  clonedElement.classList.remove('media-selected');
  clonedElement.style.outline = 'none';
  removeResizeHandles(clonedElement);
  element.parentNode?.insertBefore(clonedElement, element.nextSibling);
}

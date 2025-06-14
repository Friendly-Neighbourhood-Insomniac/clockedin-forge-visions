
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
    
    console.log('Setting up media event listeners');
    
    const mediaContainers = editorRef.current.querySelectorAll('.editable-media-container');
    
    mediaContainers.forEach((container) => {
      const mediaContainer = container as HTMLElement;
      
      // Remove existing listeners by cloning
      const newContainer = mediaContainer.cloneNode(true) as HTMLElement;
      mediaContainer.parentNode?.replaceChild(newContainer, mediaContainer);
      
      const mediaElement = newContainer.querySelector('.editable-media') as HTMLElement;
      if (!mediaElement) return;

      console.log('Setting up listeners for media element:', mediaElement);

      // Make container selectable and add visual feedback
      newContainer.style.cursor = 'pointer';
      newContainer.style.transition = 'all 0.2s ease';

      let isSelected = false;
      let isDragging = false;
      let isResizing = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let elementStartX = 0;
      let elementStartY = 0;

      // Selection on click
      newContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Media container clicked');
        
        // Deselect all other elements
        editorRef.current?.querySelectorAll('.editable-media-container').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
          (el as HTMLElement).classList.remove('media-selected');
          const handles = (el as HTMLElement).querySelector('.resize-handles') as HTMLElement;
          if (handles) handles.style.display = 'none';
        });
        
        // Select this element
        isSelected = true;
        newContainer.style.outline = '2px solid #06b6d4';
        newContainer.classList.add('media-selected');
        
        // Show resize handles
        const handles = newContainer.querySelector('.resize-handles') as HTMLElement;
        if (handles) {
          handles.style.display = 'block';
          setupResizeHandles(newContainer, handles, onContentSync);
        }
      });

      // Double-click to open editor
      newContainer.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Media container double-clicked - opening editor');
        
        const rect = newContainer.getBoundingClientRect();
        const x = Math.min(rect.right + 10, window.innerWidth - 450);
        const y = Math.max(10, rect.top);
        
        onMediaEditorOpen({
          element: newContainer,
          position: { x, y }
        });
      });

      // Drag to move
      newContainer.addEventListener('mousedown', (e) => {
        if (e.target && (e.target as HTMLElement).classList.contains('resize-handle')) {
          return; // Don't start drag if clicking on resize handle
        }
        
        if (isSelected) {
          isDragging = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          
          const rect = newContainer.getBoundingClientRect();
          elementStartX = rect.left;
          elementStartY = rect.top;
          
          newContainer.style.zIndex = '9999';
          newContainer.style.opacity = '0.8';
          
          console.log('Started dragging media element');
        }
      });

      // Keyboard shortcuts
      newContainer.addEventListener('keydown', (e) => {
        if (!isSelected) return;
        
        console.log('Keyboard event on selected media:', e.key);
        
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            if (confirm('Delete this media element?')) {
              newContainer.remove();
              onContentSync();
              console.log('Media element deleted');
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            moveElement(newContainer, 0, -5, onContentSync);
            break;
          case 'ArrowDown':
            e.preventDefault();
            moveElement(newContainer, 0, 5, onContentSync);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            moveElement(newContainer, -5, 0, onContentSync);
            break;
          case 'ArrowRight':
            e.preventDefault();
            moveElement(newContainer, 5, 0, onContentSync);
            break;
          case '=':
          case '+':
            e.preventDefault();
            scaleElement(newContainer, 1.1, onContentSync);
            break;
          case '-':
            e.preventDefault();
            scaleElement(newContainer, 0.9, onContentSync);
            break;
        }
      });

      // Make focusable for keyboard events
      newContainer.setAttribute('tabindex', '0');

      // Global mouse events for dragging
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && isSelected) {
          const deltaX = e.clientX - dragStartX;
          const deltaY = e.clientY - dragStartY;
          
          const newX = elementStartX + deltaX;
          const newY = elementStartY + deltaY;
          
          newContainer.style.position = 'relative';
          newContainer.style.left = `${deltaX}px`;
          newContainer.style.top = `${deltaY}px`;
        }
      };

      const handleMouseUp = () => {
        if (isDragging) {
          isDragging = false;
          newContainer.style.zIndex = '';
          newContainer.style.opacity = '';
          onContentSync();
          console.log('Finished dragging media element');
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Cleanup function stored on element
      (newContainer as any)._cleanup = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    });

    // Global click handler to deselect
    const handleGlobalClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.editable-media-container') && !target.closest('.media-editor')) {
        editorRef.current?.querySelectorAll('.editable-media-container').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
          (el as HTMLElement).classList.remove('media-selected');
          const handles = (el as HTMLElement).querySelector('.resize-handles') as HTMLElement;
          if (handles) handles.style.display = 'none';
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      // Cleanup all element listeners
      editorRef.current?.querySelectorAll('.editable-media-container').forEach(el => {
        if ((el as any)._cleanup) {
          (el as any)._cleanup();
        }
      });
    };
  }, [editorRef, onMediaEditorOpen, onContentSync]);

  return { setupMediaEventListeners };
};

// Helper function to setup resize handles
function setupResizeHandles(container: HTMLElement, handlesContainer: HTMLElement, onContentSync: () => void) {
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
      
      console.log('Started resizing');
      
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const mediaElement = container.querySelector('img, .embed-content') as HTMLElement;
      if (mediaElement) {
        const rect = mediaElement.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
      }
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const mediaElement = container.querySelector('img, .embed-content') as HTMLElement;
        if (mediaElement) {
          let newWidth = startWidth;
          let newHeight = startHeight;
          
          if (handleElement.classList.contains('se')) {
            newWidth = Math.max(50, startWidth + deltaX);
            newHeight = Math.max(50, startHeight + deltaY);
          } else if (handleElement.classList.contains('sw')) {
            newWidth = Math.max(50, startWidth - deltaX);
            newHeight = Math.max(50, startHeight + deltaY);
          } else if (handleElement.classList.contains('ne')) {
            newWidth = Math.max(50, startWidth + deltaX);
            newHeight = Math.max(50, startHeight - deltaY);
          } else if (handleElement.classList.contains('nw')) {
            newWidth = Math.max(50, startWidth - deltaX);
            newHeight = Math.max(50, startHeight - deltaY);
          }
          
          if (mediaElement.tagName === 'IMG') {
            // For images, maintain aspect ratio
            mediaElement.style.width = `${newWidth}px`;
            mediaElement.style.height = 'auto';
          } else {
            // For embeds, allow free resizing
            container.style.width = `${newWidth}px`;
            mediaElement.style.height = `${newHeight}px`;
          }
        }
      };
      
      const handleMouseUp = () => {
        isResizing = false;
        onContentSync();
        console.log('Finished resizing');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  });
}

// Helper function to move element
function moveElement(container: HTMLElement, deltaX: number, deltaY: number, onContentSync: () => void) {
  const currentLeft = parseInt(container.style.left) || 0;
  const currentTop = parseInt(container.style.top) || 0;
  
  container.style.position = 'relative';
  container.style.left = `${currentLeft + deltaX}px`;
  container.style.top = `${currentTop + deltaY}px`;
  
  onContentSync();
  console.log('Moved element by', deltaX, deltaY);
}

// Helper function to scale element
function scaleElement(container: HTMLElement, factor: number, onContentSync: () => void) {
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
  
  onContentSync();
  console.log('Scaled element by factor', factor);
}

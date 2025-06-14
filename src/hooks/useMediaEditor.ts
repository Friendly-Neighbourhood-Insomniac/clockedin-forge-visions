
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
    
    console.log('Setting up advanced media event listeners');
    
    // Find all media elements that have the selected class
    const selectedMedia = editorRef.current.querySelectorAll('.selected-media');
    
    selectedMedia.forEach((element) => {
      const mediaElement = element as HTMLElement;
      
      // Add right-click context menu for advanced editing
      mediaElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        const rect = mediaElement.getBoundingClientRect();
        const x = Math.min(rect.right + 10, window.innerWidth - 450);
        const y = Math.max(10, rect.top);
        
        onMediaEditorOpen({
          element: mediaElement,
          position: { x, y }
        });
      });
    });

    // Global cleanup
    return () => {
      console.log('Cleaning up advanced media listeners');
    };
  }, [editorRef, onMediaEditorOpen]);

  return { setupMediaEventListeners };
};


import { useCallback } from 'react';
import { createResizeHandles } from '@/components/text-editor/ResizeHandles';

interface UseMediaSelectionProps {
  selectedElement: HTMLElement | null;
  setSelectedElement: (element: HTMLElement | null) => void;
  setIsResizing: (resizing: boolean) => void;
  syncEditorContent: () => void;
}

export const useMediaSelection = ({
  selectedElement,
  setSelectedElement,
  setIsResizing,
  syncEditorContent
}: UseMediaSelectionProps) => {
  const selectElement = useCallback((element: HTMLElement) => {
    // Clear previous selection
    if (selectedElement) {
      selectedElement.style.border = '2px solid transparent';
      selectedElement.classList.remove('selected-media');
      // Remove existing handles
      const existingHandles = selectedElement.parentNode?.querySelectorAll('.resize-handle');
      existingHandles?.forEach(handle => handle.remove());
    }

    // Select new element
    setSelectedElement(element);
    element.style.border = '2px solid #06b6d4';
    element.classList.add('selected-media');
    element.focus();

    // Create resize handles
    createResizeHandles(element, syncEditorContent, setIsResizing);

    console.log('Selected element:', element.tagName);
  }, [selectedElement, setSelectedElement, setIsResizing, syncEditorContent]);

  const clearSelection = useCallback(() => {
    if (selectedElement) {
      selectedElement.style.border = '2px solid transparent';
      selectedElement.classList.remove('selected-media');
      // Remove resize handles
      const handles = selectedElement.parentNode?.querySelectorAll('.resize-handle');
      handles?.forEach(handle => handle.remove());
      setSelectedElement(null);
    }
  }, [selectedElement, setSelectedElement]);

  return {
    selectElement,
    clearSelection
  };
};

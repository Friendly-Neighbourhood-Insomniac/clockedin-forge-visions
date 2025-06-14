
import { useRef, useCallback } from 'react';

interface UseMediaHandlingProps {
  editorRef: React.RefObject<HTMLDivElement>;
  selectedChapter: string;
  onUpdateChapter: (chapterId: string, field: 'title' | 'content', value: string) => void;
  selectedElement: HTMLElement | null;
  setSelectedElement: (element: HTMLElement | null) => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export const useMediaHandling = ({
  editorRef,
  selectedChapter,
  onUpdateChapter,
  selectedElement,
  setSelectedElement,
  isResizing,
  setIsResizing,
  isDragging,
  setIsDragging
}: UseMediaHandlingProps) => {
  const syncEditorContent = useCallback(() => {
    if (editorRef.current && selectedChapter) {
      const content = editorRef.current.innerHTML;
      onUpdateChapter(selectedChapter, 'content', content);
    }
  }, [editorRef, selectedChapter, onUpdateChapter]);

  const moveElement = useCallback((element: HTMLElement, deltaX: number, deltaY: number) => {
    const currentLeft = parseInt(element.style.marginLeft) || 0;
    const currentTop = parseInt(element.style.marginTop) || 0;
    
    element.style.marginLeft = `${currentLeft + deltaX}px`;
    element.style.marginTop = `${currentTop + deltaY}px`;
    
    syncEditorContent();
  }, [syncEditorContent]);

  const resizeElement = useCallback((element: HTMLElement, factor: number) => {
    if (element.tagName === 'IMG') {
      const currentWidth = parseInt(element.style.width) || element.offsetWidth;
      const newWidth = Math.max(50, currentWidth * factor);
      element.style.width = `${newWidth}px`;
      element.style.height = 'auto';
    } else if (element.tagName === 'IFRAME' || element.classList.contains('embed-container')) {
      const currentWidth = parseInt(element.style.width) || element.offsetWidth;
      const currentHeight = parseInt(element.style.height) || element.offsetHeight;
      const newWidth = Math.max(200, currentWidth * factor);
      const newHeight = Math.max(150, currentHeight * factor);
      
      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    }
    
    syncEditorContent();
  }, [syncEditorContent]);

  const getEmbedUrl = useCallback((url: string, type: 'video' | 'website'): string => {
    if (type === 'video') {
      // Convert YouTube URLs to embed format
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // Convert Vimeo URLs to embed format
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    return url;
  }, []);

  const handleImageInsert = useCallback((imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => {
    if (!editorRef.current) return;
    
    console.log('Inserting image:', imageUrl);
    
    editorRef.current.focus();
    
    const imageHtml = `<img src="${imageUrl}" alt="${metadata?.alt || 'Uploaded image'}" style="width: ${metadata?.width || '300px'}; height: auto; max-width: 100%; border-radius: 4px; margin: 10px; display: inline-block; position: relative;" class="inserted-media" draggable="true" />`;
    
    document.execCommand('insertHTML', false, imageHtml);
    
    setTimeout(() => {
      syncEditorContent();
    }, 100);
  }, [editorRef, syncEditorContent]);

  const handleEmbedInsert = useCallback((embedData: { url: string; title: string; type: 'video' | 'website' }) => {
    if (!editorRef.current) return;
    
    console.log('Inserting embed:', embedData);
    
    editorRef.current.focus();
    
    const embedUrl = getEmbedUrl(embedData.url, embedData.type);
    
    const embedHtml = `<div class="embed-container inserted-media" style="width: 560px; max-width: 100%; margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #f8fafc; display: inline-block; position: relative;" draggable="true">
      <div style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #334155;">
        ${embedData.title} <span style="font-size: 10px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; margin-left: 10px;">${embedData.type.toUpperCase()}</span>
      </div>
      <iframe src="${embedUrl}" width="100%" height="315" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="border: none; display: block;"></iframe>
    </div>`;
    
    document.execCommand('insertHTML', false, embedHtml);
    
    setTimeout(() => {
      syncEditorContent();
    }, 100);
  }, [editorRef, getEmbedUrl, syncEditorContent]);

  return {
    syncEditorContent,
    moveElement,
    resizeElement,
    handleImageInsert,
    handleEmbedInsert
  };
};

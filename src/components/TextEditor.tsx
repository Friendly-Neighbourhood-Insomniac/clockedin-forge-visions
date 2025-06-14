import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import AdvancedToolbar from '@/components/AdvancedToolbar';
import PageLayout from '@/components/PageLayout';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface TextEditorProps {
  currentChapter: Chapter | undefined;
  selectedChapter: string;
  onUpdateChapter: (chapterId: string, field: 'title' | 'content', value: string) => void;
  onImageInsert: (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => void;
  onEmbedInsert: (embedData: { url: string; title: string; type: 'video' | 'website' }) => void;
  onFormatText: (command: string, value?: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onSetupMediaListeners: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  currentChapter,
  selectedChapter,
  onUpdateChapter,
  onImageInsert,
  onEmbedInsert,
  onFormatText,
  onFontChange,
  onFontSizeChange,
  onColorChange,
  onSetupMediaListeners
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const syncEditorContent = () => {
    if (editorRef.current && selectedChapter) {
      const content = editorRef.current.innerHTML;
      onUpdateChapter(selectedChapter, 'content', content);
    }
  };

  // Setup content when chapter changes
  useEffect(() => {
    if (editorRef.current && currentChapter) {
      editorRef.current.innerHTML = currentChapter.content || '';
      setTimeout(() => {
        setupMediaHandlers();
      }, 100);
    }
  }, [selectedChapter, currentChapter?.id]);

  const createResizeHandles = (element: HTMLElement) => {
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
        const rect = element.getBoundingClientRect();

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
          syncEditorContent();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      });

      element.parentNode?.insertBefore(handle, element.nextSibling);
    });
  };

  const setupMediaHandlers = () => {
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

    // Global keyboard handler
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

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  const selectElement = (element: HTMLElement) => {
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
    createResizeHandles(element);

    console.log('Selected element:', element.tagName);
  };

  const moveElement = (element: HTMLElement, deltaX: number, deltaY: number) => {
    const currentLeft = parseInt(element.style.marginLeft) || 0;
    const currentTop = parseInt(element.style.marginTop) || 0;
    
    element.style.marginLeft = `${currentLeft + deltaX}px`;
    element.style.marginTop = `${currentTop + deltaY}px`;
    
    syncEditorContent();
  };

  const resizeElement = (element: HTMLElement, factor: number) => {
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
    
    // Update resize handles
    if (selectedElement === element) {
      createResizeHandles(element);
    }
    
    syncEditorContent();
  };

  const getEmbedUrl = (url: string, type: 'video' | 'website'): string => {
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
  };

  const handleImageInsert = (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => {
    if (!editorRef.current) return;
    
    console.log('Inserting image:', imageUrl);
    
    editorRef.current.focus();
    
    const imageHtml = `<img src="${imageUrl}" alt="${metadata?.alt || 'Uploaded image'}" style="width: ${metadata?.width || '300px'}; height: auto; max-width: 100%; border-radius: 4px; margin: 10px; display: inline-block; position: relative;" class="inserted-media" draggable="true" />`;
    
    document.execCommand('insertHTML', false, imageHtml);
    
    setTimeout(() => {
      setupMediaHandlers();
      syncEditorContent();
    }, 100);
  };

  const handleEmbedInsert = (embedData: { url: string; title: string; type: 'video' | 'website' }) => {
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
      setupMediaHandlers();
      syncEditorContent();
    }, 100);
  };

  // Clear selection when clicking in editor
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('img, iframe, .embed-container, .resize-handle')) {
      if (selectedElement) {
        selectedElement.style.border = '2px solid transparent';
        selectedElement.classList.remove('selected-media');
        // Remove resize handles
        const handles = selectedElement.parentNode?.querySelectorAll('.resize-handle');
        handles?.forEach(handle => handle.remove());
        setSelectedElement(null);
      }
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardHeader>
        <Input
          value={currentChapter?.title || ''}
          onChange={(e) => onUpdateChapter(selectedChapter, 'title', e.target.value)}
          placeholder="Chapter Title"
          className="text-xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0"
        />
      </CardHeader>
      
      <AdvancedToolbar
        onFormat={onFormatText}
        onImageInsert={handleImageInsert}
        onEmbedInsert={handleEmbedInsert}
        onFontChange={onFontChange}
        onFontSizeChange={onFontSizeChange}
        onColorChange={onColorChange}
      />
      
      <CardContent className="relative p-2">
        <PageLayout className="min-h-[600px]">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[500px] p-4 bg-transparent rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            style={{ lineHeight: '1.6' }}
            onBlur={syncEditorContent}
            onInput={syncEditorContent}
            onClick={handleEditorClick}
            suppressContentEditableWarning={true}
          />
        </PageLayout>
        
        {!currentChapter && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400 py-20">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Select a chapter to start writing</p>
              <p className="text-sm">📷 Upload images • 🎥 Embed videos • 🖱️ Click & drag to move</p>
              <p className="text-sm mt-1">🎯 Click to select • ⌨️ Delete key to remove • +/- to resize</p>
              <p className="text-sm mt-1">↑↓←→ Arrow keys to move selected media • 🔄 Drag resize handles</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEditor;

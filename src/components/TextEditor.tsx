
import React, { useRef, useEffect } from 'react';
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
        onSetupMediaListeners();
      }, 100);
    }
  }, [selectedChapter, currentChapter?.id, onSetupMediaListeners]);

  const handleImageInsert = (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => {
    if (!editorRef.current) return;
    
    console.log('Inserting image:', imageUrl);
    
    // Focus the editor first
    editorRef.current.focus();
    
    // Create the image HTML with resize handles
    const imageHtml = `<div class="editable-media-container" data-media-type="image" style="position: relative; display: inline-block; margin: 10px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s ease; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" draggable="false">
      <img src="${imageUrl}" alt="${metadata?.alt || 'Uploaded image'}" style="max-width: 100%; height: auto; width: ${metadata?.width || '300px'}; border-radius: 4px; display: block; user-select: none;" class="editable-media" data-media-type="image" draggable="false" />
      <div class="resize-handles" style="display: none; position: absolute; pointer-events: auto;">
        <div class="resize-handle nw" style="position: absolute; top: -5px; left: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: nw-resize; z-index: 1001; border-radius: 50%;"></div>
        <div class="resize-handle ne" style="position: absolute; top: -5px; right: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: ne-resize; z-index: 1001; border-radius: 50%;"></div>
        <div class="resize-handle sw" style="position: absolute; bottom: -5px; left: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: sw-resize; z-index: 1001; border-radius: 50%;"></div>
        <div class="resize-handle se" style="position: absolute; bottom: -5px; right: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: se-resize; z-index: 1001; border-radius: 50%;"></div>
      </div>
    </div>`;
    
    // Insert the image
    document.execCommand('insertHTML', false, imageHtml);
    
    // Sync content and setup listeners
    syncEditorContent();
    setTimeout(() => {
      onSetupMediaListeners();
    }, 100);
  };

  const getEmbedUrl = (url: string, type: 'video' | 'website'): string => {
    if (type === 'video') {
      // Convert YouTube URLs to embed format
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
      }
      // Convert Vimeo URLs to embed format
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    return url;
  };

  const handleEmbedInsert = (embedData: { url: string; title: string; type: 'video' | 'website' }) => {
    if (!editorRef.current) return;
    
    console.log('Inserting embed:', embedData);
    
    // Focus the editor first
    editorRef.current.focus();
    
    const embedUrl = getEmbedUrl(embedData.url, embedData.type);
    
    const embedHtml = `<div class="editable-media-container" data-media-type="embed" data-url="${embedData.url}" data-title="${embedData.title}" data-type="${embedData.type}" style="position: relative; display: inline-block; margin: 20px 0; padding: 0; border: 2px solid transparent; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; width: 560px; max-width: 100%; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" draggable="false">
      <div class="embed-header" style="background: #f8fafc; padding: 10px 15px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; user-select: none;">
        <h4 style="margin: 0; color: #334155; font-size: 14px; font-weight: 600;">${embedData.title}</h4>
        <span style="font-size: 10px; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${embedData.type.toUpperCase()}</span>
      </div>
      <div class="embed-content editable-media" data-media-type="embed" style="position: relative; width: 100%; height: 315px; background: #000; border-radius: 0 0 8px 8px; overflow: hidden;">
        <iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="border: none; border-radius: 0 0 8px 8px;"></iframe>
      </div>
      <div class="resize-handles" style="display: none; position: absolute; pointer-events: auto;">
        <div class="resize-handle nw" style="position: absolute; top: -5px; left: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: nw-resize; z-index: 1001; border-radius: 50%;"></div>
        <div class="resize-handle ne" style="position: absolute; top: -5px; right: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: ne-resize; z-index: 1001; border-radius: 50%;"></div>
        <div class="resize-handle sw" style="position: absolute; bottom: -5px; left: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: sw-resize; z-index: 1001; border-radius: 50%;"></div>
        <div class="resize-handle se" style="position: absolute; bottom: -5px; right: -5px; width: 10px; height: 10px; background: #06b6d4; border: 2px solid white; cursor: se-resize; z-index: 1001; border-radius: 50%;"></div>
      </div>
    </div>`;
    
    // Insert the embed
    document.execCommand('insertHTML', false, embedHtml);
    
    // Sync content and setup listeners
    syncEditorContent();
    setTimeout(() => {
      onSetupMediaListeners();
    }, 100);
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
            suppressContentEditableWarning={true}
          />
        </PageLayout>
        
        {!currentChapter && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400 py-20">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Select a chapter to start writing</p>
              <p className="text-sm">📷 Upload images • 🎥 Embed videos • 🖱️ Click & drag to move</p>
              <p className="text-sm mt-1">🎯 Click to select • ⌨️ Delete key to remove • 🔄 Drag corners to resize</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEditor;


import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import AdvancedToolbar from '@/components/AdvancedToolbar';

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
    
    // Create the image HTML
    const imageHtml = `<img src="${imageUrl}" alt="${metadata?.alt || 'Uploaded image'}" style="max-width: 100%; height: auto; margin: 10px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s ease; width: ${metadata?.width || '300px'};" class="editable-media" data-media-type="image" draggable="true" />`;
    
    // Insert the image
    document.execCommand('insertHTML', false, imageHtml);
    
    // Sync content and setup listeners
    syncEditorContent();
    setTimeout(() => {
      onSetupMediaListeners();
    }, 100);
  };

  const handleEmbedInsert = (embedData: { url: string; title: string; type: 'video' | 'website' }) => {
    if (!editorRef.current) return;
    
    console.log('Inserting embed:', embedData);
    
    // Focus the editor first
    editorRef.current.focus();
    
    const embedHtml = `<div class="embed-container editable-media" data-url="${embedData.url}" data-title="${embedData.title}" data-type="${embedData.type}" data-media-type="embed" draggable="true" style="margin: 20px 0; padding: 15px; border: 2px solid transparent; border-radius: 8px; background: #f8fafc; cursor: pointer; transition: all 0.2s ease; position: relative; max-width: 100%; width: 400px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><h4 style="margin: 0; color: #334155; flex: 1; font-size: 16px;">${embedData.title}</h4><span style="font-size: 10px; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">DOUBLE-CLICK TO EDIT</span></div><div style="background: #e2e8f0; padding: 40px; text-align: center; border-radius: 4px; color: #64748b;"><p style="margin: 0; font-size: 14px;">📺 ${embedData.type === 'video' ? 'Video' : 'Website'} Embed</p><p style="margin: 5px 0 0 0; font-size: 12px;">${embedData.url}</p></div><div style="position: absolute; top: 5px; right: 5px; background: rgba(6, 182, 212, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #0891b2;">DRAG TO MOVE</div></div>`;
    
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
      
      <CardContent className="relative">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[500px] p-4 bg-slate-900/30 rounded-lg border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          style={{ lineHeight: '1.6' }}
          onBlur={syncEditorContent}
          onInput={syncEditorContent}
          suppressContentEditableWarning={true}
        />
        {!currentChapter && (
          <div className="text-center text-slate-400 py-20">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Select a chapter to start writing</p>
            <p className="text-sm">📷 Upload images • 🎥 Embed videos • 🖱️ Drag to reposition</p>
            <p className="text-sm mt-1">Double-click media to edit size and alignment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEditor;


import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import AdvancedToolbar from '@/components/AdvancedToolbar';
import PageLayout from '@/components/PageLayout';
import { useMediaHandling } from '@/hooks/useMediaHandling';
import { useMediaSelection } from '@/hooks/useMediaSelection';
import { useMediaEventHandlers } from '@/hooks/useMediaEventHandlers';

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

  const {
    syncEditorContent,
    moveElement,
    resizeElement,
    handleImageInsert,
    handleEmbedInsert
  } = useMediaHandling({
    editorRef,
    selectedChapter,
    onUpdateChapter,
    selectedElement,
    setSelectedElement,
    isResizing,
    setIsResizing,
    isDragging,
    setIsDragging
  });

  const { selectElement, clearSelection } = useMediaSelection({
    selectedElement,
    setSelectedElement,
    setIsResizing,
    syncEditorContent
  });

  const { setupMediaHandlers } = useMediaEventHandlers({
    editorRef,
    selectedElement,
    isResizing,
    isDragging,
    selectElement,
    moveElement,
    resizeElement,
    syncEditorContent,
    setSelectedElement,
    setIsDragging
  });

  // Setup content when chapter changes
  useEffect(() => {
    if (editorRef.current && currentChapter) {
      editorRef.current.innerHTML = currentChapter.content || '';
      setTimeout(() => {
        setupMediaHandlers();
      }, 100);
    }
  }, [selectedChapter, currentChapter?.id, setupMediaHandlers]);

  // Clear selection when clicking in editor
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('img, iframe, .embed-container, .resize-handle')) {
      clearSelection();
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

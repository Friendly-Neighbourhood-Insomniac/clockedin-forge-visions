
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

  // Setup media event listeners when chapter changes
  useEffect(() => {
    if (currentChapter && editorRef.current) {
      setTimeout(() => {
        onSetupMediaListeners();
      }, 300);
    }
  }, [selectedChapter, currentChapter?.content, onSetupMediaListeners]);

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
        onImageInsert={onImageInsert}
        onEmbedInsert={onEmbedInsert}
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
          dangerouslySetInnerHTML={{ __html: currentChapter?.content || '' }}
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

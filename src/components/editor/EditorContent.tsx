
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import EnhancedToolbar from '@/components/editor/EnhancedToolbar';
import { useEditorStore } from '@/stores/editorStore';

interface Chapter {
  id: string;
  title: string;
  content?: string;
}

interface EditorContentProps {
  selectedChapter: Chapter | null;
  onChapterTitleChange: (title: string) => void;
  onContentSave: () => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  selectedChapter,
  onChapterTitleChange,
  onContentSave
}) => {
  const { setContent } = useEditorStore();

  // Clear editor content when chapter changes or no chapter is selected
  useEffect(() => {
    if (!selectedChapter) {
      setContent('');
    } else {
      // Load the chapter content, or empty string for new chapters
      setContent(selectedChapter.content || '');
    }
  }, [selectedChapter?.id, setContent]);

  if (!selectedChapter) {
    return (
      <Card className="bg-slate-800/50 border-cyan-400/30">
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Select a chapter to start editing</p>
            <p className="text-sm">Choose from the sidebar or create a new chapter</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chapter Title */}
      <Card className="bg-slate-800/50 border-cyan-400/30">
        <CardContent className="p-4">
          <Input
            value={selectedChapter.title}
            onChange={(e) => onChapterTitleChange(e.target.value)}
            placeholder="Chapter Title"
            className="text-xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0"
          />
        </CardContent>
      </Card>

      {/* Enhanced Editor Toolbar */}
      <EnhancedToolbar />

      {/* Tiptap Editor */}
      <TiptapEditor
        placeholder="Start writing your chapter..."
        onBlur={onContentSave}
      />
    </div>
  );
};

export default EditorContent;

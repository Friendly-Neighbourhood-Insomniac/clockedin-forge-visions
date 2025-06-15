
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  wordCount?: number;
}

interface ChapterSidebarProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onSelectChapter: (chapterId: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (chapterId: string) => void;
}

const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  chapters,
  selectedChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter
}) => {
  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-100">Chapters</h3>
        <Button
          size="sm"
          onClick={onAddChapter}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {chapters.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No chapters yet</p>
            <p className="text-sm">Click + to add your first chapter</p>
          </div>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChapterId === chapter.id
                  ? 'bg-cyan-600/20 border border-cyan-400/50'
                  : 'bg-slate-700/50 hover:bg-slate-700'
              }`}
              onClick={() => onSelectChapter(chapter.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-200 truncate">{chapter.title}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this chapter?')) {
                      onDeleteChapter(chapter.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              {chapter.wordCount && (
                <div className="text-xs text-slate-400 mt-1">
                  {chapter.wordCount} words
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterSidebar;

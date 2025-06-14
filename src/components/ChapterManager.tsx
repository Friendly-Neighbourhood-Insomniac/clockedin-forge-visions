
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface ChapterManagerProps {
  chapters: Chapter[];
  selectedChapter: string;
  onChapterSelect: (chapterId: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (chapterId: string) => void;
}

const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  selectedChapter,
  onChapterSelect,
  onAddChapter,
  onDeleteChapter
}) => {
  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardHeader>
        <CardTitle className="text-cyan-100 flex items-center justify-between">
          Chapters
          <Button
            onClick={onAddChapter}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`p-3 rounded cursor-pointer transition-all ${
              selectedChapter === chapter.id
                ? 'bg-cyan-600/20 border border-cyan-400/40'
                : 'bg-slate-700/30 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-slate-200 flex-1"
                onClick={() => onChapterSelect(chapter.id)}
              >
                {chapter.title}
              </span>
              <Button
                onClick={() => onDeleteChapter(chapter.id)}
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {chapters.length === 0 && (
          <p className="text-slate-400 text-center py-4">
            No chapters yet. Click + to add one.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterManager;

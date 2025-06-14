
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Hash, FileText } from 'lucide-react';

interface BookStatsProps {
  chapters: Array<{ content: string; title: string }>;
}

const BookStats: React.FC<BookStatsProps> = ({ chapters }) => {
  const calculateStats = () => {
    const totalWords = chapters.reduce((acc, chapter) => {
      const text = chapter.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      return acc + words.length;
    }, 0);

    const totalCharacters = chapters.reduce((acc, chapter) => {
      const text = chapter.content.replace(/<[^>]*>/g, '');
      return acc + text.length;
    }, 0);

    const estimatedReadingTime = Math.ceil(totalWords / 200); // 200 words per minute
    const estimatedPages = Math.ceil(totalWords / 250); // 250 words per page

    return {
      totalWords,
      totalCharacters,
      estimatedReadingTime,
      estimatedPages,
      chapterCount: chapters.length
    };
  };

  const stats = calculateStats();

  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardHeader>
        <CardTitle className="text-cyan-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Book Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium">{stats.chapterCount}</p>
              <p className="text-xs text-slate-400">Chapters</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Hash className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium">{stats.totalWords.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Words</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium">{stats.estimatedReadingTime} min</p>
              <p className="text-xs text-slate-400">Read time</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium">~{stats.estimatedPages}</p>
              <p className="text-xs text-slate-400">Pages</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookStats;

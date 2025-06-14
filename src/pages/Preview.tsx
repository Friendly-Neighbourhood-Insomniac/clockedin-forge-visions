import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import TurnJsFlipbook from '@/components/preview/TurnJsFlipbook';
import { useBookMetadataStore } from '@/stores/bookMetadataStore';
import { useChapterTreeStore } from '@/stores/chapterTreeStore';

const Preview: React.FC = () => {
  const { metadata } = useBookMetadataStore();
  const { chapters } = useChapterTreeStore();

  const bookData = {
    title: metadata.title || 'Untitled Book',
    author: metadata.author || 'Unknown Author',
    description: metadata.description || 'No description available',
    chapters: chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      content: chapter.content || ''
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-cyan-400/30 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/editor">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-cyan-100">
              📖 Preview: {bookData.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Link to="/export">
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Flipbook Container */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          <TurnJsFlipbook 
            bookData={bookData}
            width={800}
            height={600}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800/30 border-t border-slate-700/50 p-4">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>Use zoom controls to scale the book • Click and drag to pan • Use navigation arrows to turn pages</p>
        </div>
      </div>
    </div>
  );
};

export default Preview;

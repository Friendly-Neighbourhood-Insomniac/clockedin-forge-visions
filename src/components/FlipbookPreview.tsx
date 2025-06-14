
import React, { useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface BookData {
  title: string;
  author: string;
  description: string;
  chapters: Chapter[];
}

interface FlipbookPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  bookData: BookData;
}

const FlipbookPreview: React.FC<FlipbookPreviewProps> = ({ isOpen, onClose, bookData }) => {
  const flipBookRef = useRef<any>(null);

  const nextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-slate-900 border-cyan-400/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-100 flex items-center justify-between">
            📖 {bookData.title} - Flipbook Preview
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="flipbook-container">
            <HTMLFlipBook
              ref={flipBookRef}
              width={400}
              height={600}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              showCover={true}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.5}
              showPageCorners={true}
              disableFlipByClick={false}
              className="flipbook"
            >
              {/* Cover Page */}
              <div className="page cover-page">
                <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-8 rounded-lg shadow-2xl">
                  <h1 className="text-4xl font-bold mb-4 text-center">{bookData.title}</h1>
                  <p className="text-xl mb-6 text-cyan-300">by {bookData.author}</p>
                  <p className="text-center text-slate-300 italic">{bookData.description}</p>
                </div>
              </div>

              {/* Chapter Pages */}
              {bookData.chapters.map((chapter, index) => (
                <div key={chapter.id} className="page">
                  <div className="h-full bg-white p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b-2 border-cyan-500 pb-2">
                      {chapter.title}
                    </h2>
                    <div 
                      className="text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: chapter.content || '<p className="text-slate-500 italic">No content yet...</p>' }}
                    />
                    <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                      Page {index + 2}
                    </div>
                  </div>
                </div>
              ))}

              {/* Back Cover */}
              <div className="page back-cover">
                <div className="h-full bg-gradient-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center text-white p-8 rounded-lg shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4">Thank you for reading!</h3>
                  <p className="text-center text-slate-300">
                    Created with BookForge
                  </p>
                  <div className="mt-8 text-cyan-300 text-center">
                    <p className="text-sm">
                      {bookData.chapters.length} chapters • {bookData.author}
                    </p>
                  </div>
                </div>
              </div>
            </HTMLFlipBook>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={prevPage}
              className="bg-slate-700 hover:bg-slate-600 text-white"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextPage}
              className="bg-slate-700 hover:bg-slate-600 text-white"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <style jsx>{`
          .flipbook-container {
            perspective: 1000px;
          }
          .page {
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .cover-page, .back-cover {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default FlipbookPreview;

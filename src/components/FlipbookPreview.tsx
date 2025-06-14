
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import TurnJsFlipbook from '@/components/preview/TurnJsFlipbook';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] bg-slate-900 border-cyan-400/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-100 flex items-center justify-between">
            📖 {bookData.title} - Flipbook Preview
            <div className="flex items-center gap-2">
              <Link to="/preview" onClick={onClose}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-300 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Full Screen
                </Button>
              </Link>
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex items-center justify-center">
          <TurnJsFlipbook 
            bookData={bookData}
            width={600}
            height={450}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlipbookPreview;

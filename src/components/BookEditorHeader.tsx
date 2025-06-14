
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

interface BookEditorHeaderProps {
  onGenerateEPUB: () => void;
  onDownloadPDF: () => void;
  onOpenFlipbookPreview: () => void;
}

const BookEditorHeader: React.FC<BookEditorHeaderProps> = ({
  onGenerateEPUB,
  onDownloadPDF,
  onOpenFlipbookPreview
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
          BookForge Professional
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={onGenerateEPUB}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export EPUB
          </Button>
          <Button
            onClick={onDownloadPDF}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            onClick={onOpenFlipbookPreview}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Flipbook Preview
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookEditorHeader;

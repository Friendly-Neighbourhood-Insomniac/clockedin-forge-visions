
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExportControlsProps {
  isExporting: string | null;
  onExport: (format: 'pdf' | 'epub' | 'html') => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({
  isExporting,
  onExport
}) => {
  return (
    <div className="flex items-center gap-2 ml-4">
      <Link to="/preview">
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </Link>
      
      <Button
        size="sm"
        onClick={() => onExport('pdf')}
        disabled={isExporting !== null}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        PDF
      </Button>
      
      <Button
        size="sm"
        onClick={() => onExport('epub')}
        disabled={isExporting !== null}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isExporting === 'epub' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        EPUB
      </Button>
      
      <Button
        size="sm"
        onClick={() => onExport('html')}
        disabled={isExporting !== null}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isExporting === 'html' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        HTML
      </Button>

      <Link to="/export">
        <Button size="sm" variant="outline" className="border-cyan-400/30 text-slate-300 hover:text-white hover:bg-slate-700">
          <Download className="w-4 h-4 mr-2" />
          More Options
        </Button>
      </Link>
    </div>
  );
};

export default ExportControls;

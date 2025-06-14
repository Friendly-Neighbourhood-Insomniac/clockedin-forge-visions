
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Trash2, MousePointer } from 'lucide-react';

interface MediaEditorHeaderProps {
  onClose: () => void;
  onDelete: () => void;
}

const MediaEditorHeader: React.FC<MediaEditorHeaderProps> = ({ onClose, onDelete }) => {
  return (
    <div className="p-3 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
      <div className="flex items-center justify-between">
        <span className="text-cyan-100 font-medium text-sm flex items-center gap-2">
          <MousePointer className="w-4 h-4" />
          Element Editor
        </span>
        <div className="flex gap-1">
          <Button onClick={onDelete} size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-6 w-6 p-0">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button onClick={onClose} size="sm" variant="ghost" className="text-slate-400 h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-slate-400 mt-1">
        DEL: Delete • ESC: Close • +/-: Scale • Arrows: Move
      </div>
    </div>
  );
};

export default MediaEditorHeader;

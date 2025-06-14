
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ZoomOut, ZoomIn, Copy, Trash2, Minimize2, Maximize2 } from 'lucide-react';

interface QuickActionsPanelProps {
  onScale: (scale: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onQuickResize: (size: 'small' | 'medium' | 'large' | 'full') => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onScale,
  onDuplicate,
  onDelete,
  onQuickResize
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-medium">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => onScale(0.5)} size="sm" variant="outline" className="text-xs">
            <ZoomOut className="w-3 h-3 mr-1" />
            50%
          </Button>
          <Button onClick={() => onScale(2)} size="sm" variant="outline" className="text-xs">
            <ZoomIn className="w-3 h-3 mr-1" />
            200%
          </Button>
          <Button onClick={onDuplicate} size="sm" variant="outline" className="text-xs">
            <Copy className="w-3 h-3 mr-1" />
            Duplicate
          </Button>
          <Button onClick={onDelete} size="sm" variant="destructive" className="text-xs">
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Resize */}
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-medium">Quick Resize</Label>
        <div className="grid grid-cols-4 gap-1">
          <Button onClick={() => onQuickResize('small')} size="sm" variant="outline" className="text-xs">
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button onClick={() => onQuickResize('medium')} size="sm" variant="outline" className="text-xs">
            S
          </Button>
          <Button onClick={() => onQuickResize('large')} size="sm" variant="outline" className="text-xs">
            <Maximize2 className="w-3 h-3" />
          </Button>
          <Button onClick={() => onQuickResize('full')} size="sm" variant="outline" className="text-xs">
            Full
          </Button>
        </div>
      </div>

      {/* Precise Scaling */}
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-medium">Precise Scaling</Label>
        <div className="grid grid-cols-5 gap-1">
          <Button onClick={() => onScale(0.75)} size="sm" variant="ghost" className="text-xs">75%</Button>
          <Button onClick={() => onScale(0.9)} size="sm" variant="ghost" className="text-xs">90%</Button>
          <Button onClick={() => onScale(1)} size="sm" variant="ghost" className="text-xs">100%</Button>
          <Button onClick={() => onScale(1.25)} size="sm" variant="ghost" className="text-xs">125%</Button>
          <Button onClick={() => onScale(1.5)} size="sm" variant="ghost" className="text-xs">150%</Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;

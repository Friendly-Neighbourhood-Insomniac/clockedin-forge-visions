
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MovementControlsProps {
  snapToGrid: boolean;
  onSnapToGridChange: (value: boolean) => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const MovementControls: React.FC<MovementControlsProps> = ({
  snapToGrid,
  onSnapToGridChange,
  onMove
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-slate-300 text-xs font-medium">Movement</Label>
        <div className="flex items-center gap-2">
          <Label className="text-slate-300 text-xs">Grid Snap</Label>
          <Switch checked={snapToGrid} onCheckedChange={onSnapToGridChange} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        <div></div>
        <Button onClick={() => onMove('up')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
          <ArrowUp className="w-4 h-4" />
        </Button>
        <div></div>
        <Button onClick={() => onMove('left')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="text-center text-xs text-slate-400 flex items-center justify-center">
          {snapToGrid ? '20px' : '5px'}
        </div>
        <Button onClick={() => onMove('right')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
          <ArrowRight className="w-4 h-4" />
        </Button>
        <div></div>
        <Button onClick={() => onMove('down')} size="sm" variant="ghost" className="text-slate-300 h-8 p-1">
          <ArrowDown className="w-4 h-4" />
        </Button>
        <div></div>
      </div>
    </div>
  );
};

export default MovementControls;

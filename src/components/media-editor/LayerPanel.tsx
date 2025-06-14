
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Layers } from 'lucide-react';

interface LayerPanelProps {
  zIndex: number;
  onZIndexChange: (value: number) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({ zIndex, onZIndexChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-slate-300 text-xs flex items-center gap-2">
          <Layers className="w-3 h-3" />
          Layer Order
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Button 
            onClick={() => onZIndexChange(Math.max(1, zIndex - 1))} 
            size="sm" 
            variant="outline" 
            className="text-xs"
          >
            Back
          </Button>
          <span className="text-slate-300 text-xs flex-1 text-center">{zIndex}</span>
          <Button 
            onClick={() => onZIndexChange(zIndex + 1)} 
            size="sm" 
            variant="outline" 
            className="text-xs"
          >
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayerPanel;

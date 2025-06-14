
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface StylePanelProps {
  rotation: number;
  opacity: number;
  borderRadius: number;
  onRotationChange: (value: number) => void;
  onOpacityChange: (value: number) => void;
  onBorderRadiusChange: (value: number) => void;
}

const StylePanel: React.FC<StylePanelProps> = ({
  rotation,
  opacity,
  borderRadius,
  onRotationChange,
  onOpacityChange,
  onBorderRadiusChange
}) => {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-slate-300 text-xs mb-2 block">Rotation: {rotation}°</Label>
        <Slider
          value={[rotation]}
          onValueChange={(value) => onRotationChange(value[0])}
          min={-180}
          max={180}
          step={5}
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="text-slate-300 text-xs mb-2 block">Opacity: {opacity}%</Label>
        <Slider
          value={[opacity]}
          onValueChange={(value) => onOpacityChange(value[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      <div>
        <Label className="text-slate-300 text-xs mb-2 block">Border Radius: {borderRadius}px</Label>
        <Slider
          value={[borderRadius]}
          onValueChange={(value) => onBorderRadiusChange(value[0])}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StylePanel;

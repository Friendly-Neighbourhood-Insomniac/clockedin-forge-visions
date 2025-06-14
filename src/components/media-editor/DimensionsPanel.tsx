
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DimensionsPanelProps {
  width: string;
  height: string;
  aspectRatio: string;
  alignment: string;
  margin: string;
  padding: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
  onMarginChange: (value: string) => void;
  onPaddingChange: (value: string) => void;
}

const DimensionsPanel: React.FC<DimensionsPanelProps> = ({
  width,
  height,
  aspectRatio,
  alignment,
  margin,
  padding,
  onWidthChange,
  onHeightChange,
  onAspectRatioChange,
  onAlignmentChange,
  onMarginChange,
  onPaddingChange
}) => {
  return (
    <div className="space-y-4">
      {/* Dimensions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-slate-300 text-xs">Aspect Ratio</Label>
          <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="free" className="text-slate-200">Free</SelectItem>
              <SelectItem value="16:9" className="text-slate-200">16:9</SelectItem>
              <SelectItem value="4:3" className="text-slate-200">4:3</SelectItem>
              <SelectItem value="1:1" className="text-slate-200">1:1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-300 text-xs">Width</Label>
            <Input
              value={width}
              onChange={(e) => onWidthChange(e.target.value)}
              placeholder="300px"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
          <div>
            <Label className="text-slate-300 text-xs">Height</Label>
            <Input
              value={height}
              onChange={(e) => onHeightChange(e.target.value)}
              placeholder="auto"
              className="bg-slate-700 border-slate-600 text-slate-100 h-8"
            />
          </div>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <Label className="text-slate-300 text-xs">Alignment</Label>
        <Select value={alignment} onValueChange={onAlignmentChange}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="left" className="text-slate-200">Left</SelectItem>
            <SelectItem value="center" className="text-slate-200">Center</SelectItem>
            <SelectItem value="right" className="text-slate-200">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-300 text-xs">Margin (px)</Label>
          <Input
            value={margin}
            onChange={(e) => onMarginChange(e.target.value)}
            placeholder="10"
            className="bg-slate-700 border-slate-600 text-slate-100 h-8"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-xs">Padding (px)</Label>
          <Input
            value={padding}
            onChange={(e) => onPaddingChange(e.target.value)}
            placeholder="0"
            className="bg-slate-700 border-slate-600 text-slate-100 h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default DimensionsPanel;

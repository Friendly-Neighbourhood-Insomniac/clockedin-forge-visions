
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Grid3X3, Ruler, FileText, Maximize2 } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  const [pageFormat, setPageFormat] = useState('a4');
  const [showGrid, setShowGrid] = useState(false);
  const [showMargins, setShowMargins] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [gridSize, setGridSize] = useState('20');

  const pageFormats = {
    a4: { width: '210mm', height: '297mm', margin: '25.4mm' }, // A4 with 1 inch margins
    letter: { width: '8.5in', height: '11in', margin: '1in' },
    legal: { width: '8.5in', height: '14in', margin: '1in' },
    a3: { width: '297mm', height: '420mm', margin: '25.4mm' },
    custom: { width: '100%', height: 'auto', margin: '20px' }
  };

  const currentFormat = pageFormats[pageFormat as keyof typeof pageFormats];

  const gridStyle = showGrid ? {
    backgroundImage: `
      linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`
  } : {};

  return (
    <div className="relative">
      {/* Layout Controls */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <Label className="text-slate-300 text-sm">Page Format:</Label>
          <Select value={pageFormat} onValueChange={setPageFormat}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="a3">A3</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-cyan-400" />
          <Label className="text-slate-300 text-sm">Grid:</Label>
          <Switch checked={showGrid} onCheckedChange={setShowGrid} />
          {showGrid && (
            <Select value={gridSize} onValueChange={setGridSize}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
                <SelectItem value="40">40px</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-cyan-400" />
          <Label className="text-slate-300 text-sm">Margins:</Label>
          <Switch checked={showMargins} onCheckedChange={setShowMargins} />
        </div>

        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-cyan-400" />
          <Label className="text-slate-300 text-sm">Rulers:</Label>
          <Switch checked={showRulers} onCheckedChange={setShowRulers} />
        </div>
      </div>

      {/* Rulers */}
      {showRulers && (
        <>
          {/* Horizontal Ruler */}
          <div className="h-6 bg-slate-700 border-b border-slate-600 relative mb-2">
            <div className="absolute inset-0 flex items-center">
              {Array.from({ length: 50 }, (_, i) => (
                <div key={i} className="relative" style={{ width: '20px' }}>
                  <div className="h-2 w-px bg-slate-400 absolute bottom-0"></div>
                  {i % 5 === 0 && (
                    <div className="h-4 w-px bg-slate-300 absolute bottom-0"></div>
                  )}
                  {i % 10 === 0 && (
                    <span className="absolute -bottom-1 text-xs text-slate-400 transform -translate-x-1/2">
                      {i * 20}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Ruler */}
          <div className="w-6 bg-slate-700 border-r border-slate-600 absolute left-0 top-10 bottom-0 z-10">
            <div className="absolute inset-0 flex flex-col items-center">
              {Array.from({ length: 50 }, (_, i) => (
                <div key={i} className="relative" style={{ height: '20px' }}>
                  <div className="w-2 h-px bg-slate-400 absolute right-0"></div>
                  {i % 5 === 0 && (
                    <div className="w-4 h-px bg-slate-300 absolute right-0"></div>
                  )}
                  {i % 10 === 0 && (
                    <span className="absolute -right-1 text-xs text-slate-400 transform -translate-y-1/2 rotate-90 origin-center">
                      {i * 20}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Page Container */}
      <div className={`relative ${showRulers ? 'ml-6' : ''}`}>
        <div
          className={`mx-auto bg-white shadow-lg relative ${className}`}
          style={{
            width: pageFormat === 'custom' ? '100%' : currentFormat.width,
            minHeight: pageFormat === 'custom' ? '600px' : currentFormat.height,
            ...gridStyle
          }}
        >
          {/* Margin Indicators */}
          {showMargins && (
            <div
              className="absolute inset-0 border-2 border-dashed border-blue-300 pointer-events-none"
              style={{
                margin: currentFormat.margin
              }}
            />
          )}

          {/* Content Area */}
          <div
            className="relative h-full"
            style={{
              padding: showMargins ? currentFormat.margin : '20px'
            }}
          >
            {children}
          </div>

          {/* Corner Guides */}
          {showGrid && (
            <>
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;


import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, RefreshCw } from 'lucide-react';

interface EmbedEntityProps {
  contentState: any;
  entityKey: string;
  blockProps: any;
}

const EmbedEntity: React.FC<EmbedEntityProps> = ({ contentState, entityKey, blockProps }) => {
  const [showControls, setShowControls] = useState(false);
  const entity = contentState.getEntity(entityKey);
  const { url, title, width = 400, height = 300, x = 0, y = 0 } = entity.getData();

  const handleResize = (e: any, direction: any, ref: any, delta: any, position: any) => {
    const newWidth = parseInt(ref.style.width);
    const newHeight = parseInt(ref.style.height);
    
    blockProps.onEntityDataChange(entityKey, {
      width: newWidth,
      height: newHeight,
      x: position.x,
      y: position.y
    });
  };

  const handleDrag = (e: any, data: any) => {
    blockProps.onEntityDataChange(entityKey, {
      x: data.x,
      y: data.y
    });
  };

  const handleDelete = () => {
    blockProps.onEntityRemove(entityKey);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Rnd
        size={{ width, height }}
        position={{ x, y }}
        onDragStop={handleDrag}
        onResizeStop={handleResize}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        className="border-2 border-transparent hover:border-cyan-400 transition-colors"
      >
        <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden">
          <iframe
            src={url}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        
        {showControls && (
          <div className="absolute top-2 right-2 flex gap-1 bg-slate-800/80 rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleOpenExternal}
              className="text-slate-300 hover:text-white h-6 w-6 p-0"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-300 hover:text-white h-6 w-6 p-0"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        )}
      </Rnd>
    </div>
  );
};

export default EmbedEntity;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

interface EmbedInsertProps {
  onEmbedInsert: (embedData: { url: string; title: string; type: 'video' | 'website' }) => void;
}

const EmbedInsert: React.FC<EmbedInsertProps> = ({ onEmbedInsert }) => {
  const handleEmbedInsert = () => {
    const url = prompt('Enter video/website URL:');
    if (url) {
      const title = prompt('Enter title (optional):') || 'Embedded Content';
      const type: 'video' | 'website' = url.includes('youtube.com') || url.includes('vimeo.com') ? 'video' : 'website';
      
      onEmbedInsert({ url, title, type });
    }
  };

  return (
    <Button
      onClick={handleEmbedInsert}
      size="sm"
      variant="ghost"
      className="text-slate-300 hover:text-white hover:bg-slate-700"
    >
      <Video className="w-4 h-4" />
    </Button>
  );
};

export default EmbedInsert;

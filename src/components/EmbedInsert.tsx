
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmbedInsertProps {
  onEmbedInsert: (embedData: { url: string; title: string; type: 'video' | 'website' }) => void;
}

const EmbedInsert: React.FC<EmbedInsertProps> = ({ onEmbedInsert }) => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const detectEmbedType = (url: string): 'video' | 'website' => {
    const videoPatterns = [
      /youtube\.com\/watch/,
      /youtu\.be\//,
      /vimeo\.com/,
      /dailymotion\.com/,
      /twitch\.tv/,
      /facebook\.com.*\/videos/
    ];
    
    return videoPatterns.some(pattern => pattern.test(url)) ? 'video' : 'website';
  };

  const handleInsert = () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to embed.",
        variant: "destructive",
      });
      return;
    }

    const embedType = detectEmbedType(url);
    const embedTitle = title.trim() || (embedType === 'video' ? 'Embedded Video' : 'Embedded Website');

    onEmbedInsert({
      url: url.trim(),
      title: embedTitle,
      type: embedType
    });

    toast({
      title: "Embed Added",
      description: `${embedType === 'video' ? 'Video' : 'Website'} embed has been inserted into your chapter.`,
    });

    setUrl('');
    setTitle('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Monitor className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-cyan-400/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-100">Insert Embed</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="embed-url" className="text-slate-300">URL</Label>
            <Input
              id="embed-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label htmlFor="embed-title" className="text-slate-300">Title (Optional)</Label>
            <Input
              id="embed-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video/Website title"
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInsert} className="bg-cyan-600 hover:bg-cyan-700">
              Insert Embed
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-slate-300">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedInsert;

import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { ImagePlus, Video, Globe } from 'lucide-react';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import EmbedInsert from '@/components/EmbedInsert';

const MediaInsertion: React.FC = () => {
  const { editor } = useEditorStore();

  const insertImage = (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => {
    if (!editor) {
      console.error('No editor available');
      return;
    }

    try {
      console.log('Inserting image:', imageUrl);
      
      editor.commands.setImage({
        src: imageUrl,
        alt: metadata?.alt || 'Uploaded image'
      });
      
      console.log('Image inserted successfully');
    } catch (error) {
      console.error('Error inserting image:', error);
    }
  };

  const insertVideo = (videoData: { url: string; title: string }) => {
    if (!editor) {
      console.error('No editor available');
      return;
    }

    try {
      console.log('Inserting video:', videoData);
      
      if (videoData.url.includes('youtube.com') || videoData.url.includes('youtu.be')) {
        editor.commands.setYoutubeVideo({
          src: videoData.url,
          width: 400,
          height: 300,
        });
      } else {
        // For other videos, insert as iframe
        const iframe = `<iframe src="${videoData.url}" width="400" height="300" frameborder="0" allowfullscreen></iframe>`;
        editor.commands.insertContent(iframe);
      }
      
      console.log('Video inserted successfully');
    } catch (error) {
      console.error('Error inserting video:', error);
    }
  };

  const insertEmbed = (embedData: { url: string; title: string; type: 'video' | 'website' }) => {
    if (!editor) {
      console.error('No editor available');
      return;
    }

    try {
      console.log('Inserting embed:', embedData);
      
      if (embedData.type === 'video' && (embedData.url.includes('youtube.com') || embedData.url.includes('youtu.be'))) {
        editor.commands.setYoutubeVideo({
          src: embedData.url,
          width: 400,
          height: 300,
        });
      } else {
        // For other embeds, insert as iframe
        const iframe = `<iframe src="${embedData.url}" width="400" height="300" frameborder="0" allowfullscreen title="${embedData.title}"></iframe>`;
        editor.commands.insertContent(iframe);
      }
      
      console.log('Embed inserted successfully');
    } catch (error) {
      console.error('Error inserting embed:', error);
    }
  };

  const handleVideoInsert = () => {
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (url) {
      const title = prompt('Enter video title:') || 'Video';
      insertVideo({ url, title });
    }
  };

  return (
    <div className="flex gap-2">
      <EnhancedImageUpload onImageInsert={insertImage} />
      
      <Button
        onClick={handleVideoInsert}
        size="sm"
        variant="ghost"
        className="text-slate-300 hover:text-white hover:bg-slate-700"
        title="Insert Video"
      >
        <Video className="w-4 h-4" />
      </Button>
      
      <EmbedInsert onEmbedInsert={insertEmbed} />
    </div>
  );
};

export default MediaInsertion;

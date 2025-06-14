
import React from 'react';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { Button } from '@/components/ui/button';
import { ImagePlus, Video, Globe } from 'lucide-react';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import EmbedInsert from '@/components/EmbedInsert';

interface MediaInsertionProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const MediaInsertion: React.FC<MediaInsertionProps> = ({ editorState, setEditorState }) => {
  const insertImageEntity = (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => {
    console.log('Inserting image entity:', imageUrl);
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', {
      src: imageUrl,
      alt: metadata?.alt || 'Uploaded image',
      width: metadata?.width ? parseInt(metadata.width) : 300,
      height: metadata?.height ? parseInt(metadata.height) : 200,
      x: 0,
      y: 0
    });
    
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const finalEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    
    setEditorState(finalEditorState);
  };

  const insertVideoEntity = (videoData: { url: string; title: string }) => {
    console.log('Inserting video entity:', videoData);
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('VIDEO', 'IMMUTABLE', {
      src: videoData.url,
      title: videoData.title,
      width: 400,
      height: 300,
      x: 0,
      y: 0
    });
    
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const finalEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    
    setEditorState(finalEditorState);
  };

  const insertEmbedEntity = (embedData: { url: string; title: string; type: 'video' | 'website' }) => {
    console.log('Inserting embed entity:', embedData);
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('EMBED', 'IMMUTABLE', {
      url: embedData.url,
      title: embedData.title,
      type: embedData.type,
      width: 400,
      height: 300,
      x: 0,
      y: 0
    });
    
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const finalEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    
    setEditorState(finalEditorState);
  };

  const handleVideoInsert = () => {
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (url) {
      const title = prompt('Enter video title:') || 'Video';
      insertVideoEntity({ url, title });
    }
  };

  return (
    <div className="flex gap-2">
      <EnhancedImageUpload onImageInsert={insertImageEntity} />
      
      <Button
        onClick={handleVideoInsert}
        size="sm"
        variant="ghost"
        className="text-slate-300 hover:text-white hover:bg-slate-700"
        title="Insert Video"
      >
        <Video className="w-4 h-4" />
      </Button>
      
      <EmbedInsert onEmbedInsert={insertEmbedEntity} />
    </div>
  );
};

export default MediaInsertion;

import React, { useCallback, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { useEditorStore } from '@/stores/editorStore';
import { Card, CardContent } from '@/components/ui/card';
import ImageEntity from './entities/ImageEntity';
import VideoEntity from './entities/VideoEntity';
import EmbedEntity from './entities/EmbedEntity';
import 'draft-js/dist/Draft.css';

const { hasCommandModifier } = KeyBindingUtil;

interface DraftailEditorProps {
  placeholder?: string;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const DraftailEditor: React.FC<DraftailEditorProps> = ({
  placeholder = "Start writing...",
  readOnly = false,
  onFocus,
  onBlur
}) => {
  const editorRef = useRef<Editor>(null);
  const { editorState, setEditorState, undo, redo } = useEditorStore();

  const blockRendererFn = useCallback((block: any) => {
    if (block.getType() === 'atomic') {
      const entityKey = block.getEntityAt(0);
      if (!entityKey) {
        return null;
      }
      
      try {
        const entity = editorState.getCurrentContent().getEntity(entityKey);
        if (!entity) {
          return null;
        }
        
        const entityType = entity.getType();
        
        if (entityType === 'IMAGE') {
          return {
            component: ImageEntity,
            editable: false,
            props: {
              onEntityDataChange: handleEntityDataChange,
              onEntityRemove: handleEntityRemove,
            },
          };
        }
        
        if (entityType === 'VIDEO') {
          return {
            component: VideoEntity,
            editable: false,
            props: {
              onEntityDataChange: handleEntityDataChange,
              onEntityRemove: handleEntityRemove,
            },
          };
        }
        
        if (entityType === 'EMBED') {
          return {
            component: EmbedEntity,
            editable: false,
            props: {
              onEntityDataChange: handleEntityDataChange,
              onEntityRemove: handleEntityRemove,
            },
          };
        }
      } catch (error) {
        console.error('Error rendering entity:', error);
        return null;
      }
    }
    
    return null;
  }, [editorState]);

  const handleEntityDataChange = useCallback((entityKey: string, newData: any) => {
    try {
      const currentContent = editorState.getCurrentContent();
      const entity = currentContent.getEntity(entityKey);
      if (!entity) {
        console.warn('Entity not found:', entityKey);
        return;
      }
      
      const mergedData = { ...entity.getData(), ...newData };
      
      const newContentState = currentContent.mergeEntityData(entityKey, mergedData);
      const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
      setEditorState(newEditorState);
    } catch (error) {
      console.error('Error updating entity data:', error);
    }
  }, [editorState, setEditorState]);

  const handleEntityRemove = useCallback((entityKey: string) => {
    try {
      // Find and remove the block containing this entity
      const currentContent = editorState.getCurrentContent();
      const blockMap = currentContent.getBlockMap();
      
      const filteredBlocks = blockMap.filter(block => {
        if (block && block.getType() === 'atomic') {
          const blockEntityKey = block.getEntityAt(0);
          return blockEntityKey !== entityKey;
        }
        return true;
      });
      
      const newContentState = currentContent.merge({
        blockMap: filteredBlocks,
      });
      
      const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
      setEditorState(newEditorState);
    } catch (error) {
      console.error('Error removing entity:', error);
    }
  }, [editorState, setEditorState]);

  const handleKeyCommand = useCallback((command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }, [setEditorState]);

  const mapKeyToEditorCommand = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return null;
    }

    // Custom key bindings
    if (hasCommandModifier(e)) {
      switch (e.keyCode) {
        case 90: // Z
          if (e.shiftKey) {
            redo();
            return 'redo';
          } else {
            undo();
            return 'undo';
          }
        case 66: // B
          return 'bold';
        case 73: // I
          return 'italic';
        case 85: // U
          return 'underline';
      }
    }

    return getDefaultKeyBinding(e);
  }, [editorState, setEditorState, undo, redo]);

  const handlePastedText = useCallback((text: string, html?: string) => {
    // Handle pasted content
    return 'not-handled';
  }, []);

  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  useEffect(() => {
    focusEditor();
  }, [focusEditor]);

  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardContent className="p-6">
        <div 
          className="min-h-[500px] p-4 bg-white rounded-lg text-slate-800 cursor-text relative"
          onClick={focusEditor}
        >
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            handlePastedText={handlePastedText}
            blockRendererFn={blockRendererFn}
            placeholder={placeholder}
            readOnly={readOnly}
            onFocus={onFocus}
            onBlur={onBlur}
            spellCheck={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftailEditor;

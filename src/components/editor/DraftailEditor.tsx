
import React, { useCallback, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { useEditorStore } from '@/stores/editorStore';
import { Card, CardContent } from '@/components/ui/card';
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
          className="min-h-[500px] p-4 bg-white rounded-lg text-slate-800 cursor-text"
          onClick={focusEditor}
        >
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            handlePastedText={handlePastedText}
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

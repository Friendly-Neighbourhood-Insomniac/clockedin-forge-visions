
import { create } from 'zustand';
import { Editor } from '@tiptap/react';

interface EditorStoreState {
  editor: Editor | null;
  content: string;
  isReadOnly: boolean;
  
  // Actions
  setEditor: (editor: Editor | null) => void;
  setContent: (content: string) => void;
  setReadOnly: (readOnly: boolean) => void;
  undo: () => void;
  redo: () => void;
  clearContent: () => void;
  loadContent: (content: string) => void;
  getContentAsHTML: () => string;
  getContentAsJSON: () => any;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  editor: null,
  content: '',
  isReadOnly: false,

  setEditor: (editor) => {
    set({ editor });
  },

  setContent: (content) => {
    const { editor } = get();
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    set({ content });
  },

  setReadOnly: (readOnly) => {
    const { editor } = get();
    if (editor) {
      editor.setEditable(!readOnly);
    }
    set({ isReadOnly: readOnly });
  },

  undo: () => {
    const { editor } = get();
    if (editor) {
      editor.commands.undo();
    }
  },

  redo: () => {
    const { editor } = get();
    if (editor) {
      editor.commands.redo();
    }
  },

  clearContent: () => {
    const { editor } = get();
    if (editor) {
      editor.commands.clearContent();
    }
    set({ content: '' });
  },

  loadContent: (content) => {
    const { editor } = get();
    if (editor) {
      editor.commands.setContent(content);
    }
    set({ content });
  },

  getContentAsHTML: () => {
    const { editor } = get();
    return editor ? editor.getHTML() : '';
  },

  getContentAsJSON: () => {
    const { editor } = get();
    return editor ? editor.getJSON() : null;
  }
}));

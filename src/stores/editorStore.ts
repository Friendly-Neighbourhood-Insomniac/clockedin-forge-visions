
import { create } from 'zustand';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';

interface EditorStoreState {
  editorState: EditorState;
  isReadOnly: boolean;
  selectionState: any;
  undoStack: any[];
  redoStack: any[];
  
  // Actions
  setEditorState: (editorState: EditorState) => void;
  setReadOnly: (readOnly: boolean) => void;
  undo: () => void;
  redo: () => void;
  clearContent: () => void;
  loadContent: (content: any) => void;
  getContentAsRaw: () => any;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  editorState: EditorState.createEmpty(),
  isReadOnly: false,
  selectionState: null,
  undoStack: [],
  redoStack: [],

  setEditorState: (editorState) => {
    set({ editorState });
  },

  setReadOnly: (readOnly) => {
    set({ isReadOnly: readOnly });
  },

  undo: () => {
    const { editorState } = get();
    const newEditorState = EditorState.undo(editorState);
    set({ editorState: newEditorState });
  },

  redo: () => {
    const { editorState } = get();
    const newEditorState = EditorState.redo(editorState);
    set({ editorState: newEditorState });
  },

  clearContent: () => {
    set({ editorState: EditorState.createEmpty() });
  },

  loadContent: (content) => {
    try {
      const contentState = convertFromRaw(content);
      const editorState = EditorState.createWithContent(contentState);
      set({ editorState });
    } catch (error) {
      console.error('Error loading content:', error);
      set({ editorState: EditorState.createEmpty() });
    }
  },

  getContentAsRaw: () => {
    const { editorState } = get();
    return convertToRaw(editorState.getCurrentContent());
  }
}));

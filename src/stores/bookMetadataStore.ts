
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookMetadata {
  title: string;
  author: string;
  description: string;
  genre: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  language: string;
  keywords: string;
  coverImage?: string;
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  theme: 'light' | 'dark' | 'sepia';
}

interface BookMetadataStoreState {
  metadata: BookMetadata;
  isDirty: boolean;
  
  // Actions
  updateMetadata: (field: keyof BookMetadata, value: any) => void;
  setMetadata: (metadata: Partial<BookMetadata>) => void;
  resetMetadata: () => void;
  markClean: () => void;
}

const defaultMetadata: BookMetadata = {
  title: '',
  author: '',
  description: '',
  genre: '',
  isbn: '',
  publisher: '',
  publishDate: '',
  language: 'en',
  keywords: '',
  pageSize: 'A4',
  margins: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1
  },
  theme: 'light'
};

export const useBookMetadataStore = create<BookMetadataStoreState>()(
  persist(
    (set, get) => ({
      metadata: defaultMetadata,
      isDirty: false,

      updateMetadata: (field, value) => {
        set((state) => ({
          metadata: { ...state.metadata, [field]: value },
          isDirty: true
        }));
      },

      setMetadata: (metadata) => {
        set((state) => ({
          metadata: { ...state.metadata, ...metadata },
          isDirty: true
        }));
      },

      resetMetadata: () => {
        set({ metadata: defaultMetadata, isDirty: false });
      },

      markClean: () => {
        set({ isDirty: false });
      }
    }),
    {
      name: 'book-metadata-storage'
    }
  )
);

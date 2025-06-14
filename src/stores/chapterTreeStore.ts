
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Chapter {
  id: string;
  title: string;
  content: any; // Draft.js raw content
  order: number;
  parentId?: string;
  isCollapsed?: boolean;
  wordCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ChapterTreeStoreState {
  chapters: Chapter[];
  selectedChapterId: string | null;
  expandedChapterIds: Set<string>;
  
  // Actions
  addChapter: (title?: string, parentId?: string) => string;
  deleteChapter: (chapterId: string) => void;
  updateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  moveChapter: (chapterId: string, newOrder: number, newParentId?: string) => void;
  selectChapter: (chapterId: string | null) => void;
  toggleChapterExpanded: (chapterId: string) => void;
  reorderChapters: (chapterIds: string[]) => void;
  getChapterById: (chapterId: string) => Chapter | undefined;
  getChildChapters: (parentId?: string) => Chapter[];
  getChapterTree: () => Chapter[];
}

export const useChapterTreeStore = create<ChapterTreeStoreState>()(
  persist(
    (set, get) => ({
      chapters: [],
      selectedChapterId: null,
      expandedChapterIds: new Set(),

      addChapter: (title = 'New Chapter', parentId) => {
        const newId = Date.now().toString();
        const { chapters } = get();
        const maxOrder = Math.max(...chapters.map(c => c.order), 0);
        
        const newChapter: Chapter = {
          id: newId,
          title,
          content: null,
          order: maxOrder + 1,
          parentId,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          chapters: [...state.chapters, newChapter],
          selectedChapterId: newId
        }));

        return newId;
      },

      deleteChapter: (chapterId) => {
        set((state) => ({
          chapters: state.chapters.filter(c => c.id !== chapterId && c.parentId !== chapterId),
          selectedChapterId: state.selectedChapterId === chapterId ? null : state.selectedChapterId
        }));
      },

      updateChapter: (chapterId, updates) => {
        set((state) => ({
          chapters: state.chapters.map(chapter =>
            chapter.id === chapterId
              ? { ...chapter, ...updates, updatedAt: new Date() }
              : chapter
          )
        }));
      },

      moveChapter: (chapterId, newOrder, newParentId) => {
        set((state) => ({
          chapters: state.chapters.map(chapter =>
            chapter.id === chapterId
              ? { ...chapter, order: newOrder, parentId: newParentId, updatedAt: new Date() }
              : chapter
          )
        }));
      },

      selectChapter: (chapterId) => {
        set({ selectedChapterId: chapterId });
      },

      toggleChapterExpanded: (chapterId) => {
        set((state) => {
          const newExpanded = new Set(state.expandedChapterIds);
          if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
          } else {
            newExpanded.add(chapterId);
          }
          return { expandedChapterIds: newExpanded };
        });
      },

      reorderChapters: (chapterIds) => {
        set((state) => ({
          chapters: state.chapters.map(chapter => {
            const newOrder = chapterIds.indexOf(chapter.id);
            return newOrder >= 0 ? { ...chapter, order: newOrder } : chapter;
          })
        }));
      },

      getChapterById: (chapterId) => {
        return get().chapters.find(c => c.id === chapterId);
      },

      getChildChapters: (parentId) => {
        return get().chapters
          .filter(c => c.parentId === parentId)
          .sort((a, b) => a.order - b.order);
      },

      getChapterTree: () => {
        return get().chapters.sort((a, b) => a.order - b.order);
      }
    }),
    {
      name: 'chapter-tree-storage'
    }
  )
);

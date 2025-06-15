
import React, { useEffect, useState } from 'react';
import { useChapterTreeStore } from '@/stores/chapterTreeStore';
import { useBookMetadataStore } from '@/stores/bookMetadataStore';
import { useEditorStore } from '@/stores/editorStore';
import { exportToPDF, exportToEPUB, exportToHTML, downloadFile } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import BookMetadataHeader from '@/components/editor/BookMetadataHeader';
import ChapterSidebar from '@/components/editor/ChapterSidebar';
import ExportControls from '@/components/editor/ExportControls';
import EditorContent from '@/components/editor/EditorContent';

const Editor: React.FC = () => {
  const {
    chapters,
    selectedChapterId,
    selectChapter,
    addChapter,
    deleteChapter,
    updateChapter,
    getChapterById
  } = useChapterTreeStore();

  const { metadata, updateMetadata } = useBookMetadataStore();
  const { loadContent, getContentAsHTML } = useEditorStore();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const selectedChapter = selectedChapterId ? getChapterById(selectedChapterId) : null;

  const bookData = {
    title: metadata.title || 'Untitled Book',
    author: metadata.author || 'Unknown Author',
    description: metadata.description || 'No description available',
    chapters: chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      content: chapter.content || ''
    }))
  };

  // Load chapter content when selection changes
  useEffect(() => {
    if (selectedChapter?.content) {
      loadContent(selectedChapter.content);
    }
  }, [selectedChapterId, selectedChapter?.content, loadContent]);

  // Save content when editor state changes
  const handleContentSave = () => {
    if (selectedChapterId) {
      const content = getContentAsHTML();
      updateChapter(selectedChapterId, { content });
    }
  };

  const handleChapterTitleChange = (title: string) => {
    if (selectedChapterId) {
      updateChapter(selectedChapterId, { title });
    }
  };

  const handleAddChapter = () => {
    const newChapterId = addChapter();
    selectChapter(newChapterId);
  };

  const handleExport = async (format: 'pdf' | 'epub' | 'html') => {
    if (bookData.chapters.length === 0) {
      toast({
        title: "No content to export",
        description: "Please add some chapters before exporting.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(format);

    try {
      switch (format) {
        case 'pdf':
          const pdfBlob = await exportToPDF(bookData);
          downloadFile(pdfBlob, `${bookData.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
          toast({
            title: "PDF Export Complete",
            description: "Your book has been exported as a PDF file."
          });
          break;

        case 'epub':
          const epubBlob = await exportToEPUB(bookData);
          downloadFile(epubBlob, `${bookData.title.replace(/[^a-z0-9]/gi, '_')}.epub`);
          toast({
            title: "EPUB Export Complete",
            description: "Your book has been exported as an EPUB file."
          });
          break;

        case 'html':
          const htmlBlob = await exportToHTML(bookData);
          downloadFile(htmlBlob, `${bookData.title.replace(/[^a-z0-9]/gi, '_')}.html`);
          toast({
            title: "HTML Export Complete",
            description: "Your book has been exported as an HTML file."
          });
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your book. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.05),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <BookMetadataHeader
              title={metadata.title}
              author={metadata.author}
              onTitleChange={(title) => updateMetadata('title', title)}
              onAuthorChange={(author) => updateMetadata('author', author)}
            />
            <ExportControls
              isExporting={isExporting}
              onExport={handleExport}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter Sidebar */}
          <div className="lg:col-span-1">
            <ChapterSidebar
              chapters={chapters}
              selectedChapterId={selectedChapterId}
              onSelectChapter={selectChapter}
              onAddChapter={handleAddChapter}
              onDeleteChapter={deleteChapter}
            />
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3">
            <EditorContent
              selectedChapter={selectedChapter}
              onChapterTitleChange={handleChapterTitleChange}
              onContentSave={handleContentSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;

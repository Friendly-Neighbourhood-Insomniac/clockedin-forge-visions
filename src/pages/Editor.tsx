import React, { useEffect, useState } from 'react';
import { useChapterTreeStore } from '@/stores/chapterTreeStore';
import { useBookMetadataStore } from '@/stores/bookMetadataStore';
import { useEditorStore } from '@/stores/editorStore';
import TiptapEditor from '@/components/editor/TiptapEditor';
import EnhancedToolbar from '@/components/editor/EnhancedToolbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Eye, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportToPDF, exportToEPUB, exportToHTML, downloadFile } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

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
            <div className="flex-1">
              <Input
                value={metadata.title}
                onChange={(e) => updateMetadata('title', e.target.value)}
                placeholder="Book Title"
                className="text-2xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0 mb-2"
              />
              <Input
                value={metadata.author}
                onChange={(e) => updateMetadata('author', e.target.value)}
                placeholder="Author Name"
                className="text-lg bg-transparent border-none text-slate-300 placeholder-slate-500 p-0 h-auto focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link to="/preview">
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
              
              {/* Export Buttons */}
              <Button
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={isExporting !== null}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                PDF
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleExport('epub')}
                disabled={isExporting !== null}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isExporting === 'epub' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                EPUB
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleExport('html')}
                disabled={isExporting !== null}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isExporting === 'html' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                HTML
              </Button>

              <Link to="/export">
                <Button size="sm" variant="outline" className="border-cyan-400/30 text-slate-300 hover:text-white hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  More Options
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-cyan-400/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-cyan-100">Chapters</h3>
                <Button
                  size="sm"
                  onClick={handleAddChapter}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {chapters.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No chapters yet</p>
                    <p className="text-sm">Click + to add your first chapter</p>
                  </div>
                ) : (
                  chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChapterId === chapter.id
                          ? 'bg-cyan-600/20 border border-cyan-400/50'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                      onClick={() => selectChapter(chapter.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 truncate">{chapter.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this chapter?')) {
                              deleteChapter(chapter.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      {chapter.wordCount && (
                        <div className="text-xs text-slate-400 mt-1">
                          {chapter.wordCount} words
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3">
            {selectedChapter ? (
              <div className="space-y-4">
                {/* Chapter Title */}
                <Card className="bg-slate-800/50 border-cyan-400/30">
                  <CardContent className="p-4">
                    <Input
                      value={selectedChapter.title}
                      onChange={(e) => handleChapterTitleChange(e.target.value)}
                      placeholder="Chapter Title"
                      className="text-xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0"
                    />
                  </CardContent>
                </Card>

                {/* Enhanced Editor Toolbar */}
                <EnhancedToolbar />

                {/* Tiptap Editor */}
                <TiptapEditor
                  placeholder="Start writing your chapter..."
                  onBlur={handleContentSave}
                />
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-cyan-400/30">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center text-slate-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Select a chapter to start editing</p>
                    <p className="text-sm">Choose from the sidebar or create a new chapter</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;

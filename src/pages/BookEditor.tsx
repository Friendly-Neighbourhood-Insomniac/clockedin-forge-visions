import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Download, Eye, Book, FileText, Calendar, User, Tag, Languages, Building, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChapterManager from '@/components/ChapterManager';
import BookEditorHeader from '@/components/BookEditorHeader';
import { useToast } from '@/hooks/use-toast';
import { exportToPDF, exportToEPUB, downloadFile } from '@/utils/exportUtils';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

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
}

const BookEditor: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', title: 'Chapter 1', content: 'This is the first chapter.' },
    { id: '2', title: 'Chapter 2', content: 'This is the second chapter.' },
  ]);
  const [selectedChapter, setSelectedChapter] = useState<string>('1');
  const [bookMetadata, setBookMetadata] = useState<BookMetadata>({
    title: 'My Awesome Book',
    author: 'John Doe',
    description: 'A thrilling tale of adventure.',
    genre: 'Fiction',
    isbn: '123-456-789',
    publisher: 'Awesome Books Inc.',
    publishDate: '2023-01-01',
    language: 'en',
    keywords: 'adventure, thriller',
  });
  const [isGeneratingEPUB, setIsGeneratingEPUB] = useState<boolean>(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [isFlipbookPreviewOpen, setIsFlipbookPreviewOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleChapterSelect = useCallback((chapterId: string) => {
    setSelectedChapter(chapterId);
  }, []);

  const handleAddChapter = useCallback(() => {
    const newChapterId = Math.random().toString(36).substring(7);
    const newChapter: Chapter = {
      id: newChapterId,
      title: 'New Chapter',
      content: '',
    };
    setChapters([...chapters, newChapter]);
    setSelectedChapter(newChapterId);
  }, [chapters]);

  const handleDeleteChapter = useCallback((chapterId: string) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    if (selectedChapter === chapterId) {
      setSelectedChapter(chapters[0]?.id || '');
    }
  }, [chapters, selectedChapter]);

  const handleUpdateChapter = useCallback((chapterId: string, updatedContent: string) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, content: updatedContent } : chapter
      )
    );
  }, [chapters]);

  const handleMetadataChange = useCallback((field: keyof BookMetadata, value: string) => {
    setBookMetadata({ ...bookMetadata, [field]: value });
  }, [bookMetadata]);

  const handleGenerateEPUB = useCallback(async () => {
    setIsGeneratingEPUB(true);
    try {
      // Simulate EPUB generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: 'EPUB Generated',
        description: 'Your EPUB file has been generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate EPUB file.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingEPUB(false);
    }
  }, [toast]);

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloadingPDF(true);
    try {
      const bookData = {
        title: bookMetadata.title || 'Untitled Book',
        author: bookMetadata.author || 'Unknown Author',
        description: bookMetadata.description || 'No description available',
        chapters: chapters.map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          content: chapter.content || ''
        }))
      };
      const pdfBlob = await exportToPDF(bookData);
      downloadFile(pdfBlob, `${bookData.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      toast({
        title: "PDF Export Complete",
        description: "Your book has been exported as a PDF file."
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF file.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingPDF(false);
    }
  }, [bookMetadata, chapters, toast]);

  const handleOpenFlipbookPreview = useCallback(() => {
    setIsFlipbookPreviewOpen(true);
    // Logic to open flipbook preview
  }, []);

  const handleCloseFlipbookPreview = useCallback(() => {
    setIsFlipbookPreviewOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.05),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Book Editor Header */}
        <BookEditorHeader
          onGenerateEPUB={handleGenerateEPUB}
          onDownloadPDF={handleDownloadPDF}
          onOpenFlipbookPreview={handleOpenFlipbookPreview}
        />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter Manager */}
          <div className="lg:col-span-1">
            <ChapterManager
              chapters={chapters}
              selectedChapter={selectedChapter}
              onChapterSelect={handleChapterSelect}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
            />
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-slate-800/50 border-cyan-400/30">
                <CardHeader>
                  <CardTitle className="text-cyan-100">
                    {chapters.find((chapter) => chapter.id === selectedChapter)?.title || 'Select a Chapter'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your chapter content here..."
                    className="bg-transparent border-none text-slate-300 focus:ring-0 focus:outline-none h-96 resize-none"
                    value={chapters.find((chapter) => chapter.id === selectedChapter)?.content || ''}
                    onChange={(e) => handleUpdateChapter(selectedChapter, e.target.value)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Book Metadata */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/50 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-100">Book Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 flex items-center">
                  <Book className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="title" className="text-slate-300">Title</label>
                </div>
                <Input
                  type="text"
                  id="title"
                  placeholder="Title"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="author" className="text-slate-300">Author</label>
                </div>
                <Input
                  type="text"
                  id="author"
                  placeholder="Author"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.author}
                  onChange={(e) => handleMetadataChange('author', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="description" className="text-slate-300">Description</label>
                </div>
                <Textarea
                  id="description"
                  placeholder="Description"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500 resize-none"
                  value={bookMetadata.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="genre" className="text-slate-300">Genre</label>
                </div>
                <Input
                  type="text"
                  id="genre"
                  placeholder="Genre"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.genre}
                  onChange={(e) => handleMetadataChange('genre', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="isbn" className="text-slate-300">ISBN</label>
                </div>
                <Input
                  type="text"
                  id="isbn"
                  placeholder="ISBN"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.isbn}
                  onChange={(e) => handleMetadataChange('isbn', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="publisher" className="text-slate-300">Publisher</label>
                </div>
                <Input
                  type="text"
                  id="publisher"
                  placeholder="Publisher"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.publisher}
                  onChange={(e) => handleMetadataChange('publisher', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="publishDate" className="text-slate-300">Publish Date</label>
                </div>
                <Input
                  type="date"
                  id="publishDate"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.publishDate}
                  onChange={(e) => handleMetadataChange('publishDate', e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center">
                  <Languages className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="language" className="text-slate-300">Language</label>
                </div>
                <Input
                  type="text"
                  id="language"
                  placeholder="Language"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.language}
                  onChange={(e) => handleMetadataChange('language', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <div className="mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-cyan-500" />
                  <label htmlFor="keywords" className="text-slate-300">Keywords</label>
                </div>
                <Input
                  type="text"
                  id="keywords"
                  placeholder="Keywords"
                  className="bg-slate-700 border-cyan-400/50 text-slate-300 focus-visible:ring-cyan-500"
                  value={bookMetadata.keywords}
                  onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BookEditor;

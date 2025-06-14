import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import FlipbookPreview from '@/components/FlipbookPreview';
import BookMetadata from '@/components/BookMetadata';
import BookStats from '@/components/BookStats';
import MediaEditor from '@/components/MediaEditor';
import ChapterManager from '@/components/ChapterManager';
import TextEditor from '@/components/TextEditor';
import BookEditorHeader from '@/components/BookEditorHeader';
import { convertEmbedsToQRCodes } from '@/utils/qrCodeGenerator';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface BookData {
  title: string;
  author: string;
  description: string;
  chapters: Chapter[];
  metadata: {
    genre: string;
    isbn: string;
    publisher: string;
    publishDate: string;
    language: string;
    keywords: string;
  };
}

const BookEditor = () => {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [isFlipbookOpen, setIsFlipbookOpen] = useState(false);
  const [mediaEditor, setMediaEditor] = useState<{ element: HTMLElement; position: { x: number; y: number } } | null>(null);
  const [bookData, setBookData] = useState<BookData>({
    title: '',
    author: '',
    description: '',
    chapters: [],
    metadata: {
      genre: '',
      isbn: '',
      publisher: '',
      publishDate: '',
      language: 'en',
      keywords: ''
    }
  });

  const currentChapter = bookData.chapters.find(ch => ch.id === selectedChapter);

  const syncEditorContent = () => {
    if (editorRef.current && selectedChapter) {
      const content = editorRef.current.innerHTML;
      updateChapter(selectedChapter, 'content', content);
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('bookforge-book-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBookData(parsed);
        if (parsed.chapters.length > 0) {
          setSelectedChapter(parsed.chapters[0].id);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('bookforge-book-data', JSON.stringify(bookData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [bookData]);

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: `Chapter ${bookData.chapters.length + 1}`,
      content: ''
    };
    setBookData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
    setSelectedChapter(newChapter.id);
  };

  const deleteChapter = (chapterId: string) => {
    setBookData(prev => ({
      ...prev,
      chapters: prev.chapters.filter(ch => ch.id !== chapterId)
    }));
    if (selectedChapter === chapterId) {
      setSelectedChapter(bookData.chapters[0]?.id || '');
    }
  };

  const updateChapter = (chapterId: string, field: 'title' | 'content', value: string) => {
    setBookData(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => 
        ch.id === chapterId ? { ...ch, [field]: value } : ch
      )
    }));
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    syncEditorContent();
  };

  const handleFontChange = (font: string) => {
    formatText('fontName', font);
  };

  const handleFontSizeChange = (size: string) => {
    formatText('fontSize', size);
  };

  const handleColorChange = (color: string) => {
    formatText('foreColor', color);
  };

  const handleMediaUpdate = (element: HTMLElement) => {
    syncEditorContent();
  };

  const handleMetadataChange = (field: string, value: string) => {
    if (field === 'title' || field === 'author' || field === 'description') {
      setBookData(prev => ({ ...prev, [field]: value }));
    } else {
      setBookData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [field]: value }
      }));
    }
  };

  const generateEPUB = () => {
    const epubContent = {
      metadata: {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        ...bookData.metadata
      },
      chapters: bookData.chapters
    };

    const blob = new Blob([JSON.stringify(epubContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookData.title || 'My Book'}.epub.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "EPUB Generated",
      description: "Your book has been exported in EPUB format.",
    });
  };

  const downloadPDF = async () => {
    const chaptersWithQRCodes = await Promise.all(
      bookData.chapters.map(async (chapter) => ({
        ...chapter,
        content: await convertEmbedsToQRCodes(chapter.content)
      }))
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${bookData.title}</title>
          <style>
            body { 
              font-family: 'Georgia', serif; 
              line-height: 1.6; 
              margin: 40px; 
              color: #333;
            }
            .cover { 
              text-align: center; 
              page-break-after: always; 
              padding: 100px 0;
            }
            .chapter { 
              page-break-before: always; 
              margin-bottom: 50px;
            }
            h1 { 
              color: #2563eb; 
              font-size: 2.5em; 
              margin-bottom: 0.5em; 
              font-weight: bold;
            }
            h2 { 
              color: #1e40af; 
              font-size: 2em; 
              margin-top: 2em; 
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .author { 
              font-size: 1.2em; 
              color: #666; 
              margin-top: 1em; 
            }
            .description { 
              margin: 2em 0; 
              font-style: italic; 
              max-width: 600px;
              margin-left: auto;
              margin-right: auto;
            }
            .metadata {
              margin-top: 50px;
              font-size: 0.9em;
              color: #888;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 20px auto;
            }
            .qr-code-container {
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <div class="cover">
            <h1>${bookData.title}</h1>
            <div class="author">by ${bookData.author}</div>
            <div class="description">${bookData.description}</div>
            <div class="metadata">
              ${bookData.metadata.genre ? `<p>Genre: ${bookData.metadata.genre}</p>` : ''}
              ${bookData.metadata.isbn ? `<p>ISBN: ${bookData.metadata.isbn}</p>` : ''}
              ${bookData.metadata.publisher ? `<p>Publisher: ${bookData.metadata.publisher}</p>` : ''}
            </div>
          </div>
          ${chaptersWithQRCodes.map(chapter => `
            <div class="chapter">
              <h2>${chapter.title}</h2>
              <div>${chapter.content}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookData.title || 'My Book'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Book Downloaded",
      description: "Your book has been downloaded with embeds converted to QR codes for mobile access.",
    });
  };

  const openFlipbookPreview = () => {
    setIsFlipbookOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.05),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <BookEditorHeader
          onGenerateEPUB={generateEPUB}
          onDownloadPDF={downloadPDF}
          onOpenFlipbookPreview={openFlipbookPreview}
        />

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-cyan-400/30">
            <TabsTrigger value="editor" className="data-[state=active]:bg-cyan-600/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="metadata" className="data-[state=active]:bg-cyan-600/20">
              <Settings className="w-4 h-4 mr-2" />
              Book Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <ChapterManager
                  chapters={bookData.chapters}
                  selectedChapter={selectedChapter}
                  onChapterSelect={setSelectedChapter}
                  onAddChapter={addChapter}
                  onDeleteChapter={deleteChapter}
                />

                <BookStats chapters={bookData.chapters} />
              </div>

              <div className="lg:col-span-3 relative">
                <TextEditor
                  currentChapter={currentChapter}
                  selectedChapter={selectedChapter}
                  onUpdateChapter={updateChapter}
                  onImageInsert={() => {}} // Handled internally by TextEditor
                  onEmbedInsert={() => {}} // Handled internally by TextEditor
                  onFormatText={formatText}
                  onFontChange={handleFontChange}
                  onFontSizeChange={handleFontSizeChange}
                  onColorChange={handleColorChange}
                  onSetupMediaListeners={() => {}} // No longer needed
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata">
            <BookMetadata 
              metadata={{
                title: bookData.title,
                author: bookData.author,
                description: bookData.description,
                ...bookData.metadata
              }}
              onMetadataChange={handleMetadataChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      {mediaEditor && (
        <MediaEditor
          element={mediaEditor.element}
          position={mediaEditor.position}
          onClose={() => setMediaEditor(null)}
          onUpdate={handleMediaUpdate}
        />
      )}

      <FlipbookPreview
        isOpen={isFlipbookOpen}
        onClose={() => setIsFlipbookOpen(false)}
        bookData={bookData}
      />
    </div>
  );
};

export default BookEditor;

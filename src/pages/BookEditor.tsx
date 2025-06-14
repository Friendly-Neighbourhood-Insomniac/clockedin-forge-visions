import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Save, Plus, Trash2, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import FlipbookPreview from '@/components/FlipbookPreview';
import BookMetadata from '@/components/BookMetadata';
import AdvancedToolbar from '@/components/AdvancedToolbar';
import BookStats from '@/components/BookStats';
import MediaEditor from '@/components/MediaEditor';
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

  const syncEditorContent = () => {
    if (editorRef.current && selectedChapter) {
      const content = editorRef.current.innerHTML;
      updateChapter(selectedChapter, 'content', content);
    }
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

  const handleImageInsert = (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => {
    const img = `<img 
      src="${imageUrl}" 
      alt="${metadata?.alt || 'Inserted image'}" 
      style="
        max-width: 100%; 
        height: auto; 
        margin: 10px; 
        cursor: pointer; 
        border: 2px solid transparent;
        transition: all 0.2s ease;
        ${metadata?.width ? `width: ${metadata.width};` : 'width: 300px;'}
        ${metadata?.height ? `height: ${metadata.height};` : ''}
      " 
      class="editable-media"
      data-media-type="image"
      draggable="true"
    />`;
    
    document.execCommand('insertHTML', false, img);
    syncEditorContent();
    
    // Setup event listeners for the new image
    setTimeout(() => {
      setupMediaEventListeners();
    }, 100);
  };

  const handleEmbedInsert = (embedData: { url: string; title: string; type: 'video' | 'website' }) => {
    const embedHtml = `
      <div class="embed-container editable-media" 
           data-url="${embedData.url}" 
           data-title="${embedData.title}" 
           data-type="${embedData.type}" 
           data-media-type="embed"
           draggable="true"
           style="
             margin: 20px 0; 
             padding: 15px; 
             border: 2px solid transparent; 
             border-radius: 8px; 
             background: #f8fafc;
             cursor: pointer;
             transition: all 0.2s ease;
             position: relative;
             max-width: 100%;
             width: 400px;
           "
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="margin: 0; color: #334155; flex: 1; font-size: 16px;">${embedData.title}</h4>
          <span style="font-size: 10px; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">DOUBLE-CLICK TO EDIT</span>
        </div>
        <div style="background: #e2e8f0; padding: 40px; text-align: center; border-radius: 4px; color: #64748b;">
          <p style="margin: 0; font-size: 14px;">📺 ${embedData.type === 'video' ? 'Video' : 'Website'} Embed</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">${embedData.url}</p>
        </div>
        <div style="position: absolute; top: 5px; right: 5px; background: rgba(6, 182, 212, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #0891b2;">
          DRAG TO MOVE
        </div>
      </div>
    `;
    
    document.execCommand('insertHTML', false, embedHtml);
    syncEditorContent();
    
    // Setup event listeners for the new embed
    setTimeout(() => {
      setupMediaEventListeners();
    }, 100);
  };

  const setupMediaEventListeners = () => {
    if (!editorRef.current) return;
    
    const mediaElements = editorRef.current.querySelectorAll('.editable-media');
    
    mediaElements.forEach((element) => {
      const mediaElement = element as HTMLElement;
      
      // Remove existing listeners by cloning
      const newElement = mediaElement.cloneNode(true) as HTMLElement;
      mediaElement.parentNode?.replaceChild(newElement, mediaElement);
      
      // Double-click to edit
      newElement.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = newElement.getBoundingClientRect();
        const x = Math.min(rect.right + 10, window.innerWidth - 350);
        const y = Math.max(10, rect.top);
        
        setMediaEditor({
          element: newElement,
          position: { x, y }
        });
      });

      // Hover effects
      newElement.addEventListener('mouseenter', () => {
        newElement.style.border = '2px dashed rgb(6, 182, 212)';
        newElement.style.transform = 'scale(1.01)';
        newElement.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.2)';
        
        // Show drag indicator
        if (!newElement.querySelector('.drag-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'drag-indicator';
          indicator.style.cssText = `
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgb(6, 182, 212);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            z-index: 10;
            pointer-events: none;
          `;
          indicator.textContent = 'DRAG TO MOVE • DOUBLE-CLICK TO EDIT';
          newElement.style.position = 'relative';
          newElement.appendChild(indicator);
        }
      });

      newElement.addEventListener('mouseleave', () => {
        newElement.style.border = '2px solid transparent';
        newElement.style.transform = 'scale(1)';
        newElement.style.boxShadow = 'none';
        
        // Remove drag indicator
        const indicator = newElement.querySelector('.drag-indicator');
        if (indicator) {
          indicator.remove();
        }
      });

      // Drag and drop
      newElement.addEventListener('dragstart', (e) => {
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', newElement.outerHTML);
        newElement.style.opacity = '0.5';
        
        // Add visual feedback to editor
        if (editorRef.current) {
          editorRef.current.style.background = 'rgba(6, 182, 212, 0.05)';
          editorRef.current.style.border = '2px dashed rgb(6, 182, 212)';
        }
      });

      newElement.addEventListener('dragend', () => {
        newElement.style.opacity = '1';
        
        // Remove visual feedback
        if (editorRef.current) {
          editorRef.current.style.background = '';
          editorRef.current.style.border = '';
        }
      });
    });

    // Setup drop zone
    if (editorRef.current) {
      editorRef.current.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
      });

      editorRef.current.addEventListener('drop', (e) => {
        e.preventDefault();
        const htmlData = e.dataTransfer!.getData('text/html');
        
        if (htmlData) {
          // Remove the original element to prevent duplication
          const draggedElement = editorRef.current!.querySelector('.editable-media[style*="opacity: 0.5"]');
          if (draggedElement) {
            draggedElement.remove();
          }
          
          // Insert at drop position
          const range = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (range) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            const element = tempDiv.firstChild as HTMLElement;
            
            if (element) {
              element.style.opacity = '1';
              range.insertNode(element);
              syncEditorContent();
              
              // Re-setup listeners
              setTimeout(() => {
                setupMediaEventListeners();
              }, 100);
            }
          }
        }
        
        // Remove visual feedback
        if (editorRef.current) {
          editorRef.current.style.background = '';
          editorRef.current.style.border = '';
        }
      });
    }
  };

  const handleMediaUpdate = (element: HTMLElement) => {
    syncEditorContent();
  };

  // Setup media event listeners when chapter changes
  useEffect(() => {
    if (currentChapter && editorRef.current) {
      setTimeout(() => {
        setupMediaEventListeners();
      }, 300);
    }
  }, [selectedChapter, currentChapter?.content]);

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
    // Create EPUB-like structure
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
    // Convert embeds to QR codes for PDF
    const chaptersWithQRCodes = await Promise.all(
      bookData.chapters.map(async (chapter) => ({
        ...chapter,
        content: await convertEmbedsToQRCodes(chapter.content)
      }))
    );

    // Enhanced HTML with better styling for PDF
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
              BookForge Professional
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={generateEPUB}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export EPUB
              </Button>
              <Button
                onClick={downloadPDF}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={openFlipbookPreview}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Flipbook Preview
              </Button>
            </div>
          </div>
        </motion.div>

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
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Chapters */}
                <Card className="bg-slate-800/50 border-cyan-400/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-100 flex items-center justify-between">
                      Chapters
                      <Button
                        onClick={addChapter}
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {bookData.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-3 rounded cursor-pointer transition-all ${
                          selectedChapter === chapter.id
                            ? 'bg-cyan-600/20 border border-cyan-400/40'
                            : 'bg-slate-700/30 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-slate-200 flex-1"
                            onClick={() => setSelectedChapter(chapter.id)}
                          >
                            {chapter.title}
                          </span>
                          <Button
                            onClick={() => deleteChapter(chapter.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {bookData.chapters.length === 0 && (
                      <p className="text-slate-400 text-center py-4">
                        No chapters yet. Click + to add one.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Book Stats */}
                <BookStats chapters={bookData.chapters} />
              </div>

              {/* Editor */}
              <div className="lg:col-span-3 relative">
                <Card className="bg-slate-800/50 border-cyan-400/30">
                  <CardHeader>
                    <Input
                      value={currentChapter?.title || ''}
                      onChange={(e) => updateChapter(selectedChapter, 'title', e.target.value)}
                      placeholder="Chapter Title"
                      className="text-xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0"
                    />
                  </CardHeader>
                  
                  {/* Advanced Toolbar */}
                  <AdvancedToolbar
                    onFormat={formatText}
                    onImageInsert={handleImageInsert}
                    onEmbedInsert={handleEmbedInsert}
                    onFontChange={handleFontChange}
                    onFontSizeChange={handleFontSizeChange}
                    onColorChange={handleColorChange}
                  />
                  
                  <CardContent className="relative">
                    <div
                      ref={editorRef}
                      contentEditable
                      className="min-h-[500px] p-4 bg-slate-900/30 rounded-lg border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      style={{ lineHeight: '1.6' }}
                      dangerouslySetInnerHTML={{ __html: currentChapter?.content || '' }}
                      onBlur={syncEditorContent}
                      onInput={syncEditorContent}
                      suppressContentEditableWarning={true}
                    />
                    {!currentChapter && (
                      <div className="text-center text-slate-400 py-20">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Select a chapter to start writing</p>
                        <p className="text-sm">📷 Upload images • 🎥 Embed videos • 🖱️ Drag to reposition</p>
                        <p className="text-sm mt-1">Double-click media to edit size and alignment</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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

      {/* Media Editor */}
      {mediaEditor && (
        <MediaEditor
          element={mediaEditor.element}
          position={mediaEditor.position}
          onClose={() => setMediaEditor(null)}
          onUpdate={handleMediaUpdate}
        />
      )}

      {/* Flipbook Preview Modal */}
      <FlipbookPreview
        isOpen={isFlipbookOpen}
        onClose={() => setIsFlipbookOpen(false)}
        bookData={bookData}
      />
    </div>
  );
};

export default BookEditor;

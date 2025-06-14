
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Save, Plus, Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Image, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
  coverImage?: string;
}

const BookEditor = () => {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [bookData, setBookData] = useState<BookData>({
    title: '',
    author: '',
    description: '',
    chapters: []
  });

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
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      updateChapter(selectedChapter, 'content', content);
    }
  };

  const downloadPDF = async () => {
    // Create a simple HTML document for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${bookData.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; }
            .cover { text-align: center; page-break-after: always; }
            .chapter { page-break-before: always; }
            h1 { color: #2563eb; font-size: 2.5em; margin-bottom: 0.5em; }
            h2 { color: #1e40af; font-size: 2em; margin-top: 2em; }
            .author { font-size: 1.2em; color: #666; margin-top: 1em; }
            .description { margin: 2em 0; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="cover">
            <h1>${bookData.title}</h1>
            <div class="author">by ${bookData.author}</div>
            <div class="description">${bookData.description}</div>
          </div>
          ${bookData.chapters.map(chapter => `
            <div class="chapter">
              <h2>${chapter.title}</h2>
              <div>${chapter.content}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    // Create and download the file
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
      description: "Your book has been downloaded as an HTML file that can be converted to PDF.",
    });
  };

  const openFlipbookPreview = () => {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${bookData.title} - Preview</title>
            <style>
              body { 
                font-family: 'Georgia', serif; 
                line-height: 1.6; 
                margin: 0; 
                padding: 20px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              }
              .book-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                border-radius: 10px;
                overflow: hidden;
              }
              .cover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 60px 40px;
              }
              .cover h1 { font-size: 2.5em; margin: 0; }
              .cover .author { font-size: 1.2em; margin-top: 20px; opacity: 0.9; }
              .chapter {
                padding: 40px;
                border-bottom: 1px solid #eee;
              }
              .chapter:last-child { border-bottom: none; }
              .chapter h2 {
                color: #333;
                font-size: 1.8em;
                margin-bottom: 20px;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
              }
              .navigation {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="navigation">📖 Flipbook Preview</div>
            <div class="book-container">
              <div class="cover">
                <h1>${bookData.title}</h1>
                <div class="author">by ${bookData.author}</div>
                <p style="margin-top: 30px; font-style: italic;">${bookData.description}</p>
              </div>
              ${bookData.chapters.map(chapter => `
                <div class="chapter">
                  <h2>${chapter.title}</h2>
                  <div>${chapter.content}</div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const currentChapter = bookData.chapters.find(ch => ch.id === selectedChapter);

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
              BookForge Editor
            </h1>
            <div className="flex gap-4">
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

          {/* Book Metadata */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Book Title"
              value={bookData.title}
              onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-slate-800/50 border-cyan-400/30 text-white placeholder-slate-400"
            />
            <Input
              placeholder="Author Name"
              value={bookData.author}
              onChange={(e) => setBookData(prev => ({ ...prev, author: e.target.value }))}
              className="bg-slate-800/50 border-cyan-400/30 text-white placeholder-slate-400"
            />
            <Input
              placeholder="Book Description"
              value={bookData.description}
              onChange={(e) => setBookData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-slate-800/50 border-cyan-400/30 text-white placeholder-slate-400"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
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
          </motion.div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <Card className="bg-slate-800/50 border-cyan-400/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Input
                    value={currentChapter?.title || ''}
                    onChange={(e) => updateChapter(selectedChapter, 'title', e.target.value)}
                    placeholder="Chapter Title"
                    className="text-xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0"
                  />
                </div>
                
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  <Button
                    onClick={() => formatText('bold')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => formatText('italic')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => formatText('underline')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-slate-600 mx-2" />
                  <Button
                    onClick={() => formatText('justifyLeft')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => formatText('justifyCenter')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => formatText('justifyRight')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-slate-600 mx-2" />
                  <Button
                    onClick={() => formatText('insertUnorderedList')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => formatText('insertOrderedList')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => formatText('formatBlock', 'blockquote')}
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Quote className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[500px] p-4 bg-slate-900/30 rounded-lg border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  style={{ lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{ __html: currentChapter?.content || '' }}
                  onBlur={() => {
                    if (editorRef.current) {
                      updateChapter(selectedChapter, 'content', editorRef.current.innerHTML);
                    }
                  }}
                  suppressContentEditableWarning={true}
                />
                {!currentChapter && (
                  <div className="text-center text-slate-400 py-20">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a chapter to start writing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookEditor;

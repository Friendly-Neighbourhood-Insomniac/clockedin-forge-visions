
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Book, Printer, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookMetadataStore } from '@/stores/bookMetadataStore';
import { useChapterTreeStore } from '@/stores/chapterTreeStore';
import { exportToPDF, exportToEPUB, exportToHTML, downloadFile } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

const Export: React.FC = () => {
  const { metadata } = useBookMetadataStore();
  const { chapters } = useChapterTreeStore();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<string | null>(null);

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

  const handleExport = async (format: 'pdf' | 'epub' | 'html' | 'print') => {
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

        case 'print':
          // Open print-optimized page
          const printWindow = window.open('/print', '_blank');
          if (printWindow) {
            printWindow.focus();
          }
          toast({
            title: "Print View Opened",
            description: "A new window has been opened for printing."
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-cyan-400/30 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/preview">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Preview
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-cyan-100">
              📦 Export: {bookData.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF Export */}
          <Card className="bg-slate-800/50 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                PDF Export
              </CardTitle>
              <CardDescription className="text-slate-300">
                Professional PDF format, perfect for sharing and archiving
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport('pdf')}
                disabled={isExporting !== null}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export as PDF
              </Button>
            </CardContent>
          </Card>

          {/* EPUB Export */}
          <Card className="bg-slate-800/50 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <Book className="w-5 h-5" />
                EPUB Export
              </CardTitle>
              <CardDescription className="text-slate-300">
                E-book format compatible with most e-readers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport('epub')}
                disabled={isExporting !== null}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isExporting === 'epub' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export as EPUB
              </Button>
            </CardContent>
          </Card>

          {/* HTML Export */}
          <Card className="bg-slate-800/50 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                HTML Export
              </CardTitle>
              <CardDescription className="text-slate-300">
                Web-ready HTML format for online publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport('html')}
                disabled={isExporting !== null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isExporting === 'html' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export as HTML
              </Button>
            </CardContent>
          </Card>

          {/* Print */}
          <Card className="bg-slate-800/50 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Print Version
              </CardTitle>
              <CardDescription className="text-slate-300">
                Optimized layout for professional printing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport('print')}
                disabled={isExporting !== null}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isExporting === 'print' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4 mr-2" />
                )}
                Open Print View
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Book Info */}
        <Card className="mt-8 bg-slate-800/30 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-slate-200">Book Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Title:</span>
                <span className="text-slate-200 ml-2">{bookData.title}</span>
              </div>
              <div>
                <span className="text-slate-400">Author:</span>
                <span className="text-slate-200 ml-2">{bookData.author}</span>
              </div>
              <div>
                <span className="text-slate-400">Chapters:</span>
                <span className="text-slate-200 ml-2">{bookData.chapters.length}</span>
              </div>
              <div>
                <span className="text-slate-400">Total Pages:</span>
                <span className="text-slate-200 ml-2">{bookData.chapters.length + 2}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;

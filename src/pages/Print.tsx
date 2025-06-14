
import React, { useEffect } from 'react';
import { useBookMetadataStore } from '@/stores/bookMetadataStore';
import { useChapterTreeStore } from '@/stores/chapterTreeStore';

const Print: React.FC = () => {
  const { metadata } = useBookMetadataStore();
  const { chapters } = useChapterTreeStore();

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

  useEffect(() => {
    // Add print-specific styles
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; }
        .print-cover { page-break-after: always; text-align: center; padding-top: 200px; }
        .print-chapter { page-break-before: always; }
        .print-chapter h2 { border-bottom: 2pt solid #000; padding-bottom: 10pt; margin-bottom: 20pt; }
        .no-print { display: none; }
        @page { margin: 1in; }
      }
      .print-cover h1 { font-size: 32pt; margin-bottom: 20pt; }
      .print-cover .author { font-size: 18pt; margin-bottom: 15pt; }
      .print-cover .description { font-size: 14pt; font-style: italic; }
      .print-chapter h2 { font-size: 20pt; }
      .print-chapter .content { text-align: justify; }
    `;
    document.head.appendChild(printStyles);

    return () => {
      document.head.removeChild(printStyles);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Print Cover */}
      <div className="print-cover">
        <h1>{bookData.title}</h1>
        <div className="author">by {bookData.author}</div>
        <div className="description">{bookData.description}</div>
      </div>

      {/* Chapters */}
      {bookData.chapters.map((chapter, index) => (
        <div key={chapter.id} className="print-chapter">
          <h2>{chapter.title}</h2>
          <div 
            className="content"
            dangerouslySetInnerHTML={{ 
              __html: chapter.content || '<p>No content available</p>' 
            }}
          />
        </div>
      ))}

      {/* Print Button (hidden when printing) */}
      <div className="no-print fixed bottom-4 right-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg"
        >
          Print Book
        </button>
      </div>
    </div>
  );
};

export default Print;


import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { convertEmbedsToQRCodes } from './qrCodeGenerator';
import katex from 'katex';

// Register fonts for PDF
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

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
}

// Function to process content and convert math to readable text for PDF
const processMathForPDF = (content: string): string => {
  if (!content) return '';
  
  // Create a temporary div to parse the content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Find all math expressions and convert them to text
  const mathElements = tempDiv.querySelectorAll('[data-math]');
  mathElements.forEach((element) => {
    const expression = element.getAttribute('data-expression');
    if (expression && expression.trim()) {
      // Replace math element with formatted text
      const textElement = document.createElement('div');
      textElement.className = 'math-equation';
      textElement.style.cssText = 'margin: 16px 0; padding: 12px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; font-family: monospace; text-align: center;';
      textElement.textContent = `[EQUATION: ${expression}]`;
      element.parentNode?.replaceChild(textElement, element);
    }
  });
  
  return tempDiv.innerHTML;
};

// Function to process content and render math for HTML/EPUB
const processMathForHTML = (content: string): string => {
  if (!content) return '';
  
  // Create a temporary div to parse the content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Find all math expressions and re-render them
  const mathElements = tempDiv.querySelectorAll('[data-math]');
  mathElements.forEach((element) => {
    const expression = element.getAttribute('data-expression');
    if (expression && expression.trim()) {
      try {
        const rendered = katex.renderToString(expression, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: 'warn',
          trust: true
        });
        
        const newElement = document.createElement('div');
        newElement.className = 'math-expression';
        newElement.style.cssText = 'margin: 16px 0; padding: 12px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; text-align: center; page-break-inside: avoid;';
        newElement.innerHTML = rendered;
        element.parentNode?.replaceChild(newElement, element);
      } catch (error) {
        console.error('Error rendering math for export:', error);
        element.innerHTML = `<div style="color: #cc0000; font-family: monospace; text-align: center; padding: 12px;">Error rendering equation: ${expression}</div>`;
      }
    }
  });
  
  return tempDiv.innerHTML;
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Inter'
  },
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b'
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center'
  },
  coverAuthor: {
    fontSize: 18,
    color: '#06b6d4',
    marginBottom: 10
  },
  coverDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    maxWidth: 400
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    borderBottom: '2pt solid #06b6d4',
    paddingBottom: 10
  },
  chapterContent: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'justify'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    right: 30,
    color: '#9ca3af'
  }
});

// PDF Document Component
const PDFDocument: React.FC<{ bookData: BookData }> = ({ bookData }) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.coverPage}>
      <View>
        <Text style={styles.coverTitle}>{bookData.title}</Text>
        <Text style={styles.coverAuthor}>by {bookData.author}</Text>
        <Text style={styles.coverDescription}>{bookData.description}</Text>
      </View>
    </Page>
    
    {/* Chapter Pages */}
    {bookData.chapters.map((chapter, index) => (
      <Page key={chapter.id} size="A4" style={styles.page}>
        <View>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterContent}>
            {chapter.content ? processMathForPDF(chapter.content).replace(/<[^>]*>/g, '') : 'No content available'}
          </Text>
        </View>
        <Text style={styles.pageNumber}>{index + 2}</Text>
      </Page>
    ))}
  </Document>
);

export const exportToPDF = async (bookData: BookData): Promise<Blob> => {
  const blob = await pdf(<PDFDocument bookData={bookData} />).toBlob();
  return blob;
};

export const exportToEPUB = async (bookData: BookData): Promise<Blob> => {
  try {
    // Convert embeds to QR codes and process math for EPUB
    const processedChapters = await Promise.all(
      bookData.chapters.map(async (chapter) => ({
        ...chapter,
        content: processMathForHTML(await convertEmbedsToQRCodes(chapter.content || ''))
      }))
    );

    // Fallback to HTML export since epub-gen has browser compatibility issues
    return exportToHTML({ ...bookData, chapters: processedChapters });
  } catch (error) {
    console.error('Error creating EPUB:', error);
    // Fallback to HTML export
    return exportToHTML(bookData);
  }
};

const createSimpleEPUB = (bookData: BookData, chapters: Chapter[]): string => {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${bookData.title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    .cover { text-align: center; page-break-after: always; }
    .cover h1 { font-size: 2.5em; margin-bottom: 0.5em; }
    .cover .author { font-size: 1.2em; color: #666; margin-bottom: 1em; }
    .cover .description { font-style: italic; color: #888; }
    .chapter { page-break-before: always; }
    .chapter h2 { border-bottom: 2px solid #06b6d4; padding-bottom: 10px; }
    .math-expression { 
      margin: 16px 0; 
      padding: 12px; 
      background-color: #f8f9fa; 
      border: 1px solid #e9ecef; 
      border-radius: 4px; 
      text-align: center; 
      page-break-inside: avoid;
    }
    .katex-display { margin: 0; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${bookData.title}</h1>
    <div class="author">by ${bookData.author}</div>
    <div class="description">${bookData.description}</div>
  </div>
  ${chapters.map(chapter => `
    <div class="chapter">
      <h2>${chapter.title}</h2>
      <div>${chapter.content || '<p>No content available</p>'}</div>
    </div>
  `).join('')}
</body>
</html>`;
  return htmlContent;
};

export const exportToHTML = async (bookData: BookData): Promise<Blob> => {
  const processedChapters = await Promise.all(
    bookData.chapters.map(async (chapter) => ({
      ...chapter,
      content: processMathForHTML(await convertEmbedsToQRCodes(chapter.content || ''))
    }))
  );

  const htmlContent = createSimpleEPUB(bookData, processedChapters);
  return new Blob([htmlContent], { type: 'text/html' });
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

import React, { useRef, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import katex from 'katex';

declare global {
  interface Window {
    $: any;
  }
}

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

interface TurnJsFlipbookProps {
  bookData: BookData;
  width?: number;
  height?: number;
}

const TurnJsFlipbook: React.FC<TurnJsFlipbookProps> = ({ 
  bookData, 
  width = 800, 
  height = 600 
}) => {
  const flipbookRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [turnInstance, setTurnInstance] = useState<any>(null);

  // Function to process content and render math equations
  const processContentWithMath = (content: string): string => {
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
          newElement.className = 'math-expression bg-gray-50 p-4 rounded border text-center my-4';
          newElement.style.cssText = 'min-height: 60px; display: flex; align-items: center; justify-content: center; page-break-inside: avoid;';
          newElement.setAttribute('data-math', 'true');
          newElement.setAttribute('data-expression', expression);
          newElement.innerHTML = rendered;
          
          element.parentNode?.replaceChild(newElement, element);
        } catch (error) {
          console.error('Error rendering math in flipbook:', error);
          element.innerHTML = `<span style="color: #cc0000; font-family: monospace;">Error: ${expression}</span>`;
        }
      }
    });
    
    // Also handle inline math expressions that might be wrapped in \( \) delimiters
    let processedContent = tempDiv.innerHTML;
    processedContent = processedContent.replace(/\\\((.*?)\\\)/g, (match, expression) => {
      try {
        return katex.renderToString(expression, {
          displayMode: false,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: 'warn',
          trust: true
        });
      } catch (error) {
        console.error('Error rendering inline math:', error);
        return `<span style="color: #cc0000; font-family: monospace;">Error: ${expression}</span>`;
      }
    });
    
    return processedContent;
  };

  useEffect(() => {
    const loadTurnJs = async () => {
      try {
        // Load jQuery and Turn.js
        if (!window.$) {
          const jqueryScript = document.createElement('script');
          jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
          document.head.appendChild(jqueryScript);
          
          await new Promise((resolve) => {
            jqueryScript.onload = resolve;
          });
        }

        if (!window.$.fn.turn) {
          const turnScript = document.createElement('script');
          turnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js';
          document.head.appendChild(turnScript);
          
          await new Promise((resolve) => {
            turnScript.onload = resolve;
          });
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading Turn.js:', error);
      }
    };

    loadTurnJs();
  }, []);

  useEffect(() => {
    if (!isLoaded || !flipbookRef.current || !window.$ || !window.$.fn.turn) return;

    try {
      const totalPagesCount = bookData.chapters.length + 2; // +2 for cover and back cover
      setTotalPages(totalPagesCount);

      // Initialize Turn.js
      const $flipbook = window.$(flipbookRef.current);
      
      const turnConfig = {
        width: width,
        height: height,
        autoCenter: true,
        elevation: 50,
        gradients: true,
        acceleration: true,
        display: 'double',
        duration: 1000,
        pages: totalPagesCount,
        when: {
          turned: function(event: any, page: number) {
            setCurrentPage(page);
          }
        }
      };

      $flipbook.turn(turnConfig);
      setTurnInstance($flipbook);

    } catch (error) {
      console.error('Error initializing Turn.js:', error);
    }

    return () => {
      try {
        if (turnInstance && turnInstance.turn && typeof turnInstance.turn === 'function') {
          // Check if the turn instance still exists and has the destroy method
          if (turnInstance.data('turn')) {
            turnInstance.turn('destroy');
          }
        }
      } catch (error) {
        console.error('Error destroying Turn.js instance:', error);
      }
      setTurnInstance(null);
    };
  }, [isLoaded, bookData, width, height]);

  const nextPage = () => {
    try {
      if (turnInstance && turnInstance.turn) {
        turnInstance.turn('next');
      }
    } catch (error) {
      console.error('Error turning to next page:', error);
    }
  };

  const prevPage = () => {
    try {
      if (turnInstance && turnInstance.turn) {
        turnInstance.turn('previous');
      }
    } catch (error) {
      console.error('Error turning to previous page:', error);
    }
  };

  const goToPage = (page: number) => {
    try {
      if (turnInstance && turnInstance.turn) {
        turnInstance.turn('page', page);
      }
    } catch (error) {
      console.error('Error going to page:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading flipbook...</div>
      </div>
    );
  }

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="relative">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-50 flex gap-2 bg-slate-800/80 rounded-lg p-2">
            <Button
              onClick={() => zoomIn()}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => zoomOut()}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => resetTransform()}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-slate-800/80 rounded-lg p-2">
            <Button
              onClick={prevPage}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-slate-700"
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white px-3 py-1 text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={nextPage}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-slate-700"
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <TransformComponent>
            <div className="flex justify-center">
              <div
                ref={flipbookRef}
                className="flipbook-container"
                style={{ width, height }}
              >
                {/* Cover Page */}
                <div className="page">
                  <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-8 rounded-lg shadow-2xl">
                    <h1 className="text-4xl font-bold mb-4 text-center">{bookData.title}</h1>
                    <p className="text-xl mb-6 text-cyan-300">by {bookData.author}</p>
                    <p className="text-center text-slate-300 italic">{bookData.description}</p>
                  </div>
                </div>

                {/* Chapter Pages */}
                {bookData.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="page">
                    <div className="h-full bg-white p-8 shadow-lg relative overflow-hidden">
                      <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b-2 border-cyan-500 pb-2">
                        {chapter.title}
                      </h2>
                      <div 
                        className="text-slate-700 leading-relaxed overflow-hidden"
                        dangerouslySetInnerHTML={{ 
                          __html: processContentWithMath(chapter.content) || '<p className="text-slate-500 italic">No content yet...</p>' 
                        }}
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                        Page {index + 2}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Back Cover */}
                <div className="page">
                  <div className="h-full bg-gradient-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center text-white p-8 rounded-lg shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">Thank you for reading!</h3>
                    <p className="text-center text-slate-300">
                      Created with BookForge
                    </p>
                    <div className="mt-8 text-cyan-300 text-center">
                      <p className="text-sm">
                        {bookData.chapters.length} chapters • {bookData.author}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

export default TurnJsFlipbook;

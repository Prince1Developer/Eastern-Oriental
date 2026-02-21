import { FileText } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { menuPdfApi } from '../api';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const Menu = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch active PDF URL from backend
    menuPdfApi.getActivePdfUrl().then(setPdfUrl).catch(console.error);
  }, []);

  // Measure container width for responsive PDF pages
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setPdfLoading(false);
    setPdfError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setPdfLoading(false);
    setPdfError(true);
  }, []);

  return (
    <section className="py-8 sm:py-24 px-4 sm:px-6 lg:px-12 bg-background-dark min-h-screen pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-primary uppercase tracking-widest text-sm font-bold mb-2 block">Curation</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white italic">Our Menu</h2>
          </div>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-lg hover:bg-primary/20 transition-all"
            >
              <FileText className="w-5 h-5" />
              <span>Download Full PDF Menu</span>
            </a>
          )}
        </div>

        <div ref={containerRef} className="relative bg-zinc-900 rounded-xl overflow-hidden border border-primary/20 shadow-2xl">
          {pdfUrl ? (
            <div className="w-full">
              {pdfLoading && (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                  <p className="text-slate-400 text-lg">Loading menu...</p>
                </div>
              )}

              {pdfError ? (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                    <FileText className="text-red-400 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 italic">Unable to Load Menu</h3>
                  <p className="text-slate-400 max-w-md mb-6">
                    We couldn't load the menu right now. Please try downloading it instead.
                  </p>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download
                    className="flex items-center gap-2 bg-primary text-background-dark font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all">
                    <FileText className="w-5 h-5" /> Download Menu PDF
                  </a>
                </div>
              ) : (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="flex flex-col items-center gap-4 py-6 px-2 sm:px-4"
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <div key={`page_${i + 1}`} className="shadow-lg w-full flex justify-center">
                      <Page
                        pageNumber={i + 1}
                        width={Math.min(containerWidth - 16, 1200)}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </div>
                  ))}
                </Document>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                <FileText className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 italic">Menu Coming Soon</h3>
              <p className="text-slate-400 max-w-md">
                Our chef is crafting the perfect seasonal menu. Please check back soon or contact us for our current offerings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;

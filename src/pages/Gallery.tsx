import React, { useState, useEffect } from 'react';
import { galleryApi, type GalleryImage } from '../api';

export const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryApi.getAll().then(setImages).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-12 bg-background-dark min-h-screen pt-24">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-400 text-lg">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-12 bg-background-dark min-h-screen pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-bold mb-2 block">Gallery</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold italic mb-4 text-white">Atmosphere & Art</h2>
          <p className="text-primary/80 tracking-widest uppercase text-sm font-bold">A Visual Journey Through Our Kitchen</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[180px]">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`${idx === 0 ? 'col-span-2 row-span-2' : idx === 3 ? 'col-span-2' : ''} group relative overflow-hidden rounded-xl border border-primary/20 shadow-lg`}
            >
              <img
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={img.url}
                referrerPolicy="no-referrer"
              />
              {img.title && (
                <div className="absolute inset-0 bg-background-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <span className="text-white text-xl italic font-bold">{img.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

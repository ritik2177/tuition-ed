'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

interface ImageSliderProps {
  images: { src: string; alt: string; name: string }[];
  interval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstPage = currentIndex === 0;
    const newIndex = isFirstPage ? Math.ceil(images.length / 4) - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastPage = currentIndex === Math.ceil(images.length / 4) - 1;
    const newIndex = isLastPage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (interval > 0) {
      const sliderInterval = setInterval(goToNext, interval);
      return () => clearInterval(sliderInterval);
    }
  }, [currentIndex, interval]);

  const showControls = images.length > 4;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl group">
      <div className="w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        <div className="flex h-full" style={{ width: `${Math.ceil(images.length / 4) * 100}%` }}>
          {images.map((image, index) => (
            <div key={index} className="relative flex-shrink-0 w-1/4 h-full group/image">
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="w-full h-full transition-transform duration-300 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xl font-semibold text-white">{image.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showControls && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous slide"
          >
            <GoChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next slide"
          >
            <GoChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
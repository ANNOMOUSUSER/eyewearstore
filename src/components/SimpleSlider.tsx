'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleSliderProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  intervalMs?: number;
  className?: string;
}

export default function SimpleSlider({ children, autoPlay = true, intervalMs = 3500, className = '' }: SimpleSliderProps) {
  const slides = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const updateSlides = () => {
      setSlidesToShow(window.innerWidth >= 1024 ? 2 : 1);
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length, intervalMs]);

  const prevSlide = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveIndex((current) => (current + 1) % slides.length);
  const cardWidth = `${100 / slidesToShow}%`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeIndex * (100 / slidesToShow)}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="flex-shrink-0" style={{ width: cardWidth }}>
            {slide}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 shadow-sm text-white hover:bg-black"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 shadow-sm text-white hover:bg-black"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === activeIndex ? 'bg-accent' : 'bg-surface border border-line'}`}
          />
        ))}
      </div>
    </div>
  );
}

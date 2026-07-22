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

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length, intervalMs]);

  const prevSlide = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveIndex((current) => (current + 1) % slides.length);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full flex-shrink-0">
            {slide}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-paper/90 p-2 shadow-sm border border-line text-ink hover:bg-paper"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-paper/90 p-2 shadow-sm border border-line text-ink hover:bg-paper"
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

"use client";

import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import MuseumImage from "@/components/ui/MuseumImage";
import Reveal from "@/components/ui/Reveal";
import type { IGalleryPhoto } from "@/models/GalleryPhoto";

const CATEGORIES = ["all", "Museum Photos", "Visitor Photos", "Events"];

export default function PhotoGallery({ photos }: { photos: IGalleryPhoto[] }) {
  const [category, setCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (category === "all" ? photos : photos.filter((p) => p.category === category)),
    [photos, category]
  );

  if (photos.length === 0) return null;

  const active = activeIndex !== null ? filtered[activeIndex] : null;

  function show(delta: number) {
    if (activeIndex === null) return;
    const next = (activeIndex + delta + filtered.length) % filtered.length;
    setActiveIndex(next);
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm border transition-colors ${
              category === c
                ? "bg-gold text-text-dark border-gold"
                : "border-brown/20 text-text-dark/70 hover:border-gold/60"
            }`}
          >
            {c === "all" ? "All Photos" : c}
          </button>
        ))}
      </div>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {filtered.map((photo, index) => (
          <Reveal key={photo._id} delay={(index % 8) * 60} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden rounded-sm border border-brown/10 hover:border-gold/50 transition-colors"
            >
              <MuseumImage
                src={photo.imageUrl}
                alt={photo.caption || "Museum photo"}
                width={500}
                height={500}
                sizes="(max-width: 640px) 45vw, 22vw"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {photo.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background-dark/80 to-transparent p-3 text-left text-xs text-cream opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
            className="absolute top-5 right-5 text-cream hover:text-gold-light"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              show(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-8 text-cream hover:text-gold-light"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative max-w-4xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[70vh]">
              <MuseumImage src={active.imageUrl} alt={active.caption || "Museum photo"} fill sizes="90vw" className="object-contain" />
            </div>
            {active.caption && (
              <p className="mt-4 text-center text-cream/85 text-sm">{active.caption}</p>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              show(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-8 text-cream hover:text-gold-light"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}

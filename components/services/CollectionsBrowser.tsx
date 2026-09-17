"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import MuseumImage from "@/components/ui/MuseumImage";
import Reveal from "@/components/ui/Reveal";
import type { ICollection } from "@/models/Collection";

const PAGE_SIZE = 12;

export default function CollectionsBrowser({ collections }: { collections: ICollection[] }) {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const set = new Set(collections.map((c) => c.category));
    return ["all", ...Array.from(set).sort()];
  }, [collections]);

  const featured = useMemo(() => collections.filter((c) => c.featured), [collections]);

  const filtered = useMemo(() => {
    return collections.filter((c) => {
      const matchesCategory = category === "all" || c.category === category;
      const matchesSearch =
        !search || c.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [collections, category, search]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      {featured.length > 0 && (
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-light mb-6">Featured Exhibits</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.slice(0, 3).map((item, index) => (
              <Reveal key={item._id} delay={index * 100}>
                <CollectionCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-10">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search collections..."
            aria-label="Search collections"
            className="w-full bg-background-brown/60 border border-gold/20 rounded-sm pl-9 pr-3 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm border transition-colors ${
                category === c
                  ? "bg-gold text-text-dark border-gold"
                  : "border-gold/25 text-cream/70 hover:border-gold/60"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-cream/60 py-16">No collections match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((item, index) => (
            <Reveal key={item._id} delay={(index % PAGE_SIZE) * 60}>
              <CollectionCard item={item} />
            </Reveal>
          ))}
        </div>
      )}

      {visibleCount < filtered.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm uppercase tracking-wider border border-gold-light/50 text-cream hover:bg-gold-light/10 transition-colors rounded-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

function CollectionCard({ item }: { item: ICollection }) {
  return (
    <div
      id={item.slug}
      className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/15 hover:border-gold/60 transition-colors scroll-mt-28"
    >
      <MuseumImage
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes="(max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-light/80 mb-1">{item.category}</p>
        <h3 className="font-serif-heading text-lg text-ivory leading-snug">{item.title}</h3>
        {item.shortDescription && (
          <p className="mt-1 text-xs text-cream/70 line-clamp-2">{item.shortDescription}</p>
        )}
        <span className="mt-3 inline-flex items-center justify-center w-8 h-8 rounded-full border border-gold-light/50 text-gold-light group-hover:bg-gold group-hover:text-text-dark transition-colors">
          <ArrowUpRight size={15} />
        </span>
      </div>
    </div>
  );
}

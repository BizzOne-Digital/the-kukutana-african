import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MuseumImage from "@/components/ui/MuseumImage";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import type { ICollection } from "@/models/Collection";

export default function CollectionsShowcase({ collections }: { collections: ICollection[] }) {
  if (collections.length === 0) return null;

  return (
    <section className="bg-background-dark py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="OUR COLLECTIONS & EXHIBITS"
            title="Powerful Stories. Timeless Impact."
            dark
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-light border-b border-gold/40 pb-1 hover:border-gold hover:gap-3 transition-all shrink-0"
          >
            Explore All Exhibits <ArrowUpRight size={16} />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {collections.map((item, index) => (
            <Reveal key={item._id as unknown as string} delay={index * 80}>
              <Link
                href={`/services#${item.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-gold/15 hover:border-gold/60 transition-colors"
              >
                <MuseumImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 45vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif-heading text-sm sm:text-base text-ivory leading-snug">
                    {item.title}
                  </h3>
                  {item.shortDescription && (
                    <p className="mt-1 text-[11px] text-cream/70 line-clamp-2">{item.shortDescription}</p>
                  )}
                  <span className="mt-2 inline-flex items-center justify-center w-7 h-7 rounded-full border border-gold-light/50 text-gold-light transition-colors group-hover:bg-gold group-hover:text-text-dark">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

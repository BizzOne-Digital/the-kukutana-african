import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { IHomeContent } from "@/models/HomeContent";

const LINKS = [
  { label: "VISIT", href: "/booking" },
  { label: "BOOK A TOUR", href: "/booking" },
  { label: "MAKE A DONATION", href: "/contact" },
  { label: "BE A PART OF THE STORY", href: "/about" },
];

export default function FinalCta({ finalCta }: { finalCta: IHomeContent["finalCta"] }) {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/home1.png" alt="Museum exhibition" fill sizes="100vw" className="object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/85 via-purple/70 to-background-dark/90" />
      </div>

      <Reveal className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14 text-center">
        <h2 className="font-serif-heading font-medium text-ivory text-[clamp(2.1rem,4.5vw,3.75rem)] text-balance">
          {finalCta.heading}
        </h2>
        <p className="mt-5 text-cream/80 text-lg">{finalCta.subheading}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs sm:text-sm tracking-[0.2em] text-gold-light border-b border-gold/40 pb-1 hover:border-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={finalCta.primaryCtaHref}
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light hover:scale-105 transition-all rounded-sm"
          >
            {finalCta.primaryCtaLabel}
          </Link>
          <Link
            href={finalCta.secondaryCtaHref}
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider border border-gold-light/50 text-cream hover:bg-gold-light/10 hover:scale-105 transition-all rounded-sm"
          >
            {finalCta.secondaryCtaLabel}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

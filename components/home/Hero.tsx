import Link from "next/link";
import Image from "next/image";
import type { IHomeContent } from "@/models/HomeContent";

const SIDE_WORDS = ["KNOW", "HONOR", "PRESERVE", "EDUCATE", "UNITE"];

export default function Hero({ hero }: { hero: IHomeContent["hero"] }) {
  return (
    <section className="relative min-h-[650px] sm:min-h-[720px] lg:min-h-[860px] flex items-center overflow-hidden bg-background-dark">
      <div className="absolute inset-0">
        <Image
          src="/mobile-hero.png"
          alt="Kukutana museum"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-slow-zoom sm:hidden"
        />
        <Image
          src="/hero.png"
          alt="Kukutana museum"
          fill
          priority
          sizes="100vw"
          className="hidden sm:block object-cover object-center animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-background-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-purple/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 pt-28 pb-16">
        <div className="max-w-2xl animate-fade-up">
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-light mb-6">
            {hero.eyebrow}
          </p>
          <h1 className="font-serif-heading font-medium text-ivory leading-[1.05] text-[clamp(2.25rem,5.5vw,4.5rem)] text-balance">
            {hero.title}
          </h1>
          <p className="font-serif-heading italic text-gold-light/90 mt-4 text-[clamp(1.1rem,2vw,1.6rem)]">
            {hero.italicTitle}
          </p>
          <p className="mt-6 max-w-lg text-cream/80 text-base sm:text-lg leading-relaxed">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={hero.primaryCtaHref}
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm shadow-[0_10px_30px_rgba(201,162,74,0.3)]"
            >
              {hero.primaryCtaLabel}
            </Link>
            <Link
              href={hero.secondaryCtaHref}
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider border border-gold-light/50 text-cream hover:bg-gold-light/10 transition-colors rounded-sm"
            >
              {hero.secondaryCtaLabel}
            </Link>
          </div>

          {hero.quote && (
            <div className="mt-12 max-w-md border-l border-gold/50 pl-5">
              <p className="font-serif-heading italic text-cream/70 text-base sm:text-lg leading-relaxed">
                {hero.quote}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-8">
        {SIDE_WORDS.map((word) => (
          <span
            key={word}
            className="text-[11px] tracking-[0.4em] text-gold-light/70"
            style={{ writingMode: "vertical-rl" }}
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}

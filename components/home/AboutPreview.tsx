import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { IHomeContent } from "@/models/HomeContent";

const WORDS = ["EDUCATION", "CULTURE", "COMMUNITY", "LEGACY", "TOGETHER"];

export default function AboutPreview({ about }: { about: IHomeContent["aboutPreview"] }) {
  return (
    <section className="bg-ivory text-text-dark py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14 grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
        <Reveal>
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-brown/70 mb-4">
            {about.eyebrow}
          </p>
          <h2 className="font-serif-heading font-medium text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] text-text-dark">
            {about.title}
          </h2>
          <div className="mt-6 h-px w-20 bg-gold animate-grow-line" />
          <p className="mt-6 text-text-dark/75 leading-relaxed text-base sm:text-lg max-w-xl">
            {about.description}
          </p>
          <Link
            href={about.ctaHref}
            className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-brown border-b border-brown/40 pb-1 hover:border-gold hover:text-gold hover:gap-3 transition-all"
          >
            {about.ctaLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {WORDS.map((w) => (
              <span key={w} className="text-[11px] tracking-[0.25em] text-brown/50">
                {w}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="relative">
          <div className="relative aspect-[16/11] rounded-sm overflow-hidden shadow-xl group">
            <Image
              src="/homeabout.png"
              alt="Museum gallery visitors"
              fill
              sizes="55vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 max-w-xs glass-panel !bg-purple/85 p-6 rounded-sm shadow-2xl hidden sm:block animate-float-slow">
            <p className="font-serif-heading italic text-gold-light text-lg leading-snug">
              {about.quote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

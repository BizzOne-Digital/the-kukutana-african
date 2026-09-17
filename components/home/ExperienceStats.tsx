import MuseumImage from "@/components/ui/MuseumImage";
import Reveal from "@/components/ui/Reveal";
import type { IHomeContent } from "@/models/HomeContent";

export default function ExperienceStats({ experience }: { experience: IHomeContent["experience"] }) {
  return (
    <section className="relative bg-background-brown py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <MuseumImage src={experience.image} alt="Archival museum documents" fill sizes="100vw" className="object-cover animate-slow-zoom" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background-brown via-background-brown/90 to-background-brown" />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14 text-center">
        <Reveal>
          <h2 className="font-serif-heading font-medium text-gold-light text-[clamp(1.9rem,3.6vw,3rem)] text-balance">
            {experience.heading}
          </h2>
          <div className="mt-6 h-px w-20 bg-gold mx-auto animate-grow-line" />
          <p className="mt-6 max-w-2xl mx-auto text-cream/75 leading-relaxed">{experience.description}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
          {experience.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100} className="border-t border-gold/25 pt-5">
              <p className="font-serif-heading text-gold-light text-3xl sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

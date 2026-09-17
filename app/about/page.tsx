import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MuseumImage from "@/components/ui/MuseumImage";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { getAboutContent } from "@/lib/data/getAboutContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story behind Kukutana African American History & Culture Museum — our mission, meaning, and vision for the future.",
};

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <>
      <section className="relative min-h-[420px] sm:min-h-[520px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/home1.png" alt="Museum exhibit hall" fill sizes="100vw" priority className="object-cover animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-background-dark/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1440px] w-full px-5 sm:px-8 lg:px-14 pb-16 pt-32 animate-fade-up">
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-light mb-4">
            {about.heroEyebrow}
          </p>
          <h1 className="font-serif-heading font-medium text-ivory text-[clamp(2.25rem,5vw,4.25rem)] max-w-3xl text-balance">
            {about.heroTitle}
          </h1>
        </div>
      </section>

      <section className="bg-ivory text-text-dark py-20 sm:py-28">
        <Reveal className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-0">
          <p className="text-lg sm:text-xl leading-relaxed text-text-dark/85">{about.introduction}</p>
          <blockquote className="mt-10 border-l-2 border-gold pl-6 font-serif-heading italic text-2xl text-brown">
            {about.meaningOfKukutana}
          </blockquote>
        </Reveal>
      </section>

      <section className="bg-background-dark py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal className="relative aspect-[4/3] rounded-sm overflow-hidden order-2 lg:order-1 group">
            <Image
              src="/home2.png"
              alt="Museum mission"
              fill
              sizes="45vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          </Reveal>
          <Reveal delay={150} className="order-1 lg:order-2">
            <SectionHeading eyebrow="OUR MISSION" title="Preserving Purpose." dark />
            <p className="mt-6 text-cream/75 leading-relaxed">{about.mission}</p>
            <div className="mt-8 h-px w-full bg-gold/20" />
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-gold-light mb-3">Our Vision</p>
            <p className="text-cream/75 leading-relaxed">{about.vision}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory text-text-dark py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
          <Reveal>
            <SectionHeading eyebrow="OUR JOURNEY" title="A Timeline of Growth." align="center" />
          </Reveal>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.timeline.map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="border-t-2 border-gold pt-5">
                <p className="text-xs uppercase tracking-[0.25em] text-brown/60 mb-2">{item.year}</p>
                <h3 className="font-serif-heading text-xl text-text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-text-dark/70 leading-relaxed">{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-brown py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14 grid lg:grid-cols-3 gap-8">
          <Reveal className="lg:col-span-1 relative aspect-[3/4] rounded-sm overflow-hidden group">
            <Image
              src="/home3.png"
              alt="Community engagement"
              fill
              sizes="30vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          </Reveal>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            <Reveal delay={0} className="border border-gold/20 rounded-sm p-8 transition-colors hover:border-gold/50">
              <h3 className="font-serif-heading text-ivory text-xl mb-3">Community Impact</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{about.communityImpact}</p>
            </Reveal>
            <Reveal delay={100} className="border border-gold/20 rounded-sm p-8 transition-colors hover:border-gold/50">
              <h3 className="font-serif-heading text-ivory text-xl mb-3">Educational Mission</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{about.educationalMission}</p>
            </Reveal>
            <Reveal delay={200} className="border border-gold/20 rounded-sm p-8 transition-colors hover:border-gold/50">
              <h3 className="font-serif-heading text-ivory text-xl mb-3">Preservation</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{about.preservationMission}</p>
            </Reveal>
            <Reveal delay={300} className="border border-gold/20 rounded-sm p-8 transition-colors hover:border-gold/50">
              <h3 className="font-serif-heading text-ivory text-xl mb-3">Legacy</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{about.legacy}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <MuseumImage src={about.images.future} alt="Future home of Kukutana" fill sizes="100vw" className="object-cover animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/90 via-purple/70 to-background-dark/90" />
        </div>
        <Reveal className="relative mx-auto max-w-[900px] px-5 sm:px-8 text-center">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-light mb-4">
            LOOKING AHEAD
          </p>
          <h2 className="font-serif-heading font-medium text-ivory text-[clamp(2rem,4vw,3.25rem)] text-balance">
            {about.futureVision}
          </h2>
          <p className="mt-6 text-cream/80 leading-relaxed">{about.futureHomeStory}</p>
          <Link
            href="/booking"
            className="mt-10 inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light hover:scale-105 transition-all rounded-sm"
          >
            Plan Your Visit
          </Link>
        </Reveal>
      </section>
    </>
  );
}

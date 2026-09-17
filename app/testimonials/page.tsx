import type { Metadata } from "next";
import { getTestimonials } from "@/lib/data/getTestimonials";
import TestimonialCard from "@/components/ui/TestimonialCard";
import Reveal from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Stories and reflections from visitors to Kukutana African American History & Culture Museum.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <section className="bg-background-dark pt-32 pb-16 sm:pb-20 text-center pattern-kente">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8 animate-fade-up">
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-light mb-4">
            TESTIMONIALS
          </p>
          <h1 className="font-serif-heading font-medium text-ivory text-[clamp(2.25rem,5vw,3.75rem)]">
            Stories From Our Community
          </h1>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
          {testimonials.length === 0 ? (
            <p className="text-center text-text-dark/60">
              Testimonials will appear here as visitors share their experience.
            </p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {testimonials.map((t, index) => (
                <Reveal key={t._id} delay={(index % 6) * 80} className="mb-6 break-inside-avoid">
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

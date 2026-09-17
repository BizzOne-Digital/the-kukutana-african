import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/ui/TestimonialCard";
import Reveal from "@/components/ui/Reveal";
import type { ITestimonial } from "@/models/Testimonial";

export default function TestimonialsSection({ testimonials }: { testimonials: ITestimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal>
          <SectionHeading
            eyebrow="WHAT PEOPLE ARE SAYING"
            title="Real People. Meaningful Experiences."
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, index) => (
            <Reveal key={t._id as unknown as string} delay={index * 120}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

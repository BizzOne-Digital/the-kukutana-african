import type { Metadata } from "next";
import { getPricingOptions } from "@/lib/data/getPricing";
import BookingForm from "@/components/booking/BookingForm";
import Reveal from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Your Visit",
  description:
    "Book a group tour at Kukutana African American History & Culture Museum. Currently accepting groups of 15 or more guests.",
};

export default async function BookingPage() {
  const options = await getPricingOptions();

  return (
    <section className="bg-background-dark pt-32 pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="max-w-2xl animate-fade-up">
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-light mb-4">
            BOOKING
          </p>
          <h1 className="font-serif-heading font-medium text-ivory text-[clamp(2.25rem,5vw,3.75rem)]">
            Book Your Museum Experience
          </h1>
          <p className="mt-6 text-cream/75 leading-relaxed">
            Kukutana is currently accepting group tours with 15 or more guests, ideal for schools,
            churches, corporate teams, fraternities and sororities, and community organizations.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <Reveal className="border border-gold/15 rounded-sm p-6 sm:p-10 bg-background-brown/30">
            <BookingForm />
          </Reveal>

          <Reveal delay={150} as="aside" className="border border-gold/20 rounded-sm p-8 h-fit bg-gradient-to-br from-purple to-background-brown">
            <h2 className="font-serif-heading text-gold-light text-xl mb-6">Pricing Summary</h2>
            <ul className="space-y-4">
              {options.map((opt) => (
                <li key={opt._id} className="flex items-center justify-between text-sm border-b border-gold/10 pb-3">
                  <span className="text-cream/85">{opt.title}</span>
                  <span className="text-gold-light font-medium">
                    {opt.free ? "FREE" : opt.discount || opt.price}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-cream/60 leading-relaxed">
              No child who cannot afford admission will be refused.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

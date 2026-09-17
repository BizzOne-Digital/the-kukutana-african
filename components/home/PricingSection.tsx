import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { IPricingOption } from "@/models/PricingOption";

export default function PricingSection({
  options,
  notice,
}: {
  options: IPricingOption[];
  notice: string;
}) {
  const admissionRates = options.filter((o) => !o.discount);
  const discounts = options.filter((o) => o.discount);

  return (
    <section className="relative bg-gradient-to-br from-purple via-purple-light to-brown py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal className="text-center max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-light mb-4">
            GROUP TOUR PRICING
          </p>
          <h2 className="font-serif-heading font-medium text-ivory text-[clamp(2rem,4vw,3.25rem)]">
            Experience History Together.
          </h2>
          <p className="mt-5 text-cream/75 leading-relaxed">
            Guided group experiences for schools, churches, organizations, tourists and communities.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {admissionRates.map((rate, index) => (
            <Reveal
              key={rate._id as unknown as string}
              delay={index * 80}
              className="glass-panel rounded-sm p-5 text-center flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-cream/70">{rate.title}</p>
              <p className="mt-3 font-serif-heading text-gold-light text-2xl sm:text-3xl">
                {rate.free ? "FREE" : rate.price}
              </p>
            </Reveal>
          ))}
        </div>

        {discounts.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {discounts.map((d, index) => (
              <Reveal
                key={d._id as unknown as string}
                delay={index * 80}
                className="border border-gold/30 rounded-sm p-4 text-center transition-colors hover:border-gold/60"
              >
                <p className="text-xs text-cream/80">{d.title}</p>
                <p className="mt-1 text-gold-light text-sm font-medium">{d.discount}</p>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10 text-center space-y-2">
          <p className="text-sm text-cream/70">Group tours currently require 15 or more guests.</p>
          {notice && <p className="font-serif-heading italic text-gold-light">{notice}</p>}
        </Reveal>

        <div className="mt-10 text-center">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light hover:scale-105 transition-all rounded-sm"
          >
            Book a Group Tour
          </Link>
        </div>
      </div>
    </section>
  );
}

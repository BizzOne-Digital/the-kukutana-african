import Link from "next/link";
import { Gift, Bus, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const OFFERS = [
  {
    icon: Gift,
    title: "Birthday Visit for Seniors",
    description: "Guests 80 and over enjoy a free visit during their birthday month.",
  },
  {
    icon: Bus,
    title: "Tour Bus Package",
    description: "Special 20% discount pricing for chartered tour bus groups.",
  },
  {
    icon: Users,
    title: "Heritage Membership",
    description: "Join our membership program for year-round access and community events.",
  },
];

export default function OffersSection() {
  return (
    <section className="bg-background-brown py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-light mb-4">
            SPECIAL OFFERS &amp; MEMBERSHIPS
          </p>
          <h2 className="font-serif-heading font-medium text-ivory text-[clamp(1.9rem,3.6vw,3rem)]">
            More Ways to Belong.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {OFFERS.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              key={title}
              delay={index * 100}
              className="border border-gold/20 rounded-sm p-8 text-center transition-all hover:-translate-y-1 hover:border-gold/50"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gold/40 text-gold-light mb-5">
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <h3 className="font-serif-heading text-ivory text-lg mb-2">{title}</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{description}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm uppercase tracking-wider border border-gold-light/50 text-cream hover:bg-gold-light/10 hover:scale-105 transition-all rounded-sm"
          >
            View Membership Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}

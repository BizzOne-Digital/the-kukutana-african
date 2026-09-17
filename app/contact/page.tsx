import type { Metadata } from "next";
import { Mail, Phone, Globe } from "lucide-react";
import { getSiteSettings } from "@/lib/data/getSiteSettings";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Kukutana African American History & Culture Museum.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const cards = [
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Phone, label: "Direct Phone", value: settings.directPhone, href: `tel:${settings.directPhone.replace(/[^\d+]/g, "")}` },
    { icon: Globe, label: "Website", value: settings.website, href: settings.website ? `https://${settings.website.replace(/^https?:\/\//, "")}` : undefined },
  ].filter((c) => c.value);

  return (
    <section className="bg-background-dark pt-32 pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="max-w-2xl animate-fade-up">
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-light mb-4">
            CONTACT
          </p>
          <h1 className="font-serif-heading font-medium text-ivory text-[clamp(2.25rem,5vw,3.75rem)]">
            We&rsquo;d Love to Hear From You
          </h1>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1fr_1.3fr] gap-12">
          <div className="space-y-6">
            {cards.map(({ icon: Icon, label, value, href }, index) => (
              <Reveal key={label} delay={index * 100} as="article">
                <a
                  href={href}
                  target={label === "Website" ? "_blank" : undefined}
                  rel={label === "Website" ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 border border-gold/20 rounded-sm p-6 hover:border-gold/50 hover:-translate-y-0.5 transition-all bg-background-brown/30"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gold/40 text-gold-light shrink-0">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</span>
                    <span className="block text-cream break-all">{value}</span>
                  </span>
                </a>
              </Reveal>
            ))}

            {[settings.businessPhone1, settings.businessPhone2, settings.businessPhone3].filter(Boolean).length > 0 && (
              <Reveal delay={cards.length * 100} className="border border-gold/20 rounded-sm p-6 bg-background-brown/30">
                <span className="block text-xs uppercase tracking-wider text-muted mb-3">Museum Business</span>
                <ul className="space-y-2">
                  {[settings.businessPhone1, settings.businessPhone2, settings.businessPhone3]
                    .filter(Boolean)
                    .map((phone) => (
                      <li key={phone}>
                        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-cream hover:text-gold-light">
                          {phone}
                        </a>
                      </li>
                    ))}
                </ul>
              </Reveal>
            )}
          </div>

          <Reveal delay={150} className="border border-gold/15 rounded-sm p-6 sm:p-10 bg-background-brown/30">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { getAllCollections } from "@/lib/data/getCollections";
import CollectionsBrowser from "@/components/services/CollectionsBrowser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services & Collections",
  description:
    "Discover the exhibits and collections at Kukutana African American History & Culture Museum, from Civil Rights history to African royalty.",
};

export default async function ServicesPage() {
  const collections = await getAllCollections();

  return (
    <>
      <section className="relative py-32 sm:py-40 bg-background-dark overflow-hidden pattern-kente">
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14 text-center animate-fade-up">
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-light mb-4">
            OUR COLLECTIONS
          </p>
          <h1 className="font-serif-heading font-medium text-ivory text-[clamp(2.25rem,5vw,4rem)] text-balance">
            Discover the Collections
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-cream/75 leading-relaxed">
            From Civil Rights history to African royalty, explore exhibits designed to educate, honor,
            and inspire.
          </p>
        </div>
      </section>

      <section className="bg-background-dark pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
          <CollectionsBrowser collections={collections} />
        </div>
      </section>
    </>
  );
}

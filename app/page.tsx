import { getHomeContent } from "@/lib/data/getHomeContent";
import { getFeaturedCollections } from "@/lib/data/getCollections";
import { getPricingOptions } from "@/lib/data/getPricing";
import { getFeaturedTestimonials } from "@/lib/data/getTestimonials";

import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import CollectionsShowcase from "@/components/home/CollectionsShowcase";
import ExperienceStats from "@/components/home/ExperienceStats";
import PricingSection from "@/components/home/PricingSection";
import WhyKukutana from "@/components/home/WhyKukutana";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import OffersSection from "@/components/home/OffersSection";
import FinalCta from "@/components/home/FinalCta";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, collections, pricing, testimonials] = await Promise.all([
    getHomeContent(),
    getFeaturedCollections(6),
    getPricingOptions(),
    getFeaturedTestimonials(3),
  ]);

  return (
    <>
      <Hero hero={content.hero} />
      <AboutPreview about={content.aboutPreview} />
      <CollectionsShowcase collections={collections} />
      <ExperienceStats experience={content.experience} />
      <PricingSection options={pricing} notice={content.pricingNotice} />
      <WhyKukutana />
      <TestimonialsSection testimonials={testimonials} />
      <OffersSection />
      <FinalCta finalCta={content.finalCta} />
    </>
  );
}

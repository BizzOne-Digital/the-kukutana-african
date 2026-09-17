"use client";

import { useEffect, useState } from "react";
import LocalImageField from "@/components/admin/LocalImageField";
import type { IHomeContent, IStat } from "@/models/HomeContent";

export default function AdminHomePage() {
  const [content, setContent] = useState<IHomeContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/home-content")
      .then((res) => res.json())
      .then((data) => setContent(data.content));
  }, []);

  function updateHero<K extends keyof IHomeContent["hero"]>(key: K, value: IHomeContent["hero"][K]) {
    setContent((c) => (c ? { ...c, hero: { ...c.hero, [key]: value } } : c));
  }

  function updateAbout<K extends keyof IHomeContent["aboutPreview"]>(key: K, value: IHomeContent["aboutPreview"][K]) {
    setContent((c) => (c ? { ...c, aboutPreview: { ...c.aboutPreview, [key]: value } } : c));
  }

  function updateExperience<K extends keyof IHomeContent["experience"]>(key: K, value: IHomeContent["experience"][K]) {
    setContent((c) => (c ? { ...c, experience: { ...c.experience, [key]: value } } : c));
  }

  function updateStat(index: number, field: keyof IStat, value: string) {
    setContent((c) => {
      if (!c) return c;
      const stats = [...c.experience.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...c, experience: { ...c.experience, stats } };
    });
  }

  function updateFinalCta<K extends keyof IHomeContent["finalCta"]>(key: K, value: IHomeContent["finalCta"][K]) {
    setContent((c) => (c ? { ...c, finalCta: { ...c.finalCta, [key]: value } } : c));
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/home-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!content) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-heading text-ivory text-3xl mb-8">Home Page Content</h1>

      <div className="space-y-8">
        <Section title="Hero Section">
          <Field label="Eyebrow"><input value={content.hero.eyebrow} onChange={(e) => updateHero("eyebrow", e.target.value)} className={inputClasses} /></Field>
          <Field label="Title"><input value={content.hero.title} onChange={(e) => updateHero("title", e.target.value)} className={inputClasses} /></Field>
          <Field label="Italic Title"><input value={content.hero.italicTitle} onChange={(e) => updateHero("italicTitle", e.target.value)} className={inputClasses} /></Field>
          <Field label="Description"><textarea rows={3} value={content.hero.description} onChange={(e) => updateHero("description", e.target.value)} className={inputClasses} /></Field>
          <Field label="Quote"><input value={content.hero.quote} onChange={(e) => updateHero("quote", e.target.value)} className={inputClasses} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA Label"><input value={content.hero.primaryCtaLabel} onChange={(e) => updateHero("primaryCtaLabel", e.target.value)} className={inputClasses} /></Field>
            <Field label="Primary CTA Href"><input value={content.hero.primaryCtaHref} onChange={(e) => updateHero("primaryCtaHref", e.target.value)} className={inputClasses} /></Field>
            <Field label="Secondary CTA Label"><input value={content.hero.secondaryCtaLabel} onChange={(e) => updateHero("secondaryCtaLabel", e.target.value)} className={inputClasses} /></Field>
            <Field label="Secondary CTA Href"><input value={content.hero.secondaryCtaHref} onChange={(e) => updateHero("secondaryCtaHref", e.target.value)} className={inputClasses} /></Field>
          </div>
          <LocalImageField label="Hero Main Image" folder="pages" value={content.hero.heroMainImage} onChange={(url) => updateHero("heroMainImage", url)} recommendedSize="1920x1080px" />
          <LocalImageField label="Hero Artifact Image" folder="pages" value={content.hero.heroArtifactImage} onChange={(url) => updateHero("heroArtifactImage", url)} />
          <LocalImageField label="Hero Portrait Image 1" folder="pages" value={content.hero.heroPortraitImage1} onChange={(url) => updateHero("heroPortraitImage1", url)} />
          <LocalImageField label="Hero Portrait Image 2" folder="pages" value={content.hero.heroPortraitImage2} onChange={(url) => updateHero("heroPortraitImage2", url)} />
          <LocalImageField label="Hero Accent Image" folder="pages" value={content.hero.heroAccentImage} onChange={(url) => updateHero("heroAccentImage", url)} />
        </Section>

        <Section title="About Preview Section">
          <Field label="Eyebrow"><input value={content.aboutPreview.eyebrow} onChange={(e) => updateAbout("eyebrow", e.target.value)} className={inputClasses} /></Field>
          <Field label="Title"><input value={content.aboutPreview.title} onChange={(e) => updateAbout("title", e.target.value)} className={inputClasses} /></Field>
          <Field label="Description"><textarea rows={4} value={content.aboutPreview.description} onChange={(e) => updateAbout("description", e.target.value)} className={inputClasses} /></Field>
          <Field label="Quote"><input value={content.aboutPreview.quote} onChange={(e) => updateAbout("quote", e.target.value)} className={inputClasses} /></Field>
          <Field label="CTA Label"><input value={content.aboutPreview.ctaLabel} onChange={(e) => updateAbout("ctaLabel", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Image" folder="pages" value={content.aboutPreview.image} onChange={(url) => updateAbout("image", url)} />
        </Section>

        <Section title="Experience / Statistics Section">
          <Field label="Heading"><input value={content.experience.heading} onChange={(e) => updateExperience("heading", e.target.value)} className={inputClasses} /></Field>
          <Field label="Description"><textarea rows={3} value={content.experience.description} onChange={(e) => updateExperience("description", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Background Image" folder="pages" value={content.experience.image} onChange={(url) => updateExperience("image", url)} />
          <div className="grid grid-cols-2 gap-4">
            {content.experience.stats.map((stat, i) => (
              <div key={i} className="border border-gold/10 rounded-sm p-3 space-y-2">
                <input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="Value" className={inputClasses} />
                <input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Label" className={inputClasses} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Pricing Notice">
          <Field label="Notice Text">
            <input
              value={content.pricingNotice}
              onChange={(e) => setContent((c) => (c ? { ...c, pricingNotice: e.target.value } : c))}
              className={inputClasses}
            />
          </Field>
        </Section>

        <Section title="Final CTA Section">
          <Field label="Heading"><input value={content.finalCta.heading} onChange={(e) => updateFinalCta("heading", e.target.value)} className={inputClasses} /></Field>
          <Field label="Subheading"><input value={content.finalCta.subheading} onChange={(e) => updateFinalCta("subheading", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Background Image" folder="pages" value={content.finalCta.image} onChange={(url) => updateFinalCta("image", url)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA Label"><input value={content.finalCta.primaryCtaLabel} onChange={(e) => updateFinalCta("primaryCtaLabel", e.target.value)} className={inputClasses} /></Field>
            <Field label="Primary CTA Href"><input value={content.finalCta.primaryCtaHref} onChange={(e) => updateFinalCta("primaryCtaHref", e.target.value)} className={inputClasses} /></Field>
            <Field label="Secondary CTA Label"><input value={content.finalCta.secondaryCtaLabel} onChange={(e) => updateFinalCta("secondaryCtaLabel", e.target.value)} className={inputClasses} /></Field>
            <Field label="Secondary CTA Href"><input value={content.finalCta.secondaryCtaHref} onChange={(e) => updateFinalCta("secondaryCtaHref", e.target.value)} className={inputClasses} /></Field>
          </div>
        </Section>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Home Content"}
          </button>
          {saved && <span className="text-green-400 text-sm">Saved successfully</span>}
        </div>
      </div>
    </div>
  );
}

const inputClasses =
  "w-full bg-background-dark/50 border border-gold/20 rounded-sm px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-gold";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gold/20 rounded-sm p-6 bg-background-brown/30 space-y-5">
      <h2 className="font-serif-heading text-gold-light text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">{label}</span>
      {children}
    </label>
  );
}

"use client";

import { useEffect, useState } from "react";
import LocalImageField from "@/components/admin/LocalImageField";
import type { IAboutContent, ITimelineItem } from "@/models/AboutContent";

export default function AdminAboutPage() {
  const [content, setContent] = useState<IAboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/about-content")
      .then((res) => res.json())
      .then((data) => setContent(data.content));
  }, []);

  function update<K extends keyof IAboutContent>(key: K, value: IAboutContent[K]) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
  }

  function updateImage<K extends keyof IAboutContent["images"]>(key: K, value: string) {
    setContent((c) => (c ? { ...c, images: { ...c.images, [key]: value } } : c));
  }

  function updateTimeline(index: number, field: keyof ITimelineItem, value: string) {
    setContent((c) => {
      if (!c) return c;
      const timeline = [...c.timeline];
      timeline[index] = { ...timeline[index], [field]: value };
      return { ...c, timeline };
    });
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/about-content", {
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
      <h1 className="font-serif-heading text-ivory text-3xl mb-8">About Page Content</h1>

      <div className="space-y-8">
        <Section title="Hero">
          <Field label="Eyebrow"><input value={content.heroEyebrow} onChange={(e) => update("heroEyebrow", e.target.value)} className={inputClasses} /></Field>
          <Field label="Title"><input value={content.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Hero Image" folder="pages" value={content.heroImage} onChange={(url) => update("heroImage", url)} />
        </Section>

        <Section title="Core Narrative">
          <Field label="Introduction"><textarea rows={4} value={content.introduction} onChange={(e) => update("introduction", e.target.value)} className={inputClasses} /></Field>
          <Field label="Meaning of Kukutana"><textarea rows={3} value={content.meaningOfKukutana} onChange={(e) => update("meaningOfKukutana", e.target.value)} className={inputClasses} /></Field>
          <Field label="Mission"><textarea rows={3} value={content.mission} onChange={(e) => update("mission", e.target.value)} className={inputClasses} /></Field>
          <Field label="Vision"><textarea rows={3} value={content.vision} onChange={(e) => update("vision", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Mission Image" folder="pages" value={content.images.mission} onChange={(url) => updateImage("mission", url)} />
        </Section>

        <Section title="Impact & Preservation">
          <Field label="Community Impact"><textarea rows={3} value={content.communityImpact} onChange={(e) => update("communityImpact", e.target.value)} className={inputClasses} /></Field>
          <Field label="Educational Mission"><textarea rows={3} value={content.educationalMission} onChange={(e) => update("educationalMission", e.target.value)} className={inputClasses} /></Field>
          <Field label="Preservation Mission"><textarea rows={3} value={content.preservationMission} onChange={(e) => update("preservationMission", e.target.value)} className={inputClasses} /></Field>
          <Field label="Legacy"><textarea rows={3} value={content.legacy} onChange={(e) => update("legacy", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Community Image" folder="pages" value={content.images.community} onChange={(url) => updateImage("community", url)} />
        </Section>

        <Section title="Timeline">
          {content.timeline.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 border border-gold/10 rounded-sm p-3">
              <input value={item.year} onChange={(e) => updateTimeline(i, "year", e.target.value)} placeholder="Year" className={inputClasses} />
              <input value={item.title} onChange={(e) => updateTimeline(i, "title", e.target.value)} placeholder="Title" className={inputClasses} />
              <input value={item.description} onChange={(e) => updateTimeline(i, "description", e.target.value)} placeholder="Description" className={inputClasses} />
            </div>
          ))}
        </Section>

        <Section title="Future Vision">
          <Field label="Future Vision"><textarea rows={3} value={content.futureVision} onChange={(e) => update("futureVision", e.target.value)} className={inputClasses} /></Field>
          <Field label="Future Home Story"><textarea rows={3} value={content.futureHomeStory} onChange={(e) => update("futureHomeStory", e.target.value)} className={inputClasses} /></Field>
          <LocalImageField label="Future Image" folder="pages" value={content.images.future} onChange={(url) => updateImage("future", url)} />
        </Section>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save About Content"}
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

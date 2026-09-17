"use client";

import { useEffect, useState } from "react";
import LocalImageField from "@/components/admin/LocalImageField";
import type { ISiteSettings } from "@/models/SiteSettings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<ISiteSettings> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings));
  }, []);

  function update<K extends keyof ISiteSettings>(key: K, value: ISiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!settings) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-heading text-ivory text-3xl mb-8">Site Settings</h1>

      <div className="space-y-8">
        <Section title="Branding">
          <LocalImageField label="Logo" folder="pages" value={settings.logoUrl} onChange={(url) => update("logoUrl", url)} recommendedSize="Square, transparent PNG" />
          <LocalImageField label="Favicon" folder="pages" value={settings.faviconUrl} onChange={(url) => update("faviconUrl", url)} recommendedSize="512x512px" />
          <Field label="Museum Name">
            <input value={settings.museumName || ""} onChange={(e) => update("museumName", e.target.value)} className={inputClasses} />
          </Field>
          <Field label="Short Museum Name">
            <input value={settings.shortMuseumName || ""} onChange={(e) => update("shortMuseumName", e.target.value)} className={inputClasses} />
          </Field>
        </Section>

        <Section title="Contact">
          <Field label="Email"><input value={settings.email || ""} onChange={(e) => update("email", e.target.value)} className={inputClasses} /></Field>
          <Field label="Direct Phone"><input value={settings.directPhone || ""} onChange={(e) => update("directPhone", e.target.value)} className={inputClasses} /></Field>
          <Field label="Business Phone 1"><input value={settings.businessPhone1 || ""} onChange={(e) => update("businessPhone1", e.target.value)} className={inputClasses} /></Field>
          <Field label="Business Phone 2"><input value={settings.businessPhone2 || ""} onChange={(e) => update("businessPhone2", e.target.value)} className={inputClasses} /></Field>
          <Field label="Business Phone 3"><input value={settings.businessPhone3 || ""} onChange={(e) => update("businessPhone3", e.target.value)} className={inputClasses} /></Field>
          <Field label="Website"><input value={settings.website || ""} onChange={(e) => update("website", e.target.value)} className={inputClasses} /></Field>
        </Section>

        <Section title="Social Links">
          <Field label="Facebook"><input value={settings.facebook || ""} onChange={(e) => update("facebook", e.target.value)} className={inputClasses} /></Field>
          <Field label="Instagram"><input value={settings.instagram || ""} onChange={(e) => update("instagram", e.target.value)} className={inputClasses} /></Field>
          <Field label="TikTok"><input value={settings.tiktok || ""} onChange={(e) => update("tiktok", e.target.value)} className={inputClasses} /></Field>
          <Field label="YouTube"><input value={settings.youtube || ""} onChange={(e) => update("youtube", e.target.value)} className={inputClasses} /></Field>
          <Field label="LinkedIn"><input value={settings.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} className={inputClasses} /></Field>
        </Section>

        <Section title="History Audio">
          <Field label="Audio URL"><input value={settings.historyAudioUrl || ""} onChange={(e) => update("historyAudioUrl", e.target.value)} className={inputClasses} /></Field>
          <label className="flex items-center gap-2 text-sm text-cream/80">
            <input type="checkbox" checked={!!settings.enableHistoryAudio} onChange={(e) => update("enableHistoryAudio", e.target.checked)} />
            Enable &ldquo;Listen to History&rdquo; audio control
          </label>
        </Section>

        <Section title="SEO">
          <Field label="SEO Title"><input value={settings.seoTitle || ""} onChange={(e) => update("seoTitle", e.target.value)} className={inputClasses} /></Field>
          <Field label="SEO Description"><textarea rows={3} value={settings.seoDescription || ""} onChange={(e) => update("seoDescription", e.target.value)} className={inputClasses} /></Field>
        </Section>

        <Section title="Footer">
          <Field label="Footer Text"><input value={settings.footerText || ""} onChange={(e) => update("footerText", e.target.value)} className={inputClasses} /></Field>
        </Section>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Settings"}
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

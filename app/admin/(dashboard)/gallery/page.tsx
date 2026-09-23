"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import LocalImageField from "@/components/admin/LocalImageField";
import MuseumImage from "@/components/ui/MuseumImage";
import type { IGalleryPhoto } from "@/models/GalleryPhoto";

const CATEGORIES = ["Museum Photos", "Visitor Photos", "Events"] as const;

type FormState = {
  _id?: string;
  imageUrl: string;
  caption: string;
  category: (typeof CATEGORIES)[number];
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  imageUrl: "",
  caption: "",
  category: "Museum Photos",
  featured: false,
  active: true,
  sortOrder: 0,
};

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<IGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/gallery?admin=true");
    const data = await res.json();
    setPhotos(data.photos || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: IGalleryPhoto) {
    setForm({ ...item, _id: item._id });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.imageUrl) {
      setError("Please upload a photo before saving.");
      return;
    }
    setSaving(true);
    setError("");
    const isEdit = !!form._id;
    const res = await fetch(isEdit ? `/api/gallery/${form._id}` : "/api/gallery", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.error || "Failed to save photo.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif-heading text-ivory text-3xl">Photo Gallery</h1>
          <p className="text-sm text-muted mt-1">
            Add photos of museum visits, exhibits, and events for the public Testimonials page.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm shrink-0"
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {!loading && photos.length === 0 && <p className="text-muted">No photos uploaded yet.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div key={photo._id} className="relative group border border-gold/15 rounded-sm overflow-hidden aspect-square">
            <MuseumImage src={photo.imageUrl} alt={photo.caption || "Museum photo"} fill sizes="200px" className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button onClick={() => openEdit(photo)} className="text-white">
                <Pencil size={18} />
              </button>
              <button onClick={() => setConfirmDeleteId(photo._id)} className="text-white">
                <Trash2 size={18} />
              </button>
            </div>
            <span className="absolute bottom-1 left-1 text-[9px] bg-background-dark/80 text-gold-light px-1.5 py-0.5 rounded-sm">
              {photo.category}
            </span>
            {!photo.active && (
              <span className="absolute top-1 right-1 text-[9px] bg-red-900/80 text-red-200 px-1.5 py-0.5 rounded-sm">
                Hidden
              </span>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-background-brown border border-gold/25 rounded-sm p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-heading text-ivory text-xl">{form._id ? "Edit Photo" : "Add Photo"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-cream/60"><X size={20} /></button>
            </div>

            <div className="space-y-5">
              <LocalImageField
                label="Photo"
                folder="gallery"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                recommendedSize="1200x1200px, JPG/PNG/WEBP up to 8MB"
              />
              <FormRow label="Caption">
                <input
                  value={form.caption}
                  onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  className={inputClasses}
                  placeholder="e.g. School group visiting the Civil Rights exhibit"
                />
              </FormRow>
              <FormRow label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FormState["category"] }))}
                  className={inputClasses}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormRow>

              <div className="grid grid-cols-2 gap-5">
                <FormRow label="Sort Order">
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className={inputClasses}
                  />
                </FormRow>
                <div className="flex items-end gap-6 pb-2">
                  <label className="flex items-center gap-2 text-sm text-cream/80">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-cream/80">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    />
                    Visible on site
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider border border-gold/30 text-cream rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark rounded-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background-brown border border-gold/25 rounded-sm p-6">
            <p className="text-cream mb-6">Delete this photo? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider border border-gold/30 text-cream rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-xs uppercase tracking-wider bg-red-500/80 text-white rounded-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClasses =
  "w-full bg-background-dark/50 border border-gold/20 rounded-sm px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-gold";

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">{label}</span>
      {children}
    </label>
  );
}

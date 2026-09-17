"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import LocalImageField from "@/components/admin/LocalImageField";
import { COLLECTION_CATEGORIES } from "@/lib/constants";
import type { ICollection } from "@/models/Collection";

type FormState = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: COLLECTION_CATEGORIES[0],
  imageUrl: "",
  featured: false,
  active: true,
  sortOrder: 0,
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/collections?admin=true");
    const data = await res.json();
    setCollections(data.collections || []);
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

  function openEdit(item: ICollection) {
    setForm({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      shortDescription: item.shortDescription,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      featured: item.featured,
      active: item.active,
      sortOrder: item.sortOrder,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const payload = { ...form, slug: form.slug || slugify(form.title) };
    const isEdit = !!form._id;

    const res = await fetch(isEdit ? `/api/collections/${form._id}` : "/api/collections", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.error || "Failed to save collection.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/collections/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif-heading text-ivory text-3xl">Collections</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm"
        >
          <Plus size={16} /> New Collection
        </button>
      </div>

      <div className="border border-gold/20 rounded-sm overflow-x-auto bg-background-brown/30">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-gold/15">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">Loading...</td>
              </tr>
            )}
            {!loading && collections.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">No collections yet.</td>
              </tr>
            )}
            {collections.map((item) => (
              <tr key={item._id} className="text-cream/85">
                <td className="px-5 py-3">{item.title}</td>
                <td className="px-5 py-3">{item.category}</td>
                <td className="px-5 py-3">{item.featured ? "Yes" : "No"}</td>
                <td className="px-5 py-3">{item.active ? "Yes" : "No"}</td>
                <td className="px-5 py-3">{item.sortOrder}</td>
                <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => openEdit(item)} className="text-gold-light hover:text-gold-light/80">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setConfirmDeleteId(item._id)} className="text-red-300 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-background-brown border border-gold/25 rounded-sm p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-heading text-ivory text-xl">
                {form._id ? "Edit Collection" : "New Collection"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-cream/60 hover:text-cream">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <FormRow label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClasses}
                />
              </FormRow>
              <FormRow label="Slug (auto-generated if blank)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={inputClasses}
                  placeholder={slugify(form.title)}
                />
              </FormRow>
              <FormRow label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={inputClasses}
                >
                  {COLLECTION_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormRow>
              <FormRow label="Short Description">
                <input
                  value={form.shortDescription}
                  onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                  className={inputClasses}
                />
              </FormRow>
              <FormRow label="Description">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClasses}
                />
              </FormRow>

              <LocalImageField
                label="Cover Image"
                folder="gallery"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                recommendedSize="1000x1250px portrait"
              />

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
                    Active
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
                  disabled={saving || !form.title}
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
            <p className="text-cream mb-6">Delete this collection? This cannot be undone.</p>
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

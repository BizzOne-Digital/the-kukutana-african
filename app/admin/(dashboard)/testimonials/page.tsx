"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import LocalImageField from "@/components/admin/LocalImageField";
import type { ITestimonial } from "@/models/Testimonial";

type FormState = {
  _id?: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  photo: string;
  featured: boolean;
  order: number;
};

const emptyForm: FormState = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
  photo: "",
  featured: false,
  order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials?admin=true");
    const data = await res.json();
    setTestimonials(data.testimonials || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: ITestimonial) {
    setForm({ ...item, _id: item._id });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const isEdit = !!form._id;
    await fetch(isEdit ? `/api/testimonials/${form._id}` : "/api/testimonials", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif-heading text-ivory text-3xl">Testimonials</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm">
          <Plus size={16} /> New Testimonial
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-muted">Loading...</p>}
        {!loading && testimonials.length === 0 && <p className="text-muted">No testimonials yet.</p>}
        {testimonials.map((t) => (
          <div key={t._id} className="border border-gold/20 rounded-sm p-5 bg-background-brown/30">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={i < t.rating ? "fill-gold text-gold" : "text-brown/30"} />
              ))}
            </div>
            <p className="text-sm text-cream/80 italic line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-cream">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
              <div className="flex items-center gap-2">
                {t.featured && <span className="text-[10px] uppercase text-gold-light border border-gold/40 px-2 py-0.5 rounded-sm">Featured</span>}
                <button onClick={() => openEdit(t)} className="text-gold-light"><Pencil size={15} /></button>
                <button onClick={() => setConfirmDeleteId(t._id)} className="text-red-300"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-background-brown border border-gold/25 rounded-sm p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-heading text-ivory text-xl">{form._id ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-cream/60"><X size={20} /></button>
            </div>
            <div className="space-y-5">
              <FormRow label="Name">
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClasses} />
              </FormRow>
              <FormRow label="Role">
                <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className={inputClasses} />
              </FormRow>
              <FormRow label="Quote">
                <textarea rows={4} value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} className={inputClasses} />
              </FormRow>
              <LocalImageField label="Photo" folder="gallery" value={form.photo} onChange={(url) => setForm((f) => ({ ...f, photo: url }))} recommendedSize="200x200px square" />
              <div className="grid grid-cols-3 gap-5 items-end">
                <FormRow label="Rating (1-5)">
                  <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} className={inputClasses} />
                </FormRow>
                <FormRow label="Order">
                  <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className={inputClasses} />
                </FormRow>
                <label className="flex items-center gap-2 text-sm text-cream/80 pb-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} /> Featured
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-xs uppercase tracking-wider border border-gold/30 text-cream rounded-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name || !form.quote} className="px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark rounded-sm disabled:opacity-50">
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
            <p className="text-cream mb-6">Delete this testimonial?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-xs uppercase tracking-wider border border-gold/30 text-cream rounded-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="px-4 py-2 text-xs uppercase tracking-wider bg-red-500/80 text-white rounded-sm">Delete</button>
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

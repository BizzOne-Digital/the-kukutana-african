"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { IPricingOption } from "@/models/PricingOption";

type FormState = {
  _id?: string;
  title: string;
  price: string;
  subtitle: string;
  description: string;
  discount: string;
  free: boolean;
  active: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  title: "",
  price: "",
  subtitle: "",
  description: "",
  discount: "",
  free: false,
  active: true,
  sortOrder: 0,
};

export default function AdminPricingPage() {
  const [options, setOptions] = useState<IPricingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/pricing?admin=true");
    const data = await res.json();
    setOptions(data.options || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: IPricingOption) {
    setForm({ ...item, _id: item._id });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const isEdit = !!form._id;
    await fetch(isEdit ? `/api/pricing/${form._id}` : "/api/pricing", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/pricing/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif-heading text-ivory text-3xl">Pricing</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm"
        >
          <Plus size={16} /> New Option
        </button>
      </div>

      <div className="border border-gold/20 rounded-sm overflow-x-auto bg-background-brown/30">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-gold/15">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Discount</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">Loading...</td></tr>
            )}
            {!loading && options.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No pricing options yet.</td></tr>
            )}
            {options.map((item) => (
              <tr key={item._id} className="text-cream/85">
                <td className="px-5 py-3">{item.title}</td>
                <td className="px-5 py-3">{item.free ? "FREE" : item.price}</td>
                <td className="px-5 py-3">{item.discount}</td>
                <td className="px-5 py-3">{item.active ? "Yes" : "No"}</td>
                <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => openEdit(item)} className="text-gold-light"><Pencil size={16} /></button>
                  <button onClick={() => setConfirmDeleteId(item._id)} className="text-red-300"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-background-brown border border-gold/25 rounded-sm p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-heading text-ivory text-xl">{form._id ? "Edit Option" : "New Option"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-cream/60"><X size={20} /></button>
            </div>
            <div className="space-y-5">
              <FormRow label="Title">
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClasses} />
              </FormRow>
              <FormRow label="Price (e.g. $22)">
                <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputClasses} />
              </FormRow>
              <FormRow label="Discount (e.g. 10% Discount)">
                <input value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} className={inputClasses} />
              </FormRow>
              <FormRow label="Subtitle / Description">
                <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className={inputClasses} />
              </FormRow>
              <div className="grid grid-cols-2 gap-5">
                <FormRow label="Sort Order">
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className={inputClasses} />
                </FormRow>
                <div className="flex items-end gap-6 pb-2">
                  <label className="flex items-center gap-2 text-sm text-cream/80">
                    <input type="checkbox" checked={form.free} onChange={(e) => setForm((f) => ({ ...f, free: e.target.checked }))} /> Free
                  </label>
                  <label className="flex items-center gap-2 text-sm text-cream/80">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} /> Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-xs uppercase tracking-wider border border-gold/30 text-cream rounded-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title} className="px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark rounded-sm disabled:opacity-50">
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
            <p className="text-cream mb-6">Delete this pricing option?</p>
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

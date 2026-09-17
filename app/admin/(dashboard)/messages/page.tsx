"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import type { IContactSubmission } from "@/models/ContactSubmission";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/contact");
    const data = await res.json();
    setMessages(data.submissions || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    load();
  }

  return (
    <div>
      <h1 className="font-serif-heading text-ivory text-3xl mb-8">Contact Messages</h1>

      <div className="space-y-3">
        {loading && <p className="text-muted">Loading...</p>}
        {!loading && messages.length === 0 && <p className="text-muted">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m._id} className={`border rounded-sm p-5 ${m.read ? "border-gold/10 bg-background-brown/20" : "border-gold/30 bg-background-brown/40"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-cream font-medium">{m.name} {!m.read && <span className="ml-2 text-[10px] uppercase text-gold-light border border-gold/40 px-2 py-0.5 rounded-sm">New</span>}</p>
                <p className="text-xs text-muted">{m.email} {m.phone && `· ${m.phone}`}</p>
                {m.subject && <p className="text-sm text-gold-light mt-1">{m.subject}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleRead(m._id, !m.read)} className="text-gold-light" title={m.read ? "Mark unread" : "Mark read"}>
                  {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                <button onClick={() => setConfirmDeleteId(m._id)} className="text-red-300"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="mt-3 text-sm text-cream/80 leading-relaxed">{m.message}</p>
            <p className="mt-2 text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background-brown border border-gold/25 rounded-sm p-6">
            <p className="text-cream mb-6">Delete this message?</p>
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

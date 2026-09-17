"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, X } from "lucide-react";
import { BOOKING_STATUSES, GROUP_TYPES } from "@/lib/constants";
import type { IBooking } from "@/models/Booking";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [groupType, setGroupType] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IBooking | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (groupType !== "all") params.set("groupType", groupType);
    if (search) params.set("search", search);

    const res = await fetch(`/api/bookings?${params.toString()}`);
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }, [status, groupType, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
    if (selected && selected._id === id) {
      setSelected({ ...selected, status: newStatus as IBooking["status"] });
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    setSelected(null);
    load();
  }

  return (
    <div>
      <h1 className="font-serif-heading text-ivory text-3xl mb-8">Bookings</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Search name, org, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-background-brown/50 border border-gold/20 rounded-sm px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-background-brown/50 border border-gold/20 rounded-sm px-3 py-2 text-sm text-cream">
          <option value="all">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={groupType} onChange={(e) => setGroupType(e.target.value)} className="bg-background-brown/50 border border-gold/20 rounded-sm px-3 py-2 text-sm text-cream">
          <option value="all">All Group Types</option>
          {GROUP_TYPES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="border border-gold/20 rounded-sm overflow-x-auto bg-background-brown/30">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-gold/15">
              <th className="px-5 py-3">Guest / Org</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Group Type</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Preferred Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {loading && <tr><td colSpan={9} className="px-5 py-8 text-center text-muted">Loading...</td></tr>}
            {!loading && bookings.length === 0 && <tr><td colSpan={9} className="px-5 py-8 text-center text-muted">No bookings found.</td></tr>}
            {bookings.map((b) => (
              <tr key={b._id} className="text-cream/85 cursor-pointer hover:bg-gold/5" onClick={() => setSelected(b)}>
                <td className="px-5 py-3">
                  <p>{b.fullName}</p>
                  {b.organization && <p className="text-xs text-muted">{b.organization}</p>}
                </td>
                <td className="px-5 py-3">{b.email}</td>
                <td className="px-5 py-3">{b.phone}</td>
                <td className="px-5 py-3">{b.groupType}</td>
                <td className="px-5 py-3">{b.numberOfGuests}</td>
                <td className="px-5 py-3">{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <select
                    value={b.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="bg-background-dark/50 border border-gold/20 rounded-sm px-2 py-1 text-xs text-gold-light"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-xs text-muted">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setConfirmDeleteId(b._id)} className="text-red-300"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-background-brown border border-gold/25 rounded-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-heading text-ivory text-xl">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-cream/60"><X size={20} /></button>
            </div>
            <dl className="space-y-3 text-sm">
              <Detail label="Full Name" value={selected.fullName} />
              <Detail label="Organization" value={selected.organization || "—"} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Group Type" value={selected.groupType} />
              <Detail label="Guests" value={String(selected.numberOfGuests)} />
              <Detail label="Preferred Date" value={new Date(selected.preferredDate).toLocaleDateString()} />
              {selected.alternateDate && <Detail label="Alternate Date" value={new Date(selected.alternateDate).toLocaleDateString()} />}
              <Detail label="Preferred Time" value={selected.preferredTime || "—"} />
              <Detail label="Special Requirements" value={selected.specialRequirements || "—"} />
              <Detail label="Message" value={selected.message || "—"} />
              <Detail label="Status" value={selected.status} />
            </dl>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background-brown border border-gold/25 rounded-sm p-6">
            <p className="text-cream mb-6">Delete this booking?</p>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gold/10 pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-cream text-right">{value}</dd>
    </div>
  );
}

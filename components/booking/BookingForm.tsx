"use client";

import { FormEvent, useState } from "react";
import { GROUP_TYPES } from "@/lib/constants";

interface FormState {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  groupType: string;
  numberOfGuests: string;
  preferredDate: string;
  alternateDate: string;
  preferredTime: string;
  message: string;
  specialRequirements: string;
  website: string;
}

const initialState: FormState = {
  fullName: "",
  organization: "",
  email: "",
  phone: "",
  groupType: GROUP_TYPES[0],
  numberOfGuests: "",
  preferredDate: "",
  alternateDate: "",
  preferredTime: "",
  message: "",
  specialRequirements: "",
  website: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const guests = Number(form.numberOfGuests);
    if (!guests || guests < 15) {
      setError("Group tours currently require 15 or more guests.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, numberOfGuests: guests }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialState);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-gold/30 rounded-sm p-10 text-center bg-background-brown/40">
        <h3 className="font-serif-heading text-gold-light text-2xl mb-3">Request Received</h3>
        <p className="text-cream/75 leading-relaxed">
          Thank you for your interest in visiting Kukutana. Our team will contact you shortly to
          confirm your group tour details.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider border border-gold-light/50 text-cream hover:bg-gold-light/10 transition-colors rounded-sm"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Full Name" required>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Organization">
          <input
            type="text"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Phone" required>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Group Type" required>
          <select
            required
            value={form.groupType}
            onChange={(e) => update("groupType", e.target.value)}
            className={inputClasses}
          >
            {GROUP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Number of Guests (15 minimum)" required>
          <input
            type="number"
            min={1}
            required
            value={form.numberOfGuests}
            onChange={(e) => update("numberOfGuests", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Field label="Preferred Date" required>
          <input
            type="date"
            required
            value={form.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Alternate Date">
          <input
            type="date"
            value={form.alternateDate}
            onChange={(e) => update("alternateDate", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Preferred Time">
          <input
            type="time"
            value={form.preferredTime}
            onChange={(e) => update("preferredTime", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label="Special Requirements">
        <input
          type="text"
          value={form.specialRequirements}
          onChange={(e) => update("specialRequirements", e.target.value)}
          className={inputClasses}
          placeholder="Accessibility needs, dietary considerations, etc."
        />
      </Field>

      <Field label="Message">
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputClasses}
        />
      </Field>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Submit Booking Request"}
      </button>
    </form>
  );
}

const inputClasses =
  "w-full bg-background-brown/50 border border-gold/20 rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

"use client";

import { FormEvent, useState } from "react";

const initialState = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof initialState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        <h3 className="font-serif-heading text-gold-light text-2xl mb-3">Message Sent</h3>
        <p className="text-cream/75 leading-relaxed">
          Thank you for reaching out. Our team will respond as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider border border-gold-light/50 text-cream hover:bg-gold-light/10 transition-colors rounded-sm"
        >
          Send Another Message
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
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">
            Name <span className="text-gold">*</span>
          </span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClasses}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">
            Email <span className="text-gold">*</span>
          </span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClasses}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">Subject</span>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">
          Message <span className="text-gold">*</span>
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputClasses}
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

const inputClasses =
  "w-full bg-background-brown/50 border border-gold/20 rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold transition-colors";

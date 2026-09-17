"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark pattern-kente px-5">
      <div className="w-full max-w-md border border-gold/20 rounded-sm p-8 sm:p-10 bg-background-brown/40">
        <div className="flex justify-center mb-8">
          <Logo variant="compact" />
        </div>
        <h1 className="font-serif-heading text-ivory text-2xl text-center mb-2">Admin Login</h1>
        <p className="text-center text-sm text-muted mb-8">Sign in to manage the museum website.</p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background-dark/60 border border-gold/20 rounded-sm px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-cream/70 mb-2">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark/60 border border-gold/20 rounded-sm px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

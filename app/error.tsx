"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background-dark px-5 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light mb-4">Something Went Wrong</p>
        <h1 className="font-serif-heading text-ivory text-3xl sm:text-4xl mb-6">
          We Encountered an Issue
        </h1>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center px-8 py-4 text-sm uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background-dark px-5 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light mb-4">404</p>
        <h1 className="font-serif-heading text-ivory text-3xl sm:text-4xl mb-4">
          This Page Could Not Be Found
        </h1>
        <p className="text-cream/70 mb-8">The page you are looking for may have been moved or no longer exists.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-sm uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

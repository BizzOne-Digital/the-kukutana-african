export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border border-gold/30 border-t-gold animate-spin" />
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light">Loading</p>
      </div>
    </div>
  );
}

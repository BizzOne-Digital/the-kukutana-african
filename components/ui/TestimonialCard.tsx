import { Star } from "lucide-react";
import MuseumImage from "@/components/ui/MuseumImage";
import type { ITestimonial } from "@/models/Testimonial";

export default function TestimonialCard({ testimonial }: { testimonial: ITestimonial }) {
  return (
    <div className="bg-white/70 border border-brown/10 rounded-sm p-8 flex flex-col h-full shadow-sm">
      <div className="flex items-center gap-1 mb-5" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < testimonial.rating ? "fill-gold text-gold" : "text-brown/20"}
          />
        ))}
      </div>
      <p className="text-text-dark/80 leading-relaxed italic font-serif-heading text-lg flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-brown/10">
          <MuseumImage src={testimonial.photo} alt={testimonial.name} fill sizes="44px" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-dark">{testimonial.name}</p>
          {testimonial.role && <p className="text-xs text-text-dark/60">{testimonial.role}</p>}
        </div>
      </div>
    </div>
  );
}

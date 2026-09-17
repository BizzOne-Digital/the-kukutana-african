import { BookOpen, Landmark, Users, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const PILLARS = [
  {
    icon: Landmark,
    title: "Preserve History",
    description: "Safeguarding artifacts, documents, and testimonies for generations to come.",
  },
  {
    icon: BookOpen,
    title: "Educate Generations",
    description: "Building immersive learning experiences that bring history to life for every age.",
  },
  {
    icon: Sparkles,
    title: "Celebrate Culture",
    description: "Honoring the art, achievement, and resilience of African American culture.",
  },
  {
    icon: Users,
    title: "Strengthen Community",
    description: "Creating a shared space for dialogue, reflection, and connection across generations.",
  },
];

export default function WhyKukutana() {
  return (
    <section className="relative bg-background-dark py-20 sm:py-28 pattern-kente">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal>
          <SectionHeading eyebrow="WHY KUKUTANA" title="A Mission Rooted in Purpose." dark align="center" />
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              key={title}
              delay={index * 100}
              className="group border border-gold/15 hover:border-gold/50 rounded-sm p-8 text-center transition-all hover:-translate-y-1 bg-background-brown/40"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold/40 text-gold-light mb-6 transition-colors group-hover:bg-gold group-hover:text-text-dark">
                <Icon size={26} strokeWidth={1.5} />
              </span>
              <h3 className="font-serif-heading text-ivory text-lg mb-3">{title}</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Check } from "lucide-react";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";

const POINTS = [
  { title: "Founder Led", desc: "A team that thinks like owners, not just ticket-takers — decisions made with technical and business expertise." },
  { title: "Speed to Market", desc: "We move fast without cutting the corners that come back to bite you later." },
  { title: "Privacy, Security & Scalability", desc: "Built to protect your data today and hold up as you grow tomorrow." },
  { title: "AI Ready", desc: "Every build considers where AI can genuinely help, not where it's just a buzzword." },
  { title: "Transparent Comms", desc: "You always know what's shipped, what's next, and what's blocking it." },
];

export default function WhyAllySoft() {
  return (
    <section 
      id="why-ally" 
      className="relative md:h-screen w-full flex items-center justify-center py-24 md:py-0 overflow-hidden backdrop-blur-[2px]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center w-full">
        <div className="bg-panel border border-line rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <Reveal x={-40} className="mb-10">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">Why Ally Soft</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Built different, on purpose</h2>
          </Reveal>

          <div className="space-y-1">
            {POINTS.map((p, i) => (
              <Reveal
                key={p.title}
                x={-30}
                delay={i * 0.08}
                duration={0.7}
                className="flex gap-4 py-4 border-b border-line last:border-none"
              >
                <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                  <Check size={13} strokeWidth={3} />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-sm sm:text-base">{p.title}</h3>
                  <p className="text-slate-100 text-sm mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal x={50} z={100} className="scene">
          <Tilt3D strength={8}>
            <div className="relative aspect-square rounded-3xl bg-panel border border-line overflow-hidden flex flex-col items-center justify-center">
              <img 
                src="/idea-implementation.jpg" 
                alt="Idea to Implementation Tech Stack Map" 
                className="w-full h-full object-cover relative z-10" 
              />
            </div>
          </Tilt3D>
        </Reveal>
      </div>
    </section>
  );
}

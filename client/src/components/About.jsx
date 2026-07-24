import { Award, Clock, Headphones, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";

export default function About() {
  return (
    <section id="about" className="relative py-24 lg:py-0 lg:h-screen lg:flex lg:items-center overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center w-full">
        <Reveal x={-50} z={80} className="scene relative flex justify-center w-full">
          <Tilt3D strength={6} className="w-full max-w-sm md:max-w-md">
            <div className="relative aspect-[4/5] max-h-[50vh] rounded-3xl bg-panel border border-line flex items-center justify-center overflow-hidden p-10">
              <img 
                src="/logo-white.png" 
                alt="Ally Soft Solutions Logo" 
                className="w-full max-h-[70%] object-contain" 
              />
            </div>
          </Tilt3D>
          <div className="absolute -bottom-6 -right-6 bg-gold text-ink rounded-2xl px-6 py-4 shadow-xl">
            <p className="font-display text-2xl font-bold leading-none">10+</p>
            <p className="text-xs font-semibold mt-1">Years Experience</p>
          </div>
        </Reveal>

        <div className="bg-panel border border-line rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <Reveal x={40} className="mb-6">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">About us</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">We Are Ally Soft Solutions</h2>
          </Reveal>
          <Reveal x={40} delay={0.1} className="text-slate-100 leading-relaxed mb-4 text-sm sm:text-base">
            Ally Soft Solutions started its journey in 2017 with the purpose of providing IT resources to our clients. During last two decades, we have grown from a staffing firm into a solutions and integration company. We have worked with companies of all kinds, from small and midsize businesses to Fortune 500 companies.
          </Reveal>
          <Reveal x={40} delay={0.15} className="text-slate-100 leading-relaxed mb-8 text-sm sm:text-base">
            Adapting to the latest developments in the industry, we stayed ahead of the ever changing technology curve. Implemented solutions by gaining deep understating of the business processes related to Finance, Insurance, Life Sciences, Manufacturing, Logistics, and more.
          </Reveal>

          <div className="grid grid-cols-2 gap-5">
            {[
              { Icon: Award, t: "Proven Expertise" },
              { Icon: Clock, t: "On-Time Delivery" },
              { Icon: Headphones, t: "24/7 Support" },
              { Icon: ShieldCheck, t: "Secure Solutions" },
            ].map(({ Icon, t }, i) => (
              <Reveal key={t} y={20} delay={0.1 + i * 0.06} className="flex items-center gap-3">
                <Icon size={18} className="text-gold shrink-0" />
                <span className="text-sm font-medium">{t}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-9">
            <a
              href="#contact"
              className="inline-flex bg-gold hover:bg-amber text-ink font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Learn More About Us
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

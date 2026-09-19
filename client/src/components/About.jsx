import { useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";
import { useLandingData } from "../context/LandingDataContext";
import { getImageUrl, DynamicIcon } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

export default function About() {
  const { data } = useLandingData();

  const settings = data?.about_section?.[0] || {
    badge: "About us",
    title: "We Are Ally Soft Solutions",
    desc1: "Ally Soft Solutions started its journey in 2017 with the purpose of providing IT resources to our clients. During last two decades, we have grown from a staffing firm into a solutions and integration company. We have worked with companies of all kinds, from small and midsize businesses to Fortune 500 companies.",
    desc2: "Adapting to the latest developments in the industry, we stayed ahead of the ever changing technology curve. Implemented solutions by gaining deep understating of the business processes related to Finance, Insurance, Life Sciences, Manufacturing, Logistics, and more.",
    experience_num: "10+",
    experience_label: "Years Experience",
    image: "/logo-white.png"
  };

  const bulletsList = data?.about_bullets && data.about_bullets.length > 0 ? data.about_bullets : [
    { icon: "Award", title: "Proven Expertise" },
    { icon: "Clock", title: "On-Time Delivery" },
    { icon: "Headphones", title: "24/7 Support" },
    { icon: "ShieldCheck", title: "Secure Solutions" }
  ];

  return (
    <section id="about" className="relative py-24 lg:py-0 lg:h-screen lg:flex lg:items-center overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center w-full">
        
        {/* Left Column: Image & Experience badge */}
        <Reveal x={-50} z={80} className="scene relative flex justify-center w-full">
          <Tilt3D strength={6} className="w-full max-w-sm md:max-w-md relative">
            <VisualEditorTrigger sectionPath="/admin/about_section" />
            <div className="relative aspect-[4/5] max-h-[50vh] rounded-3xl bg-panel border border-line flex items-center justify-center overflow-hidden p-10">
              <img 
                src={getImageUrl(settings.image)} 
                alt="Branding Logo" 
                className="w-full max-h-[70%] object-contain relative z-10" 
              />
            </div>
          </Tilt3D>
          <div className="absolute -bottom-6 -right-6 bg-gold text-ink rounded-2xl px-6 py-4 shadow-xl z-20">
            <p className="font-display text-2xl font-bold leading-none">{settings.experience_num}</p>
            <p className="text-xs font-semibold mt-1">{settings.experience_label}</p>
          </div>
        </Reveal>

        {/* Right Column: Bio details */}
        <div className="bg-panel border border-line rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative text-left">
          <VisualEditorTrigger sectionPath="/admin/about_section" />
          
          <Reveal x={40} className="mb-6">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              {settings.title}
            </h2>
          </Reveal>
          <Reveal x={40} delay={0.1} className="text-slate-100 leading-relaxed mb-4 text-sm sm:text-base font-light">
            {settings.desc1}
          </Reveal>
          <Reveal x={40} delay={0.15} className="text-slate-100 leading-relaxed mb-8 text-sm sm:text-base font-light">
            {settings.desc2}
          </Reveal>

          {/* Highlights Bullets grid */}
          <div className="grid grid-cols-2 gap-5 relative">
            <VisualEditorTrigger sectionPath="/admin/about_bullets" />
            {bulletsList.map(({ icon, title }, i) => (
              <Reveal key={title || i} y={20} delay={0.1 + i * 0.06} className="flex items-center gap-3">
                <div className="text-gold shrink-0">
                  <DynamicIcon name={icon} size={18} />
                </div>
                <span className="text-sm font-medium text-slate-200">{title}</span>
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

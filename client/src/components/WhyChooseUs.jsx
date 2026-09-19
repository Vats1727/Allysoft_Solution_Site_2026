import { useEffect, useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import gsap from "gsap";
import Reveal from "./Reveal";
import { useLandingData } from "../context/LandingDataContext";
import { DynamicIcon } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

function HUDCard({ title, iconName, active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el && active) {
      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, rotateY: -45 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.5)" }
      );
    }
  }, [active]);

  const cleanIcon = (iconName || "").toLowerCase();

  if (cleanIcon === "award" || cleanIcon === "badgecheck") {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes awardGlow {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(245,166,35,0.3)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(245,166,35,0.6)); }
          }
          .hud-award {
            transform-origin: center;
            animation: awardGlow 3s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 hud-award" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M50 15 L62 38 L88 38 L68 52 L75 78 L50 63 L25 78 L32 52 L12 38 L38 38 Z" />
          <circle cx="50" cy="48" r="9" strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "clock" || cleanIcon === "timer") {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes clockHour {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes clockMin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .hud-hour {
            transform-origin: 50px 50px;
            animation: clockHour 15s linear infinite;
          }
          .hud-min {
            transform-origin: 50px 50px;
            animation: clockMin 2.5s linear infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="3" fill="#f5a623" />
          <line x1="50" y1="50" x2="50" y2="25" className="hud-hour" />
          <line x1="50" y1="50" x2="72" y2="50" className="hud-min" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "users" || cleanIcon === "user" || cleanIcon.includes("people")) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes teamBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .hud-team-lead {
            animation: teamBounce 3s ease-in-out infinite;
          }
          .hud-team-left {
            animation: teamBounce 3s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          .hud-team-right {
            animation: teamBounce 3s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <g className="hud-team-lead">
            <circle cx="50" cy="30" r="7" />
            <path d="M38 48 C38 42, 62 42, 62 48" />
          </g>
          <g className="hud-team-left">
            <circle cx="30" cy="50" r="5" />
            <path d="M22 64 C22 59, 38 59, 38 64" />
          </g>
          <g className="hud-team-right">
            <circle cx="70" cy="50" r="5" />
            <path d="M62 64 C62 59, 78 59, 78 64" />
          </g>
        </svg>
      </div>
    );
  }

  if (cleanIcon === "headphones" || cleanIcon === "phone" || cleanIcon.includes("support")) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes supportPulse {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          .hud-support-pulse {
            transform-origin: 50px 62px;
            animation: supportPulse 2s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 26 58 C 26 34, 74 34, 74 58" strokeWidth="1.6" />
          <rect x="20" y="54" width="8" height="16" rx="2" />
          <rect x="72" y="54" width="8" height="16" rx="2" />
          <circle cx="50" cy="62" r="3.5" fill="#f5a623" className="hud-support-pulse" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "shieldcheck" || cleanIcon === "shield" || cleanIcon.includes("lock")) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes shieldScan {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .hud-shield {
            animation: shieldScan 2.5s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)] hud-shield" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M50 16 L78 26 L78 50 C78 68, 50 83, 50 83 C50 83, 22 68, 22 50 L22 26 Z" />
          <path d="M38 48 L46 56 L62 38" strokeWidth="1.8" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "trendingup" || cleanIcon === "linechart" || cleanIcon.includes("growth")) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes growthDraw {
            0% { stroke-dashoffset: 80; }
            100% { stroke-dashoffset: 0; }
          }
          .hud-growth {
            stroke-dasharray: 80;
            animation: growthDraw 4s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 22 74 L 42 54 L 56 64 L 78 34" strokeWidth="1.6" className="hud-growth" />
          <polyline points="70,34 78,34 78,42" strokeWidth="1.6" />
          <line x1="20" y1="78" x2="80" y2="78" strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  // Fallback for custom dynamic icons
  const IconComponent = LucideIcons[iconName];
  if (IconComponent) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes hudPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          .hud-glowing-icon {
            animation: hudPulse 3s ease-in-out infinite;
          }
        `}</style>
        <div className="flex flex-col items-center justify-center gap-4 hud-glowing-icon">
          <div className="w-24 h-24 rounded-full border border-gold/25 flex items-center justify-center bg-gold/5 filter drop-shadow-[0_0_15px_rgba(245,166,35,0.2)]">
            <IconComponent className="text-gold" size={40} />
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback if no icon matched
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
      style={{ perspective: "400px", transformStyle: "preserve-3d" }}
    >
      <style>{`
        @keyframes reticleRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hud-reticle-rotate {
          transform-origin: center;
          animation: reticleRotate 20s linear infinite;
        }
      `}</style>
      <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)] hud-reticle-rotate" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="50" cy="50" r="36" />
        <circle cx="50" cy="50" r="20" strokeDasharray="3 4" />
        <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="5 5" />
        <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="5 5" />
        
        <path d="M 20 30 L 20 20 L 30 20" />
        <path d="M 80 30 L 80 20 L 70 20" />
        <path d="M 20 70 L 20 80 L 30 80" />
        <path d="M 80 70 L 80 80 L 70 80" />
      </svg>
    </div>
  );
}

export default function WhyChooseUs() {
  const { data } = useLandingData();

  const settings = data?.why_choose_us_settings?.[0] || {
    badge: "Why Choose Us",
    title: "Our Commitment"
  };

  const pointsList = data?.why_choose_us && data.why_choose_us.length > 0 ? data.why_choose_us : [
    { id: 1, icon: "Award", title: "Proven Expertise", desc: "Over 10 years delivering successful projects across industries." },
    { id: 2, icon: "Clock", title: "On-Time Delivery", desc: "We pride ourselves on meeting deadlines without cutting quality." },
    { id: 3, icon: "Users", title: "Dedicated Team", desc: "Skilled professionals committed to your project's success." },
    { id: 4, icon: "Headphones", title: "24/7 Support", desc: "Round-the-clock support to keep your systems running smoothly." },
    { id: 5, icon: "ShieldCheck", title: "Secure Solutions", desc: "A security-first approach to protect your data and applications." },
    { id: 6, icon: "TrendingUp", title: "Scalable Growth", desc: "Solutions designed to grow alongside your business needs." }
  ];

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollIndex = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const animateSlide = (nextIdx, direction) => {
    const tEl = titleRef.current;
    const cEl = contentRef.current;
    if (!tEl || !cEl) return;

    gsap.timeline()
      .to(tEl, {
        y: -direction * 20,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(tEl, { y: direction * 20 });
        }
      })
      .to(tEl, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
      });

    gsap.timeline()
      .to(cEl, {
        rotateX: direction * 90,
        scale: 0.85,
        opacity: 0.1,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(cEl, { rotateX: -direction * 90 });
        }
      })
      .to(cEl, {
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(1.3)"
      });
  };

  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e) => {
      const isHoveringCard = cardRef.current && cardRef.current.contains(e.target);
      if (!isHoveringCard) return;

      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if ((rect.top > window.innerHeight - 50 || rect.bottom < 50) && scrollIndex.current !== 0) {
        setActiveIndex(0);
        scrollIndex.current = 0;
      }

      if (!(Math.abs(rect.top) < 80)) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      if (direction === -1 && scrollIndex.current === 0) return;
      if (direction === 1 && scrollIndex.current === pointsList.length - 1) return;

      e.preventDefault();
      e.stopPropagation();

      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIdx = scrollIndex.current + direction;
      if (nextIdx >= 0 && nextIdx < pointsList.length) {
        isAnimating.current = true;
        setActiveIndex(nextIdx);
        scrollIndex.current = nextIdx;
        animateSlide(nextIdx, direction);
        setTimeout(() => {
          isAnimating.current = false;
        }, 750);
      }
    };

    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [isMobile, pointsList]);

  // Adjust active index range if database list changes
  useEffect(() => {
    if (activeIndex >= pointsList.length) {
      setActiveIndex(0);
      scrollIndex.current = 0;
    }
  }, [pointsList]);

  const activePoint = pointsList[activeIndex] || pointsList[0] || {};

  if (isMobile) {
    return (
      <section id="why-choose-us" className="relative py-24 overflow-hidden backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-6 relative">
          <VisualEditorTrigger sectionPath="/admin/why_choose_us_settings" />
          
          <Reveal y={30} className="max-w-xl mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl font-bold">
              {settings.title}
            </h2>
          </Reveal>

          <div className="space-y-6 relative">
            <VisualEditorTrigger sectionPath="/admin/why_choose_us" />
            {pointsList.map(({ id, icon, title, desc }) => (
              <div key={id} className="bg-panel border border-line rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                    <DynamicIcon name={icon} size={20} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">{title}</h3>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden backdrop-blur-[2px]"
    >
      <div className="max-w-7xl w-full mx-auto px-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 text-left relative">
          <VisualEditorTrigger sectionPath="/admin/why_choose_us_settings" />
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {settings.badge}
          </p>
          <h2 className="font-display text-4xl font-bold text-white">
            {settings.title}
          </h2>
        </div>

        <div
          ref={cardRef}
          className="max-w-4xl mx-auto flex items-center justify-between gap-12 min-h-[380px] p-10 bg-panel border border-line rounded-3xl backdrop-blur-md relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        >
          <VisualEditorTrigger sectionPath="/admin/why_choose_us" />
          
          <div ref={titleRef} className="flex-1 flex flex-col items-start text-left select-none">
            <h3 className="font-display font-bold text-3xl mb-4 text-white">{activePoint.title}</h3>
            <p className="text-slate-100 text-lg leading-relaxed max-w-sm">{activePoint.desc}</p>
          </div>

          <div
            ref={contentRef}
            className="w-48 h-48 rounded-2xl border border-line bg-void/50 flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-[inset_0_0_16px_rgba(0,0,0,0.6)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <HUDCard title={activePoint.title} iconName={activePoint.icon} active={true} />
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-3 select-none">
          {pointsList.map((_, idx) => (
            <span
              key={idx}
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-8 bg-gold shadow-[0_0_8px_rgba(245,166,35,0.6)]" : "w-2 bg-line"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

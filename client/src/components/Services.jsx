import { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import gsap from "gsap";
import Reveal from "./Reveal";
import { stopLenis, startLenis } from "../lib/lenis";
import { useLandingData } from "../context/LandingDataContext";
import { DynamicIcon } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

function HUDAnimation({ title, iconName, active }) {
  const graphicRef = useRef(null);

  useEffect(() => {
    const el = graphicRef.current;
    if (!el) return;

    if (active) {
      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, rotateY: -45 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.5)" }
      );
    }
  }, [active]);

  const cleanIcon = (iconName || "").toLowerCase();

  if (cleanIcon === "smartphone" || cleanIcon === "tablet" || cleanIcon.includes("phone")) {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes floatPhone {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(1deg); }
          }
          .hud-phone {
            animation: floatPhone 4s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)] hud-phone" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="32" y="12" width="36" height="76" rx="6" />
          <rect x="36" y="17" width="28" height="60" rx="3" strokeDasharray="3 3" />
          <circle cx="50" cy="82" r="3" />
          <line x1="46" y1="24" x2="54" y2="24" />
          <rect x="41" y="32" width="18" height="8" rx="1.5" strokeWidth="0.8" />
          <rect x="41" y="44" width="18" height="8" rx="1.5" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "server" || cleanIcon === "database" || cleanIcon === "cpu" || cleanIcon.includes("dns")) {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes spinClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinCounterClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          .hud-spin-clockwise {
            transform-origin: center;
            animation: spinClockwise 15s linear infinite;
          }
          .hud-spin-counter {
            transform-origin: center;
            animation: spinCounterClockwise 10s linear infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            strokeDasharray="8 6 4 6" 
            className="hud-spin-clockwise" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="26" 
            strokeDasharray="4 4" 
            className="hud-spin-counter" 
          />
          <rect x="40" y="40" width="20" height="20" rx="2" fill="rgba(245,166,35,0.08)" />
          <line x1="40" y1="45" x2="60" y2="45" strokeWidth="0.8" />
          <line x1="40" y1="50" x2="60" y2="50" strokeWidth="0.8" />
          <line x1="40" y1="55" x2="60" y2="55" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "rocket" || cleanIcon === "send" || cleanIcon.includes("launch")) {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes nodePulse {
            0%, 100% { opacity: 0.35; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          .hud-node-pulse {
            transform-origin: center;
            animation: nodePulse 3s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="25" y1="25" x2="50" y2="50" strokeDasharray="3 3" />
          <line x1="75" y1="25" x2="50" y2="50" strokeDasharray="3 3" />
          <line x1="25" y1="75" x2="50" y2="50" strokeDasharray="3 3" />
          <line x1="75" y1="75" x2="50" y2="50" strokeDasharray="3 3" />
          
          <circle cx="25" cy="25" r="6" fill="rgba(245,166,35,0.1)" />
          <circle cx="75" cy="25" r="6" fill="rgba(245,166,35,0.1)" />
          <circle cx="25" cy="75" r="6" fill="rgba(245,166,35,0.1)" />
          <circle cx="75" cy="75" r="6" fill="rgba(245,166,35,0.1)" />
          
          <circle cx="50" cy="50" r="10" fill="rgba(245,166,35,0.18)" className="hud-node-pulse" />
          <circle cx="50" cy="50" r="4" fill="#f5a623" />
        </svg>
      </div>
    );
  }

  // Fallback for custom dynamic icons
  const IconComponent = LucideIcons[iconName];
  if (IconComponent) {
    return (
      <div 
        ref={graphicRef} 
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
      ref={graphicRef} 
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

export default function Services() {
  const { data } = useLandingData();
  const settings = data?.services_settings?.[0] || { badge: "What we do", title: "Our Services" };
  
  // Use seeded active services list or local default array
  const servicesList = data?.services && data.services.length > 0 ? data.services : [
    { id: 1, icon: "Smartphone", title: "Mobile Apps", desc: "Apps that feel light and non-heavy — smooth on the oldest device in your users' pockets." },
    { id: 2, icon: "Server", title: "Web Backends", desc: "Backends that stay calm under traffic spikes, built for the day your product goes viral." },
    { id: 3, icon: "Rocket", title: "MVPs", desc: "MVPs that fit the market quickly and grow gracefully as your user base does." },
    { id: 4, icon: "Wrench", title: "Custom Builds", desc: "Custom builds for the weird, the wild, and the wonderfully specific parts of your idea." }
  ];

  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const hudContainerRef = useRef(null);
  const cardRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerSlideTransition = (nextIndex, dir) => {
    const textEl = textContainerRef.current;
    const hudEl = hudContainerRef.current;
    if (!textEl || !hudEl) return;

    gsap.timeline()
      .to(textEl, {
        y: -dir * 20,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(textEl, { y: dir * 20 });
        },
      })
      .to(textEl, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

    gsap.timeline()
      .to(hudEl, {
        rotateX: dir * 90,
        scale: 0.85,
        opacity: 0.1,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(hudEl, { rotateX: -dir * 90 });
        },
      })
      .to(hudEl, {
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(1.3)",
      });
  };

  useEffect(() => {
    if (isMobile) return;

    const handleGlobalWheel = (e) => {
      const isHoveringCard = cardRef.current && cardRef.current.contains(e.target);
      if (!isHoveringCard) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      if (rect.top > window.innerHeight - 50 || rect.bottom < 50) {
        if (activeIndexRef.current !== 0) {
          setActiveIndex(0);
          activeIndexRef.current = 0;
        }
      }

      const isActive = Math.abs(rect.top) < 80;
      if (!isActive) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      if (dir === -1 && activeIndexRef.current === 0) {
        return;
      }

      if (dir === 1 && activeIndexRef.current === servicesList.length - 1) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIndex = activeIndexRef.current + dir;
      if (nextIndex >= 0 && nextIndex < servicesList.length) {
        isTransitioningRef.current = true;
        setActiveIndex(nextIndex);
        activeIndexRef.current = nextIndex;
        triggerSlideTransition(nextIndex, dir);

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 750);
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel, { capture: true });
    };
  }, [isMobile, servicesList]);

  // Adjust active index range if database list changes
  useEffect(() => {
    if (activeIndex >= servicesList.length) {
      setActiveIndex(0);
      activeIndexRef.current = 0;
    }
  }, [servicesList]);

  const activeService = servicesList[activeIndex] || servicesList[0] || {};

  if (isMobile) {
    return (
      <section id="services" className="relative py-28 overflow-hidden backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-6 relative">
          <VisualEditorTrigger sectionPath="/admin/services_settings" />
          
          <Reveal y={30} className="max-w-xl mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl font-bold">
              {settings.title}
            </h2>
          </Reveal>

          <div className="space-y-6 relative">
            <VisualEditorTrigger sectionPath="/admin/services" />
            {servicesList.map(({ id, icon, title, desc }) => (
              <div 
                key={id}
                className="bg-panel border border-line rounded-2xl p-6 flex flex-col gap-5"
              >
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
    <section id="services" ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl w-full mx-auto px-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 text-left relative">
          <VisualEditorTrigger sectionPath="/admin/services_settings" />
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {settings.badge}
          </p>
          <h2 className="font-display text-4xl font-bold text-white">
            {settings.title}
          </h2>
        </div>

        {/* 3D Dashboard Control Container */}
        <div 
          ref={cardRef}
          className="max-w-4xl mx-auto flex items-center justify-between gap-12 min-h-[380px] p-10 bg-panel border border-line rounded-3xl backdrop-blur-md relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        >
          <VisualEditorTrigger sectionPath="/admin/services" />
          
          {/* Left Side: Slide Details */}
          <div ref={textContainerRef} className="flex-1 flex flex-col items-start text-left select-none">
            <h3 className="font-display font-bold text-3xl mb-4 text-white">{activeService.title}</h3>
            <p className="text-slate-100 text-base leading-relaxed max-w-sm">{activeService.desc}</p>
          </div>

          {/* Right Side: Interactive HUD window */}
          <div 
            ref={hudContainerRef}
            className="w-48 h-48 rounded-2xl border border-line bg-void/50 flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-[inset_0_0_16px_rgba(0,0,0,0.6)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <HUDAnimation title={activeService.title} iconName={activeService.icon} active={true} />
          </div>

        </div>

        {/* Slide progress indicators */}
        <div className="mt-10 flex justify-center gap-3 select-none">
          {servicesList.map((_, idx) => (
            <span
              key={idx}
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-8 bg-gold shadow-[0_0_8px_rgba(245,166,35,0.6)]"
                  : "w-2 bg-line"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

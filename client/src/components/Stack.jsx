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

  if (cleanIcon === "monitor" || cleanIcon === "layout") {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes layoutPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .hud-layout {
            animation: layoutPulse 3s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)] hud-layout" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="20" y="20" width="60" height="60" rx="4" />
          <line x1="20" y1="35" x2="80" y2="35" />
          <circle cx="30" cy="27.5" r="2.5" />
          <circle cx="40" cy="27.5" r="2.5" />
          <circle cx="50" cy="27.5" r="2.5" />
          <rect x="28" y="43" width="20" height="28" rx="2" strokeDasharray="2 2" />
          <rect x="52" y="43" width="20" height="11" rx="1.5" />
          <rect x="52" y="58" width="20" height="11" rx="1.5" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "server" || cleanIcon === "cpu") {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes flowBack {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -12; }
          }
          .hud-flow {
            animation: flowBack 1.5s linear infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="25" y="20" width="50" height="16" rx="2" />
          <rect x="25" y="42" width="50" height="16" rx="2" />
          <rect x="25" y="64" width="50" height="16" rx="2" />
          <circle cx="35" cy="28" r="2.5" fill="#f5a623" />
          <circle cx="35" cy="50" r="2.5" fill="#f5a623" />
          <circle cx="35" cy="72" r="2.5" fill="#f5a623" />
          <line x1="45" y1="28" x2="68" y2="28" strokeDasharray="3 3" className="hud-flow" />
          <line x1="45" y1="50" x2="68" y2="50" strokeDasharray="3 3" className="hud-flow" />
          <line x1="45" y1="72" x2="68" y2="72" strokeDasharray="3 3" className="hud-flow" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "smartphone" || cleanIcon === "phone" || cleanIcon === "tablet") {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes mobileFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          .hud-mobile {
            animation: mobileFloat 3.5s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)] hud-mobile" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="24" y="24" width="26" height="52" rx="4" />
          <rect x="50" y="16" width="26" height="52" rx="4" />
          <circle cx="37" cy="70" r="2" />
          <circle cx="63" cy="62" r="2" />
          <line x1="33" y1="28" x2="41" y2="28" />
          <line x1="59" y1="20" x2="67" y2="20" />
        </svg>
      </div>
    );
  }

  if (cleanIcon.includes("brain") || cleanIcon.includes("circuit") || cleanIcon.includes("ai") || cleanIcon.includes("cpu")) {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes brainPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.08); opacity: 1; }
          }
          .hud-brain {
            transform-origin: center;
            animation: brainPulse 3s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="50" r="8" fill="rgba(245,166,35,0.18)" className="hud-brain" />
          <circle cx="50" cy="50" r="3" fill="#f5a623" />
          <circle cx="30" cy="32" r="4.5" />
          <circle cx="70" cy="32" r="4.5" />
          <circle cx="30" cy="68" r="4.5" />
          <circle cx="70" cy="68" r="4.5" />
          <line x1="34" y1="36" x2="47" y2="47" />
          <line x1="66" y1="36" x2="53" y2="47" />
          <line x1="34" y1="64" x2="47" y2="53" />
          <line x1="66" y1="64" x2="53" y2="53" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "cloud" || cleanIcon === "globe" || cleanIcon.includes("server")) {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes cloudFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          .hud-cloud {
            animation: cloudFloat 4s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)] hud-cloud" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M30 45 C30 35, 45 35, 50 40 C55 35, 70 35, 70 45 C75 45, 80 50, 75 60 C70 65, 30 65, 25 60 C20 50, 25 45, 30 45 Z" />
          <line x1="35" y1="54" x2="65" y2="54" strokeDasharray="3 3" />
          <circle cx="50" cy="54" r="2.5" fill="#f5a623" />
        </svg>
      </div>
    );
  }

  if (cleanIcon === "database" || cleanIcon.includes("db") || cleanIcon.includes("folder")) {
    return (
      <div 
        ref={graphicRef} 
        className="w-full h-full flex items-center justify-center text-gold/60 select-none pointer-events-none"
        style={{ perspective: "400px", transformStyle: "preserve-3d" }}
      >
        <style>{`
          @keyframes dbSync {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .hud-db {
            animation: dbSync 2s ease-in-out infinite;
          }
        `}</style>
        <svg className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(245,166,35,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <ellipse cx="50" cy="26" rx="20" ry="6" />
          <path d="M30 26v14c0 3.3 9 6 20 6s20-2.7 20-6V26" />
          <path d="M30 40v14c0 3.3 9 6 20 6s20-2.7 20-6V40" />
          <path d="M30 54v14c0 3.3 9 6 20 6s20-2.7 20-6V54" />
          <circle cx="50" cy="40" r="2.5" fill="#f5a623" className="hud-db" />
          <circle cx="50" cy="54" r="2.5" fill="#f5a623" className="hud-db" style={{ animationDelay: "0.5s" }} />
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

export default function Stack() {
  const { data } = useLandingData();
  
  const settings = data?.stack_settings?.[0] || {
    badge: "Our stack",
    title: "Tools we trust"
  };

  const stackList = data?.stack && data.stack.length > 0 ? data.stack : [
    { id: 1, icon: "Monitor", title: "Frontend", items: "React, Next.js, Vue, Webflow, Tailwind CSS" },
    { id: 2, icon: "Server", title: "Backend", items: "Node.js, Express, Go, Python" },
    { id: 3, icon: "Smartphone", title: "Mobile", items: "Flutter, React Native, iOS, Android" },
    { id: 4, icon: "BrainCircuit", title: "AI & ML", items: "Python, OpenAI API, LangChain, PyTorch" },
    { id: 5, icon: "Cloud", title: "Cloud & DevOps", items: "AWS, Docker, Kubernetes, CI/CD" },
    { id: 6, icon: "Database", title: "Databases", items: "PostgreSQL, MongoDB, MySQL, Firebase" }
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
      if (window.location.hash.startsWith("#product/")) {
        return;
      }

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

      if (dir === 1 && activeIndexRef.current === stackList.length - 1) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIndex = activeIndexRef.current + dir;
      if (nextIndex >= 0 && nextIndex < stackList.length) {
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
  }, [isMobile, stackList]);

  // Adjust active index range if database list changes
  useEffect(() => {
    if (activeIndex >= stackList.length) {
      setActiveIndex(0);
      activeIndexRef.current = 0;
    }
  }, [stackList]);

  const activeGroup = stackList[activeIndex] || stackList[0] || {};

  if (isMobile) {
    return (
      <section id="stack" className="relative py-24 overflow-hidden backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-6 relative">
          <VisualEditorTrigger sectionPath="/admin/stack_settings" />
          
          <Reveal y={30} className="max-w-xl mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl font-bold">
              {settings.title}
            </h2>
          </Reveal>

          <div className="space-y-6 relative">
            <VisualEditorTrigger sectionPath="/admin/stack" />
            {stackList.map(({ id, icon, title, items }) => (
              <div 
                key={id}
                className="bg-panel border border-line rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-gold">
                    <DynamicIcon name={icon} size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">{title}</h3>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed">{items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="stack" ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl w-full mx-auto px-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 text-left relative">
          <VisualEditorTrigger sectionPath="/admin/stack_settings" />
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
          <VisualEditorTrigger sectionPath="/admin/stack" />
          
          {/* Left Side: Slide Details */}
          <div ref={textContainerRef} className="flex-1 flex flex-col items-start text-left select-none">
            <h3 className="font-display font-bold text-3xl mb-4 text-white">{activeGroup.title}</h3>
            <p className="text-slate-100 text-lg leading-relaxed max-w-sm">{activeGroup.items}</p>
          </div>

          {/* Right Side: Interactive HUD window */}
          <div 
            ref={hudContainerRef}
            className="w-48 h-48 rounded-2xl border border-line bg-void/50 flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-[inset_0_0_16px_rgba(0,0,0,0.6)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <HUDAnimation title={activeGroup.title} iconName={activeGroup.icon} active={true} />
          </div>

        </div>

        {/* Slide progress indicators */}
        <div className="mt-10 flex justify-center gap-3 select-none">
          {stackList.map((_, idx) => (
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

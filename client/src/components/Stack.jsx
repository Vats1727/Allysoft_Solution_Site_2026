import { useEffect, useRef, useState } from "react";
import { Monitor, Server, Smartphone, BrainCircuit, Cloud, Database } from "lucide-react";
import gsap from "gsap";
import Reveal from "./Reveal";
import { stopLenis, startLenis } from "../lib/lenis";

const GROUPS = [
  { 
    id: 1,
    Icon: Monitor, 
    title: "Frontend", 
    items: "React, Next.js, Vue, Webflow, Tailwind CSS" 
  },
  { 
    id: 2,
    Icon: Server, 
    title: "Backend", 
    items: "Node.js, Express, Go, Python" 
  },
  { 
    id: 3,
    Icon: Smartphone, 
    title: "Mobile", 
    items: "Flutter, React Native, iOS, Android" 
  },
  { 
    id: 4,
    Icon: BrainCircuit, 
    title: "AI & ML", 
    items: "Python, OpenAI API, LangChain, PyTorch" 
  },
  { 
    id: 5,
    Icon: Cloud, 
    title: "Cloud & DevOps", 
    items: "AWS, Docker, Kubernetes, CI/CD" 
  },
  { 
    id: 6,
    Icon: Database, 
    title: "Databases", 
    items: "PostgreSQL, MongoDB, MySQL, Firebase" 
  },
];

function HUDAnimation({ title, active }) {
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

  if (title === "Frontend") {
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

  if (title === "Backend") {
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

  if (title === "Mobile") {
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

  if (title === "AI & ML") {
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

  if (title === "Cloud & DevOps") {
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

  // Databases
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

export default function Stack() {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const hudContainerRef = useRef(null);
  const cardRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Handle responsive layouts
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3D slide transitions using GSAP
  const triggerSlideTransition = (nextIndex, dir) => {
    const textEl = textContainerRef.current;
    const hudEl = hudContainerRef.current;
    if (!textEl || !hudEl) return;

    // Text slide & fade
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

    // HUD 3D rotation flip
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

  // Scroll wheel scrollytelling event binding - REGISTER GLOBALLY ON WINDOW
  useEffect(() => {
    if (isMobile) return;

    const handleGlobalWheel = (e) => {
      if (window.location.hash.startsWith("#product/")) {
        return;
      }

      // Only scroll stack items when cursor is hovering over the card box
      const isHoveringCard = cardRef.current && cardRef.current.contains(e.target);
      if (!isHoveringCard) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // Reset active index to 0 when scrolled out of viewport
      if (rect.top > window.innerHeight - 50 || rect.bottom < 50) {
        if (activeIndexRef.current !== 0) {
          setActiveIndex(0);
          activeIndexRef.current = 0;
        }
      }

      const isActive = Math.abs(rect.top) < 80;
      if (!isActive) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      // If scrolling UP on first category, let event bubble to scroll up page
      if (dir === -1 && activeIndexRef.current === 0) {
        return;
      }

      // If scrolling DOWN on last category, let event bubble to scroll to next section
      if (dir === 1 && activeIndexRef.current === GROUPS.length - 1) {
        return;
      }

      // Intercept scroll event completely to cycle between categories
      e.preventDefault();
      e.stopPropagation();

      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIndex = activeIndexRef.current + dir;
      if (nextIndex >= 0 && nextIndex < GROUPS.length) {
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
  }, [isMobile]);

  const activeGroup = GROUPS[activeIndex];

  // Mobile/Tablet View fallback: stacked layouts
  if (isMobile) {
    return (
      <section id="stack" className="relative py-24 overflow-hidden backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal y={30} className="max-w-xl mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">Our stack</p>
            <h2 className="font-display text-3xl font-bold">Tools we trust</h2>
          </Reveal>

          <div className="space-y-6">
            {GROUPS.map(({ id, Icon, title, items }) => (
              <div 
                key={id}
                className="bg-panel border border-line rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-gold" size={24} />
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

  // Desktop View: 3D Scroll-Locked Carousel
  return (
    <section id="stack" ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl w-full mx-auto px-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 text-left">
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">Our stack</p>
          <h2 className="font-display text-4xl font-bold text-white">Tools we trust</h2>
        </div>

        {/* 3D Dashboard Control Container */}
        <div 
          ref={cardRef}
          className="max-w-4xl mx-auto flex items-center justify-between gap-12 min-h-[380px] p-10 bg-panel border border-line rounded-3xl backdrop-blur-md relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        >
          
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
            <HUDAnimation title={activeGroup.title} active={true} />
          </div>

        </div>

        {/* Slide progress indicators (Tab Guide) */}
        <div className="mt-10 flex justify-center gap-3 select-none">
          {GROUPS.map((_, idx) => (
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

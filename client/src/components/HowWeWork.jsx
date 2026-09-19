import { useEffect, useRef, useState } from "react";
import { stopLenis, startLenis } from "../lib/lenis";
import Reveal from "./Reveal";
import { useLandingData } from "../context/LandingDataContext";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

const STATIC_STEPS = [
  { 
    n: "01", 
    title: "Scope Light", 
    desc: "We believe in defining the absolute smallest win that proves the point. Instead of designing a multi-month project, we break down your vision into its core utility. We focus on launching a robust, functional MVP in weeks, validating product-market fit, and removing speculative engineering overhead.",
    milestones: ["Value Mapping", "MVP Blueprinting", "Spec Formulation"]
  },
  { 
    n: "02", 
    title: "Ship Early", 
    desc: "We launch a version that users can actually touch, click, and interact with as quickly as possible. Shipping code to production early changes conversations from speculative designs to actual usage feedback. We automate deployments so new updates land in minutes, not days.",
    milestones: ["CI/CD Pipelines", "Continuous Delivery", "Early Access Launch"]
  },
  { 
    n: "03", 
    title: "Test For Real", 
    desc: "Listen, measure, and adjust with real usage data. We integrate deep instrumentation, performance logging, and error tracking from day one. Instead of relying on opinion, we let click streams, load times, and active user metrics guide our next development decisions.",
    milestones: ["Telemetry Setup", "User Analytics", "Hotfix Loop Trials"]
  },
  { 
    n: "04", 
    title: "Scale Clean", 
    desc: "Harden, automate, and document as traffic grows. Once a feature is validated by real users, we transition it from a rapid build to a hardened service. We optimize database queries, set up Redis caching layers, refine APIs, and dockerize configurations to ensure high scalability.",
    milestones: ["Query Optimization", "Redis Caching", "Docker Deployment"]
  },
  { 
    n: "05", 
    title: "Grow Together", 
    desc: "Add the right features at the right time. Product evolution is a marathon, not a sprint. We act as long-term technical partners, collaborating directly with your team to support growth spikes, maintain infrastructure stability, and plan future integrations cleanly.",
    milestones: ["Roadmap Alignment", "Infrastructure Scaling", "Feature Expansion"]
  },
];

const NODE_COORDS = [
  { left: "50%", top: "10%" },  // Node 1 (Top)
  { left: "88%", top: "38%" },  // Node 2 (Right-Top)
  { left: "74%", top: "82%" },  // Node 3 (Right-Bottom)
  { left: "26%", top: "82%" },  // Node 4 (Left-Bottom)
  { left: "12%", top: "38%" },  // Node 5 (Left-Top)
];

const NODE_ANGLES = [0, 72, 144, 216, 288];

export default function HowWeWork() {
  const { data } = useLandingData();

  const settings = data?.how_we_work_settings?.[0] || {
    badge: "Process",
    title: "How We Work"
  };

  const stepsList = data?.how_we_work_steps && data.how_we_work_steps.length > 0 
    ? data.how_we_work_steps 
    : STATIC_STEPS;

  // Max 5 steps on desktop to fit coordinates mapping perfectly
  const desktopSteps = stepsList.slice(0, 5);

  const [activeIndex, setActiveIndex] = useState(0);
  const [radarAngle, setRadarAngle] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          setRadarAngle(0);
        }
      }

      const isActive = Math.abs(rect.top) < 80;
      if (!isActive) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      if (dir === -1 && activeIndexRef.current === 0) {
        return;
      }

      if (dir === 1 && activeIndexRef.current === desktopSteps.length - 1) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIndex = activeIndexRef.current + dir;
      if (nextIndex >= 0 && nextIndex < desktopSteps.length) {
        isTransitioningRef.current = true;
        setActiveIndex(nextIndex);
        activeIndexRef.current = nextIndex;
        setRadarAngle(NODE_ANGLES[nextIndex]);

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 600);
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel, { capture: true });
    };
  }, [isMobile, desktopSteps]);

  // Adjust active index range if database list changes
  useEffect(() => {
    if (activeIndex >= desktopSteps.length) {
      setActiveIndex(0);
      activeIndexRef.current = 0;
      setRadarAngle(0);
    }
  }, [desktopSteps]);

  const activeStep = desktopSteps[activeIndex] || desktopSteps[0] || {};
  const activeMilestones = Array.isArray(activeStep.milestones) 
    ? activeStep.milestones 
    : (typeof activeStep.milestones === "string" ? JSON.parse(activeStep.milestones) : []);

  return (
    <section 
      id="process-section" 
      ref={containerRef}
      className="relative md:h-screen w-full flex items-center justify-center py-24 md:py-0 overflow-hidden backdrop-blur-[2px]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div 
          ref={cardRef}
          className="bg-panel border border-line rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md w-full relative"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        >
          <VisualEditorTrigger sectionPath="/admin/how_we_work_settings" />
          
          <Reveal y={30} className="text-center max-w-xl mx-auto mb-16">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {settings.title}
            </h2>
          </Reveal>

          {/* Desktop View: Interactive Polar Blueprint Scanner & Split Console */}
          <div className="hidden md:grid grid-cols-12 gap-10 items-center min-h-[420px] relative">
            <VisualEditorTrigger sectionPath="/admin/how_we_work_steps" />
            
            {/* Left Column (Cols 1-5): The Radar Grid Scanner */}
            <div className="col-span-5 flex items-center justify-center">
              <div className="relative w-[340px] h-[340px] lg:w-[380px] lg:h-[380px] rounded-full flex items-center justify-center aspect-square select-none">
                
                {/* SVG Blueprint console background */}
                <svg className="absolute inset-0 w-full h-full text-line/80 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1 1" />
                  
                  <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="17.5" y1="17.5" x2="82.5" y2="82.5" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />
                  <line x1="17.5" y1="82.5" x2="82.5" y2="17.5" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />

                  <g transform={`rotate(${radarAngle} 50 50)`} className="transition-transform duration-500 ease-out">
                    <path d="M 50 50 L 38.1 5.6 A 46 46 0 0 1 61.9 5.6 Z" fill="url(#radarSweepGrad)" opacity="0.35" />
                    <line x1="50" y1="50" x2="50" y2="4" stroke="#f5a623" strokeWidth="1.5" filter="url(#beamGlow)" />
                  </g>

                  <defs>
                    <linearGradient id="radarSweepGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f5a623" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
                    </linearGradient>
                    <filter id="beamGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="1" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-gold/45 bg-[#0a0e1c] flex flex-col items-center justify-center font-display text-[9px] font-bold text-gold tracking-widest shadow-[0_0_15px_rgba(245,166,35,0.15)] z-20">
                  <span>ALLY</span>
                  <span className="text-[7px] text-mist/60 font-mono mt-0.5">CORE</span>
                </div>

                {desktopSteps.map((s, idx) => (
                  <div
                    key={s.n || idx}
                    className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-display text-sm font-bold transition-all duration-300 z-20 select-none ${
                      activeIndex === idx
                        ? "scale-125 bg-panel border-gold text-gold shadow-[0_0_20px_rgba(245,166,35,0.4)]"
                        : "scale-100 bg-[#0a0e1c]/80 border-line/60 text-mist/60 opacity-60"
                    }`}
                    style={{
                      ...NODE_COORDS[idx],
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {s.n}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (Cols 6-12): The Details Display */}
            <div className="col-span-7 flex flex-col justify-center pl-8 border-l border-line/40 min-h-[300px]">
              <div 
                key={activeIndex}
                className="flex flex-col justify-center text-left animate-fade-in w-full"
              >
                <h3 className="font-display font-bold text-3xl lg:text-4xl text-white">
                  {activeStep.title}
                </h3>
                <p className="text-slate-100 text-sm sm:text-base mt-5 leading-relaxed max-w-2xl font-light">
                  {activeStep.desc}
                </p>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-line/30">
                  {activeMilestones.map((m) => (
                    <div key={m} className="bg-panel border border-line/50 rounded-xl p-3 flex flex-col justify-center text-left">
                      <span className="text-[10px] text-gold font-semibold uppercase tracking-wider mb-1">Milestone</span>
                      <span className="text-xs text-slate-200 font-medium leading-tight">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Mobile View: Vertical Timeline Fallback */}
          <div className="md:hidden space-y-6 relative">
            <VisualEditorTrigger sectionPath="/admin/how_we_work_steps" />
            {stepsList.map((s, idx) => {
              const milestones = Array.isArray(s.milestones) 
                ? s.milestones 
                : (typeof s.milestones === "string" ? JSON.parse(s.milestones) : []);
              return (
                <div key={s.n || idx} className="bg-panel border border-line rounded-2xl p-6 text-left shadow-lg flex flex-col gap-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">
                      {s.title}
                    </h3>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed font-light">
                      {s.desc}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 pt-4 border-t border-line/30">
                    {milestones.map((m) => (
                      <div key={m} className="bg-[#0a0e1c]/40 border border-line/50 rounded-xl px-4 py-2 flex items-center justify-between">
                        <span className="text-xs text-slate-200 font-medium">{m}</span>
                        <span className="text-[9px] text-gold font-bold uppercase tracking-wider">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

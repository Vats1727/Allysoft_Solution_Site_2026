import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, ChevronRight, Play } from "lucide-react";
import { initGsap, reveal } from "../lib/engine";
import Reveal from "./Reveal";
import { stopLenis, startLenis } from "../lib/lenis";
import { useLandingData } from "../context/LandingDataContext";
import { getImageUrl } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

// Static fallback data
import { PROJECTS as STATIC_PROJECTS } from "../data/projects";

initGsap();

export default function Work() {
  const { data } = useLandingData();
  
  const settings = data?.work_settings?.[0] || {
    badge: "Our work",
    title: "Projects We've Shipped",
    description: "A showcase of custom digital products, secure cloud systems, and high-performance applications built for operational impact."
  };

  const projectsList = data?.projects && data.projects.length > 0 ? data.projects : STATIC_PROJECTS;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const headRef = useRef(null);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const incomingRef = useRef(null);
  const outgoingRef = useRef(null);
  const detailsRef = useRef(null);
  const cooldownRef = useRef(false);

  const activeProject = projectsList[selectedIndex] || projectsList[0] || {};

  useLayoutEffect(() => {
    const tween = reveal(headRef.current, { y: 30, duration: 0.9 });
    return () => tween?.scrollTrigger?.kill();
  }, []);

  // Cinematic avatar image load & slide-reveal transition sequence
  useLayoutEffect(() => {
    if (!incomingRef.current || !detailsRef.current) return;

    gsap.killTweensOf(incomingRef.current);
    if (outgoingRef.current) gsap.killTweensOf(outgoingRef.current);
    gsap.killTweensOf(detailsRef.current);

    const tl = gsap.timeline();

    // 1. Text Details Transition (Quick elegant fade-out and slide-up stagger)
    tl.fromTo(detailsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    // 2. Image Slide Parallax Mask Animation
    if (prevIndex !== null && outgoingRef.current) {
      const shiftPercent = 100 * direction;
      
      const tlImg = gsap.timeline({
        onComplete: () => {
          setPrevIndex(null);
        }
      });

      tlImg.fromTo(incomingRef.current,
        { xPercent: shiftPercent, scale: 1.1 },
        { xPercent: 0, scale: 1, duration: 0.75, ease: "power3.inOut" }
      );

      tlImg.fromTo(outgoingRef.current,
        { xPercent: 0, scale: 1 },
        { xPercent: -shiftPercent, scale: 0.95, duration: 0.75, ease: "power3.inOut" }
      );
    } else {
      // Initial mount render
      gsap.fromTo(incomingRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [selectedIndex, activeProject]);

  // Handle slide transitions with direction calculations
  const changeProject = (currentIndex, newIndex) => {
    if (cooldownRef.current) return;

    let dir = 1;
    if (newIndex === 0 && currentIndex === projectsList.length - 1) dir = 1;
    else if (newIndex === projectsList.length - 1 && currentIndex === 0) dir = -1;
    else dir = newIndex > currentIndex ? 1 : -1;

    setDirection(dir);
    setPrevIndex(currentIndex);
    setSelectedIndex(newIndex);

    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, 750);
  };

  const selectedIndexRef = useRef(0);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Global window wheel scroll listener to change cards on mouse scroll cursor-independently
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      const isHoveringCard = cardRef.current && cardRef.current.contains(e.target);
      if (!isHoveringCard) return;

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();

      if (rect.top > window.innerHeight - 50 || rect.bottom < 50) {
        if (selectedIndexRef.current !== 0) {
          setSelectedIndex(0);
          selectedIndexRef.current = 0;
        }
      }

      const isActive = Math.abs(rect.top) < 80;
      if (!isActive) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      if (dir === -1 && selectedIndexRef.current === 0) {
        return;
      }

      if (dir === 1 && selectedIndexRef.current === projectsList.length - 1) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (cooldownRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIndex = selectedIndexRef.current + dir;
      if (nextIndex >= 0 && nextIndex < projectsList.length) {
        changeProject(selectedIndexRef.current, nextIndex);
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel, { capture: true });
    };
  }, [projectsList]);

  // Adjust active index range if database list changes
  useEffect(() => {
    if (selectedIndex >= projectsList.length) {
      setSelectedIndex(0);
      selectedIndexRef.current = 0;
    }
  }, [projectsList]);

  const nextProject = () => {
    changeProject(selectedIndex, (selectedIndex + 1) % projectsList.length);
  };

  const tags = Array.isArray(activeProject.tags) 
    ? activeProject.tags 
    : (typeof activeProject.tags === "string" ? JSON.parse(activeProject.tags) : []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-24 lg:py-0 lg:h-screen lg:flex lg:items-center overflow-hidden backdrop-blur-[2px]"
      style={{ perspective: "1200px" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div ref={headRef} className="mb-10 relative">
          <VisualEditorTrigger sectionPath="/admin/work_settings" />
          <div className="max-w-xl text-left">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold">
              {settings.title}
            </h2>
            <p className="text-mist mt-4 text-sm sm:text-base">
              {settings.description}
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
          <div
            ref={cardRef}
            className="w-full bg-panel border border-line rounded-3xl p-6 sm:p-8 xl:p-10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] overflow-hidden relative"
          >
            <VisualEditorTrigger sectionPath="/admin/projects" />
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column: Image with Parallax Slide Mask */}
              <div 
                className="relative w-full aspect-[1024/489] rounded-2xl border border-line overflow-hidden bg-void shadow-2xl"
              >
                <a
                  href={`#product/${activeProject.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.hash = `#product/${activeProject.slug}`;
                  }}
                  className="absolute inset-0 w-full h-full text-left z-10 group cursor-pointer"
                  aria-label={`View ${activeProject.title} details`}
                >
                  {/* Outgoing Image */}
                  {prevIndex !== null && projectsList[prevIndex] && (
                    <div
                      key={`out-${prevIndex}`}
                      ref={outgoingRef}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img 
                        src={getImageUrl(projectsList[prevIndex].image)} 
                        alt="Outgoing" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* Incoming Image */}
                  <div 
                    key={`in-${selectedIndex}`}
                    ref={incomingRef} 
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={getImageUrl(activeProject.image)} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="w-14 h-14 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-[0_0_40px_rgba(245,166,35,0.5)]">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </a>
              </div>

              {/* Right Column: Project Details */}
              <div ref={detailsRef} className="text-left">
                <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">{activeProject.category}</p>
                <h3 className="font-display text-2xl sm:text-4xl font-bold mb-3">{activeProject.title}</h3>
                <p className="text-slate-100 leading-relaxed mb-4 text-sm sm:text-base">{activeProject.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-void border border-line text-slate-200 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={`#product/${activeProject.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.hash = `#product/${activeProject.slug}`;
                    }}
                    className="inline-flex items-center gap-2 bg-gold hover:bg-amber text-ink font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-md cursor-pointer"
                  >
                    View Product Details <ArrowUpRight size={16} />
                  </a>
                  {projectsList.length > 1 && (
                    <button
                      onClick={nextProject}
                      aria-label="Next Project"
                      className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-white hover:text-gold hover:border-gold/40 transition-colors ml-auto shrink-0 animate-pulse"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Slide progress indicators */}
          {projectsList.length > 1 && (
            <div className="mt-10 flex justify-center gap-3 select-none">
              {projectsList.map((_, idx) => (
                <span
                  key={idx}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    idx === selectedIndex
                      ? "w-8 bg-gold shadow-[0_0_8px_rgba(245,166,35,0.6)]"
                      : "w-2 bg-line"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

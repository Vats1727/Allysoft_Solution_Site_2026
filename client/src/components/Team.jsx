import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronRight, Globe, Link2, Mail } from "lucide-react";
import Reveal from "./Reveal";
import { stopLenis, startLenis } from "../lib/lenis";
import { useLandingData } from "../context/LandingDataContext";
import { getImageUrl } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

const STATIC_TEAM = [
  {
    name: "Vishal Akbari",
    role: "Chief Executive Officer",
    bio: "Sets the company roadmap and works closely with founders to transform fuzzy project requirements into high-performing digital products.",
    tag: "CEO & Founder",
    image: "/ceo.jpg",
  },
  {
    name: "Shamsaagazarzoo Alam",
    role: "Chief Technology Officer",
    bio: "Architects scalable backend engines, cloud infrastructure, and AI microservices designed for 99.99% uptime under high traffic loads.",
    tag: "CTO & Co-Founder",
    image: "/cto.jpg",
  },
  {
    name: "Jenil Vaghasiya",
    role: "Junior Developer",
    bio: "Expertise: Mern Stack Developer. Crafts responsive, high-performance web systems and fluid backend services.",
    tag: "Junior Dev",
    image: "/jenil.jpg",
  },
  {
    name: "Aniket Solanki",
    role: "Junior Developer",
    bio: "Expertise: Mern Stack and Flutter Developer. Develops scalable server integrations and native mobile experiences.",
    tag: "Junior Dev",
    image: "/aniket.jpg",
    objectPosition: "center 15%",
  },
  {
    name: "Prashant Sarvaiya",
    role: "Junior Developer",
    bio: "Expertise: Mern Stack and Flutter Developer. Designs secure APIs and robust cross-platform software systems.",
    tag: "Junior Dev",
    image: "/prashant.jpg",
    objectPosition: "center 15%",
  },
  {
    name: "Vatsal Parmar",
    role: "Junior Developer",
    bio: "Expertise: Mern Stack Developer. Builds fluid user interfaces, frontend architectures, and hardware-accelerated animations.",
    tag: "Junior Dev",
    image: "/vatsal.jpg",
    objectPosition: "center top",
    scale: 1.35,
    transformOrigin: "center 15%",
  },
];

export default function Team() {
  const { data } = useLandingData();

  const settings = data?.team_settings?.[0] || {
    badge: "The people behind it",
    title: "Meet Our Team"
  };

  const teamList = data?.team && data.team.length > 0 ? data.team : STATIC_TEAM;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const incomingRef = useRef(null);
  const outgoingRef = useRef(null);
  const detailsRef = useRef(null);
  const cooldownRef = useRef(false);

  const activeMember = teamList[selectedIndex] || teamList[0] || {};

  // Cinematic avatar image load & slide-reveal transition sequence
  useLayoutEffect(() => {
    if (!incomingRef.current || !detailsRef.current) return;

    gsap.killTweensOf(incomingRef.current);
    if (outgoingRef.current) gsap.killTweensOf(outgoingRef.current);
    gsap.killTweensOf(detailsRef.current);

    const tl = gsap.timeline();

    tl.fromTo(detailsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

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
      gsap.fromTo(incomingRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [selectedIndex, activeMember]);

  // Handle slide transitions with direction calculations
  const changeMember = (currentIndex, newIndex) => {
    if (cooldownRef.current) return;

    let dir = 1;
    if (newIndex === 0 && currentIndex === teamList.length - 1) dir = 1;
    else if (newIndex === teamList.length - 1 && currentIndex === 0) dir = -1;
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
      const isActive = Math.abs(rect.top) < 80;
      if (!isActive) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      if (dir === -1 && selectedIndexRef.current === 0) {
        return;
      }

      if (dir === 1 && selectedIndexRef.current === teamList.length - 1) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (cooldownRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      const nextIndex = selectedIndexRef.current + dir;
      if (nextIndex >= 0 && nextIndex < teamList.length) {
        changeMember(selectedIndexRef.current, nextIndex);
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel, { capture: true });
    };
  }, [teamList]);

  // Adjust active index range if database list changes
  useEffect(() => {
    if (selectedIndex >= teamList.length) {
      setSelectedIndex(0);
      selectedIndexRef.current = 0;
    }
  }, [teamList]);

  const nextMember = () => {
    changeMember(selectedIndex, (selectedIndex + 1) % teamList.length);
  };

  const prevMember = () => {
    changeMember(selectedIndex, (selectedIndex - 1 + teamList.length) % teamList.length);
  };

  const outgoingMember = prevIndex !== null ? teamList[prevIndex] : null;

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-24 lg:py-0 lg:h-screen lg:flex lg:items-center overflow-hidden backdrop-blur-[2px]"
      style={{ perspective: "1200px" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
        <Reveal y={30} className="mb-10 relative">
          <VisualEditorTrigger sectionPath="/admin/team_settings" />
          <div className="max-w-xl text-left">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {settings.badge}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold">
              {settings.title}
            </h2>
          </div>
        </Reveal>

        {/* Cinematic Grid Layout */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
          <div
            ref={cardRef}
            className="w-full bg-panel border border-line rounded-3xl p-8 sm:p-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] overflow-hidden relative"
          >
            <VisualEditorTrigger sectionPath="/admin/team" />
            
            <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Left Column: Portrait Avatar Image with Parallax Slide Mask */}
              <div 
                className="relative w-full aspect-square max-h-[50vh] rounded-2xl border border-line overflow-hidden bg-void shadow-2xl"
              >
                {/* Outgoing Image */}
                {outgoingMember && (
                  <div
                    key={`out-${prevIndex}`}
                    ref={outgoingRef}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={getImageUrl(outgoingMember.image)} 
                      alt="Outgoing" 
                      className="w-full h-full object-cover" 
                      style={{ 
                        objectPosition: outgoingMember.object_position || outgoingMember.objectPosition || "center top",
                        transform: outgoingMember.scale ? `scale(${outgoingMember.scale})` : undefined,
                        transformOrigin: outgoingMember.transform_origin || outgoingMember.transformOrigin || "center top"
                      }}
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
                    src={getImageUrl(activeMember.image)} 
                    alt={activeMember.name} 
                    className="w-full h-full object-cover" 
                    style={{ 
                      objectPosition: activeMember.object_position || activeMember.objectPosition || "center top",
                      transform: activeMember.scale ? `scale(${activeMember.scale})` : undefined,
                      transformOrigin: activeMember.transform_origin || activeMember.transformOrigin || "center top"
                    }}
                  />
                </div>

                <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase text-gold font-semibold bg-ink/90 border border-gold/30 rounded-full px-3 py-1 z-10">
                  {activeMember.tag}
                </span>
              </div>

              {/* Right Column: Member Details */}
              <div ref={detailsRef} className="text-left">
                <h3 className="font-display text-2xl sm:text-4xl font-bold">{activeMember.name}</h3>
                <p className="text-gold text-base sm:text-lg font-semibold mt-1.5">{activeMember.role}</p>
                <p className="text-slate-100 mt-4 leading-relaxed text-sm sm:text-base font-light">{activeMember.bio}</p>
                <div className="flex items-center gap-4 mt-8">
                  <a href="#contact" aria-label="Member Website" className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-mist hover:text-gold hover:border-gold/40 transition-colors">
                    <Globe size={18} />
                  </a>
                  <a href="#contact" aria-label="Member Profile" className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-mist hover:text-gold hover:border-gold/40 transition-colors">
                    <Link2 size={18} />
                  </a>
                  <a href="#contact" aria-label="Contact Member" className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-mist hover:text-gold hover:border-gold/40 transition-colors">
                    <Mail size={18} />
                  </a>
                  {teamList.length > 1 && (
                    <button
                      onClick={nextMember}
                      aria-label="Next Member"
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
          {teamList.length > 1 && (
            <div className="mt-10 flex justify-center gap-3 select-none">
              {teamList.map((_, idx) => (
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

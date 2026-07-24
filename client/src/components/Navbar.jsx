import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Compass, X } from "lucide-react";
import { scrollTo, stopLenis, startLenis } from "../lib/lenis";

const LINKS = [
  {
    label: "HOME",
    sub: "Introduction",
    href: "#home",
    textColor: "text-gold",
    svg: (
      <svg className="absolute inset-0 w-full h-full text-white/10 group-hover:text-gold/25 transition-all duration-500 pointer-events-none" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Ground grid & coordinates */}
        <line x1="50" y1="10" x2="50" y2="190" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="100" x2="90" y2="100" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="140" x2="90" y2="140" strokeWidth="1" opacity="0.8" />
        
        {/* House Main Body & Roof */}
        <polygon points="20,95 50,60 80,95" strokeWidth="1.2" />
        <rect x="26" y="95" width="48" height="45" rx="2" />
        
        {/* Chimney & Smoke */}
        <rect x="64" y="68" width="8" height="15" />
        <path d="M 68 62 Q 72 55, 68 48 T 72 34" strokeDasharray="2 2" opacity="0.5" />
        
        {/* Door and windows */}
        <rect x="42" y="112" width="16" height="28" rx="1" />
        <circle cx="53" cy="126" r="1.2" fill="currentColor" />
        <circle cx="50" cy="80" r="6" />
        <line x1="50" y1="74" x2="50" y2="86" />
        <line x1="44" y1="80" x2="56" y2="80" />
        <rect x="32" y="105" width="10" height="12" rx="1" />
        <line x1="37" y1="105" x2="37" y2="117" />
        <line x1="32" y1="111" x2="42" y2="111" />
        
        {/* Left Height Dimension line */}
        <line x1="15" y1="60" x2="15" y2="140" strokeDasharray="2 2" />
        <line x1="12" y1="60" x2="18" y2="60" />
        <line x1="12" y1="95" x2="18" y2="95" />
        <line x1="12" y1="140" x2="18" y2="140" />
        
        {/* Bottom Width Dimension line */}
        <line x1="26" y1="150" x2="74" y2="150" strokeDasharray="2 2" />
        <line x1="26" y1="147" x2="26" y2="153" />
        <line x1="74" y1="147" x2="74" y2="153" />
      </svg>
    ),
  },
  {
    label: "SERVICES",
    sub: "Capabilities",
    href: "#services",
    textColor: "text-sky-400",
    svg: (
      <svg className="absolute inset-0 w-full h-full text-white/10 group-hover:text-sky-400/25 transition-all duration-500 pointer-events-none" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Central grid axis */}
        <line x1="50" y1="10" x2="50" y2="190" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="100" x2="90" y2="100" strokeDasharray="1 5" opacity="0.3" />
        
        {/* Gear 1 (Main/Center) */}
        <circle cx="50" cy="95" r="26" strokeDasharray="6 4" strokeWidth="1.2" />
        <circle cx="50" cy="95" r="22" />
        <circle cx="50" cy="95" r="8" />
        <circle cx="50" cy="95" r="2" fill="currentColor" />
        <line x1="50" y1="65" x2="50" y2="125" strokeDasharray="2 2" />
        <line x1="20" y1="95" x2="80" y2="95" strokeDasharray="2 2" />
        <line x1="33.5" y1="78.5" x2="66.5" y2="111.5" strokeDasharray="2 2" />
        <line x1="33.5" y1="111.5" x2="66.5" y2="78.5" strokeDasharray="2 2" />

        {/* Gear 2 (Bottom-Left) */}
        <circle cx="26" cy="128" r="16" strokeDasharray="4 3" strokeWidth="1.2" />
        <circle cx="26" cy="128" r="13" />
        <circle cx="26" cy="128" r="4.5" />
        <circle cx="26" cy="128" r="1.5" fill="currentColor" />
        <line x1="26" y1="108" x2="26" y2="148" strokeDasharray="2 2" />
        <line x1="6" y1="128" x2="46" y2="128" strokeDasharray="2 2" />

        {/* Gear 3 (Top-Right) */}
        <circle cx="74" cy="62" r="16" strokeDasharray="4 3" strokeWidth="1.2" />
        <circle cx="74" cy="62" r="13" />
        <circle cx="74" cy="62" r="4.5" />
        <circle cx="74" cy="62" r="1.5" fill="currentColor" />
        <line x1="74" y1="42" x2="74" y2="82" strokeDasharray="2 2" />
        <line x1="54" y1="62" x2="94" y2="62" strokeDasharray="2 2" />

        {/* Belt Connection */}
        <path d="M 26 144 A 16 16 0 0 1 10 128 L 58 46 A 16 16 0 0 1 90 62 L 42 144" strokeDasharray="2 4" opacity="0.4" />
      </svg>
    ),
  },
  {
    label: "WORK",
    sub: "Portfolio",
    href: "#work",
    textColor: "text-indigo-400",
    svg: (
      <svg className="absolute inset-0 w-full h-full text-white/10 group-hover:text-indigo-400/25 transition-all duration-500 pointer-events-none" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Blueprint grid lines */}
        <line x1="50" y1="10" x2="50" y2="190" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="100" x2="90" y2="100" strokeDasharray="1 5" opacity="0.3" />
        
        {/* Desk Surface / Horizon Line */}
        <line x1="10" y1="140" x2="90" y2="140" strokeWidth="1" opacity="0.8" />

        {/* Desktop Monitor Screen */}
        <rect x="20" y="65" width="60" height="40" rx="3" strokeWidth="1.2" />
        <rect x="24" y="69" width="52" height="32" rx="1" />
        
        {/* Monitor Stand */}
        <path d="M 46 105 L 43 125 H 57 L 54 105 Z" />
        <ellipse cx="50" cy="125" rx="15" ry="3" />

        {/* Keyboard on Desk */}
        <polygon points="25,130 75,130 79,138 21,138" />
        <line x1="30" y1="134" x2="70" y2="134" strokeDasharray="1 1" />

        {/* Mouse */}
        <rect x="82" y="132" width="6" height="7" rx="2" />
        <path d="M 85 132 Q 78 120, 60 120" strokeDasharray="2 2" opacity="0.4" />

        {/* Wireframe details on screen */}
        <line x1="30" y1="75" x2="60" y2="75" opacity="0.7" />
        <line x1="30" y1="81" x2="48" y2="81" strokeDasharray="2 2" opacity="0.7" />
        <rect x="30" y="87" width="12" height="10" rx="1" opacity="0.7" />
        <line x1="46" y1="89" x2="70" y2="89" opacity="0.7" />
        <line x1="46" y1="95" x2="65" y2="95" opacity="0.7" />

        {/* Dimension markings */}
        <line x1="15" y1="65" x2="15" y2="125" strokeDasharray="2 2" />
        <line x1="12" y1="65" x2="18" y2="65" />
        <line x1="12" y1="125" x2="18" y2="125" />
      </svg>
    ),
  },
  {
    label: "ABOUT",
    sub: "Strategy",
    href: "#about",
    textColor: "text-slate-300",
    svg: (
      <svg className="absolute inset-0 w-full h-full text-white/10 group-hover:text-slate-300/25 transition-all duration-500 pointer-events-none" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Central grid axis */}
        <line x1="50" y1="10" x2="50" y2="190" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="100" x2="90" y2="100" strokeDasharray="1 5" opacity="0.3" />

        {/* Lightbulb shape */}
        <path d="M 32.2 86 C 32.2 96, 38 105, 38 115 H 62 C 62 105, 67.8 96, 67.8 86 A 22 22 0 1 0 32.2 86 Z" strokeWidth="1.2" />
        
        {/* Screw Base */}
        <rect x="38" y="115" width="24" height="4" rx="2" />
        <rect x="40" y="119" width="20" height="4" rx="2" />
        <rect x="42" y="123" width="16" height="4" rx="2" />
        <path d="M 45 127 L 50 131 L 55 127 Z" />

        {/* Filament wires */}
        <path d="M 44 115 V 96 L 47 90" />
        <path d="M 56 115 V 96 L 53 90" />
        <path d="M 47 90 C 47.5 88, 48.5 88, 49 90 C 49.5 92, 50.5 92, 51 90 C 51.5 88, 52.5 88, 53 90" strokeWidth="1.2" />

        {/* Outer radiating rays */}
        <line x1="50" y1="43" x2="50" y2="33" strokeDasharray="2 2" />
        <line x1="72" y1="53" x2="79" y2="46" strokeDasharray="2 2" />
        <line x1="28" y1="53" x2="21" y2="46" strokeDasharray="2 2" />
        <line x1="80" y1="75" x2="90" y2="75" strokeDasharray="2 2" />
        <line x1="20" y1="75" x2="10" y2="75" strokeDasharray="2 2" />
        <line x1="72" y1="97" x2="79" y2="104" strokeDasharray="2 2" />
        <line x1="28" y1="97" x2="21" y2="104" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    label: "TEAM",
    sub: "Engineers",
    href: "#team",
    textColor: "text-amber-400",
    svg: (
      <svg className="absolute inset-0 w-full h-full text-white/10 group-hover:text-amber-400/25 transition-all duration-500 pointer-events-none" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Central grid axis */}
        <line x1="50" y1="10" x2="50" y2="190" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="100" x2="90" y2="100" strokeDasharray="1 5" opacity="0.3" />

        {/* Center/Front Avatar */}
        <circle cx="50" cy="70" r="8" strokeWidth="1.2" />
        <polygon points="36,125 40,85 60,85 64,125" strokeWidth="1.2" />
        <polygon points="49,93 51,93 52,105 50,109 48,105" fill="currentColor" />

        {/* Left Avatar */}
        <circle cx="28" cy="80" r="7" />
        <polygon points="16,130 20,93 36,93 40,130" opacity="0.7" />

        {/* Right Avatar */}
        <circle cx="72" cy="80" r="7" />
        <polygon points="60,130 64,93 80,93 84,130" opacity="0.7" />

        {/* Connected network nodes */}
        <path d="M 28 80 Q 50 65, 72 80" strokeDasharray="3 3" />
        <circle cx="50" cy="45" r="3" fill="currentColor" />
        <line x1="50" y1="45" x2="28" y2="80" opacity="0.5" />
        <line x1="50" y1="45" x2="50" y2="70" opacity="0.5" />
        <line x1="50" y1="45" x2="72" y2="80" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: "CONTACT",
    sub: "Build Now",
    href: "#contact",
    textColor: "text-emerald-400",
    svg: (
      <svg className="absolute inset-0 w-full h-full text-white/10 group-hover:text-emerald-400/25 transition-all duration-500 pointer-events-none" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Central grid axis */}
        <line x1="50" y1="10" x2="50" y2="190" strokeDasharray="1 5" opacity="0.3" />
        <line x1="10" y1="100" x2="90" y2="100" strokeDasharray="1 5" opacity="0.3" />

        {/* Location Pin */}
        <path d="M 50 58 C 42 48, 42 38, 50 38 Z" strokeWidth="1" />
        <circle cx="50" cy="46" r="3" fill="currentColor" />
        <line x1="50" y1="58" x2="50" y2="90" strokeDasharray="2 2" />

        {/* Envelope */}
        <rect x="20" y="90" width="60" height="40" rx="3" strokeWidth="1.2" />
        <path d="M 20 90 L 50 115 L 80 90" strokeWidth="1.2" />
        <line x1="20" y1="130" x2="42" y2="111" />
        <line x1="80" y1="130" x2="58" y2="111" />

        {/* Waves */}
        <path d="M 40 34 A 12 12 0 0 1 60 34" strokeDasharray="2 2" />
        <path d="M 34 28 A 20 20 0 0 1 66 28" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

function SystemsPipeline() {
  const containerRef = useRef(null);
  const clientRef = useRef(null);
  const serverRef = useRef(null);
  const dbRef = useRef(null);

  // Proximity Attraction: attract nodes slightly towards cursor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const trackNode = (ref, nodeX, nodeY) => {
        const el = ref.current;
        if (!el) return;
        const dx = mouseX - nodeX;
        const dy = mouseY - nodeY;
        const dist = Math.hypot(dx, dy);

        if (dist < 100) {
          const force = (1 - dist / 100) * 8;
          const angle = Math.atan2(dy, dx);
          gsap.to(el, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
            scale: 1.15,
            filter: "drop-shadow(0 0 8px rgba(245,166,35,0.7))",
            duration: 0.3,
          });
        } else {
          gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            filter: "drop-shadow(0 0 0px rgba(0,0,0,0))",
            duration: 0.4,
          });
        }
      };

      trackNode(clientRef, 30, 25);
      trackNode(serverRef, 130, 25);
      trackNode(dbRef, 230, 25);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-[260px] h-[50px] relative pointer-events-auto flex items-center justify-between select-none"
      title="Architecture Pipeline: Active"
    >
      <style>{`
        @keyframes pipelineFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -30; }
        }
        .pipeline-wire {
          stroke-dasharray: 6 12;
          animation: pipelineFlow 1.2s linear infinite;
        }
        .pipeline-node {
          transition: color 0.3s ease;
        }
      `}</style>

      {/* SVG Wires Layer */}
      <svg className="absolute inset-0 w-full h-full text-gold/30 pointer-events-none" viewBox="0 0 260 50">
        {/* Wire 1: Client to Server */}
        <line x1="30" y1="25" x2="130" y2="25" stroke="rgba(245,166,35,0.15)" strokeWidth="1.5" />
        <line 
          x1="30" y1="25" 
          x2="130" y2="25" 
          stroke="#f5a623" 
          strokeWidth="1.8" 
          className="pipeline-wire" 
        />

        {/* Wire 2: Server to Database */}
        <line x1="130" y1="25" x2="230" y2="25" stroke="rgba(245,166,35,0.15)" strokeWidth="1.5" />
        <line 
          x1="130" y1="25" 
          x2="230" y2="25" 
          stroke="#f5a623" 
          strokeWidth="1.8" 
          className="pipeline-wire" 
          style={{ animationDirection: "reverse" }}
        />
      </svg>

      {/* Node 1: Client (Phone App) */}
      <div 
        ref={clientRef} 
        className="w-8 h-8 rounded-full border border-line bg-panel flex items-center justify-center text-white hover:text-gold hover:border-gold/50 transition-colors z-10 pipeline-node cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12" y2="18.01" strokeLinecap="round" />
        </svg>
      </div>

      {/* Node 2: Server (Cloud Backend) */}
      <div 
        ref={serverRef} 
        className="w-8 h-8 rounded-full border border-line bg-panel flex items-center justify-center text-white hover:text-gold hover:border-gold/50 transition-colors z-10 pipeline-node cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Node 3: Database (Systems Storage) */}
      <div 
        ref={dbRef} 
        className="w-8 h-8 rounded-full border border-line bg-panel flex items-center justify-center text-white hover:text-gold hover:border-gold/50 transition-colors z-10 pipeline-node cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
        </svg>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const headerRef = useRef(null);
  const panelRef = useRef(null);
  const menuListRef = useRef(null);
  const linkRefs = useRef([]);
  const ctaRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Entrance animation on first load.
  useLayoutEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(headerRef.current, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "power3.out" });
    tl.fromTo(ctaRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.3");
    return () => tl.kill();
  }, []);

  // Proximity Magnetic Hover Effect on CTA and Menu buttons
  useEffect(() => {
    const cta = ctaRef.current;
    const menuBtn = menuBtnRef.current;

    const bindMagnetic = (btn) => {
      if (!btn) return () => {};

      const handleMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.hypot(dx, dy);

        if (distance < 85) {
          // Attract element slightly towards cursor
          gsap.to(btn, {
            x: dx * 0.35,
            y: dy * 0.35,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          // Snap back with subtle elastic bounce
          gsap.to(btn, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "elastic.out(1.1, 0.5)",
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "elastic.out(1.1, 0.5)",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    const cleanupCta = bindMagnetic(cta);
    const cleanupMenu = bindMagnetic(menuBtn);

    return () => {
      cleanupCta();
      cleanupMenu();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (window.scrollY === 0) {
              setActive("home");
            } else {
              setActive(e.target.id);
            }
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Handle smooth 60fps Z-direction menu entrance
  useLayoutEffect(() => {
    if (open) {
      stopLenis();
      document.body.style.overflow = "hidden";

      const ctx = gsap.context(() => {
        // Overlay fade
        gsap.fromTo(panelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });

        // Container fade and gentle slide
        gsap.fromTo(
          menuListRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );

        // Staggered cards slide up and scale in snappily
        gsap.fromTo(
          linkRefs.current,
          { opacity: 0, y: 40, scale: 0.96 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.55, 
            stagger: 0.05, 
            ease: "power3.out", 
            delay: 0.05, 
            force3D: true 
          }
        );
      });

      return () => {
        ctx.revert();
      };
    } else {
      startLenis();
      document.body.style.overflow = "";
    }
  }, [open]);

  // Disable 3D mouse parallax tilt by keeping mousemove empty
  function onMenuMouseMove(e) {}

  function go(href) {
    setOpen(false);
    startLenis();
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
    scrollTo(targetY, { offset: 0 });
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-500 overflow-hidden ${
          scrolled || open ? "bg-[#050505] border-b border-line" : "bg-transparent border-b border-line/10"
        }`}
        style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
      >
        {/* faint animated scan-line accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.5), transparent)",
            width: "40%",
            animation: "navsheen 7s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes navsheen {
            0% { transform: translateX(-120%); }
            50% { transform: translateX(220%); }
            100% { transform: translateX(220%); }
          }
        `}</style>

        <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("#home");
            }}
            className="relative z-10 block cursor-pointer transition-transform duration-300 active:scale-95 shrink-0"
          >
            <img 
              src="/logo-white.png" 
              alt="Ally Soft Solutions Logo" 
              className="h-14 w-auto object-contain" 
            />
          </a>

          {/* Centered Systems Architecture Pipeline */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
            <SystemsPipeline />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 z-10">
            <a
              ref={ctaRef}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
              }}
              className="hidden sm:inline-flex items-center gap-2 bg-gold hover:bg-amber text-ink font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_25px_rgba(245,166,35,0.45)] active:scale-95"
            >
              Start Your Build
            </a>

            {/* Custom Modern Menu Pill Button */}
            <button
              ref={menuBtnRef}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={open}
              className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all duration-300 ${
                open
                  ? "bg-gold text-ink border-gold shadow-[0_0_20px_rgba(245,166,35,0.5)]"
                  : "bg-panel/80 hover:bg-void text-white border-line hover:border-gold/50 shadow-md hover:shadow-[0_0_15px_rgba(245,166,35,0.2)]"
              }`}
            >
              <span>{open ? "CLOSE" : "MENU"}</span>
              <div className="w-4 h-3 flex flex-col justify-between items-end relative overflow-hidden">
                <span className={`h-[1.5px] transition-all duration-300 ${open ? 'w-4 rotate-45 translate-y-[5.2px] bg-ink' : 'w-4 bg-white'}`} />
                <span className={`h-[1.5px] transition-all duration-300 ${open ? 'w-4 -rotate-45 -translate-y-[5.2px] bg-ink' : 'w-2.5 group-hover:w-4 bg-gold'}`} />
              </div>
            </button>
          </div>
        </nav>

      </header>

      {/* Fullscreen Navigation Menu Overlay */}
      <div
        ref={panelRef}
        onMouseMove={onMenuMouseMove}
        data-lenis-prevent
        className={`fixed inset-0 z-[55] bg-ink/96 backdrop-blur-2xl overflow-y-auto ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          ref={menuListRef}
          className="w-full max-w-none px-4 sm:px-8 lg:px-12 flex flex-col justify-start md:justify-center pt-28 pb-16 sm:py-20 min-h-screen"
        >
          {/* 6 Engraved Vertical Cards Grid - Expanded width & height to cover 100% full screen */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 lg:gap-6 min-h-[500px] lg:h-[75vh]">
            {LINKS.map((l, i) => {
              const isActive = active === l.href.slice(1);
              return (
                <div
                  key={l.href}
                  ref={(el) => (linkRefs.current[i] = el)}
                  onClick={() => go(l.href)}
                  className={`group cursor-pointer relative rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col justify-between p-6 sm:p-7 min-h-[220px] sm:min-h-[300px] lg:min-h-[420px] lg:h-full w-full bg-panel ${
                    isActive
                      ? "border-gold shadow-[0_0_40px_rgba(245,166,35,0.4)]"
                      : "border-line hover:border-gold/50"
                  }`}
                >
                  {/* Background Full-bleed Geometric Art SVG */}
                  {l.svg}

                  {/* Center Spacer to push content down (like Image 2 layout) */}
                  <div className="flex-1" />

                  {/* Bottom Card Title & Arrow */}
                  <div className="z-10 pt-4 border-t border-line/30 flex items-center justify-between shrink-0 overflow-hidden w-full">
                    <span className="font-display text-base sm:text-lg font-bold tracking-wider uppercase text-white overflow-hidden h-[1.25em] relative block">
                      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                        <span className="block">{l.label}</span>
                        <span className="absolute top-full left-0 block text-gold">{l.label}</span>
                      </span>
                    </span>
                    <ArrowUpRight size={20} className="text-mist group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}


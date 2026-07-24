import { useEffect, useRef, useState } from "react";

export default function FloatingAllyBall() {
  const [pos, setPos] = useState({ x: 300, y: 200 });
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sparks, setSparks] = useState([]);

  const stateRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth * 0.7 : 400,
    y: 200,
    vx: 1.8,
    vy: 1.2,
    isScrolling: false,
  });

  function handleTouch() {
    setTouched(true);

    // Add continuous velocity acceleration on touch without stopping
    const s = stateRef.current;
    const angle = Math.random() * Math.PI * 2;
    s.vx += Math.cos(angle) * 3.8;
    s.vy += Math.sin(angle) * 3.8;

    // Burst 6 golden particle sparks
    const newSparks = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random(),
      dx: Math.cos((i / 6) * Math.PI * 2) * 35,
      dy: Math.sin((i / 6) * Math.PI * 2) * 35,
    }));
    setSparks(newSparks);

    setTimeout(() => setTouched(false), 500);
    setTimeout(() => setSparks([]), 650);
  }

  // Track scrolling state: allow component overlap while scrolling so ball never gets stuck
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    let idleTimeoutId = null;

    let isDesktop = false;
    const checkIsDesktop = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isSmall = window.innerWidth < 1024;
      isDesktop = !isCoarse && !isSmall;
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    const resetIdleTimer = () => {
      setVisible(false);
      if (idleTimeoutId) clearTimeout(idleTimeoutId);

      idleTimeoutId = setTimeout(() => {
        if (document.body.style.overflow !== "hidden") {
          setVisible(true);
        }
      }, 10000); // 10 seconds
    };

    // Start 10-second idle timer on mount
    resetIdleTimer();

    function onScroll() {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;

      const s = stateRef.current;
      s.isScrolling = true;

      if (Math.abs(dy) > 0.5) {
        // Move ball in direction of scroll only on mobile/tablet vertical scrolling fallback
        if (!isDesktop) {
          s.y += dy * 0.75;
        }
        s.vx += (Math.random() - 0.5) * 1.5;
      }

      // Hide ball on scroll and reset 10-second timer
      resetIdleTimer();

      // Reactivate component bouncing 150ms after user stops scrolling
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        stateRef.current.isScrolling = false;
      }, 150);
    }

    // Hide ball when nav menu overlay is open (body overflow hidden)
    const checkVisibility = () => {
      if (document.body.style.overflow === "hidden") {
        setVisible(false);
      }
    };

    const interval = setInterval(checkVisibility, 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", resetIdleTimer, { passive: true });
    window.addEventListener("touchstart", resetIdleTimer, { passive: true });

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (idleTimeoutId) clearTimeout(idleTimeoutId);
      clearInterval(interval);
      window.removeEventListener("resize", checkIsDesktop);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
    };
  }, []);

  // Multi-directional physics loop
  useEffect(() => {
    let animId;

    function tick() {
      const s = stateRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const radius = 24; // Ball radius in px

      // Random multi-directional float impulses
      s.vx += (Math.random() - 0.5) * 0.18;
      s.vy += (Math.random() - 0.5) * 0.18;

      // Maintain dynamic floating speed
      const speed = Math.hypot(s.vx, s.vy);
      if (speed < 1.4) {
        s.vx = (Math.random() - 0.5) * 2.8;
        s.vy = (Math.random() - 0.5) * 2.8;
      } else if (speed > 4.5) {
        s.vx *= 0.92;
        s.vy *= 0.92;
      }

      // Update position
      s.x += s.vx;
      s.y += s.vy;

      // Calculate dynamic minY from Navbar header bottom border to prevent overlap and enable navbar border bouncing
      const navHeader = document.querySelector("header");
      let navBottom = 0;
      if (navHeader) {
        const navRect = navHeader.getBoundingClientRect();
        if (navRect.height > 0 && navRect.top < h) {
          navBottom = navRect.bottom;
        }
      }

      // Viewport Screen Edge Bounds: top bound is strictly the navbar bottom border
      const minX = 35;
      const maxX = w - 35;
      const minY = Math.max(35, navBottom + radius + 4);
      const maxY = h - 35;

      // Bounce margins are handled exclusively by Edge Rebounds below.

      // Edge Rebounds
      if (s.x <= minX) {
        s.x = minX + 2;
        s.vx = Math.abs(s.vx) * 0.88 + 1.2 + Math.random() * 0.4;
      } else if (s.x >= maxX) {
        s.x = maxX - 2;
        s.vx = -(Math.abs(s.vx) * 0.88 + 1.2 + Math.random() * 0.4);
      }

      if (s.y <= minY) {
        s.y = minY + 2;
        s.vy = Math.abs(s.vy) * 0.88 + 1.2 + Math.random() * 0.4;
      } else if (s.y >= maxY) {
        s.y = maxY - 2;
        s.vy = -(Math.abs(s.vy) * 0.88 + 1.2 + Math.random() * 0.4);
      }

      setPos({ x: s.x, y: s.y });
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={handleTouch}
      onMouseEnter={handleTouch}
      onTouchStart={handleTouch}
      className={`fixed z-[50] pointer-events-auto cursor-pointer w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gold via-amber to-amber-500 flex items-center justify-center font-display font-bold text-ink text-[11px] border border-amber-200/90 transition duration-300 ${
        touched
          ? "scale-135 shadow-[0_0_80px_rgba(245,166,35,1)] ring-4 ring-gold/60"
          : "hover:scale-115 shadow-[0_0_40px_rgba(245,166,35,0.9)]"
      }`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      {/* Shockwave expanding ring on touch */}
      {touched && (
        <span className="absolute inset-0 rounded-full border-2 border-gold animate-ping opacity-80" />
      )}

      {/* Particle spark burst */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_#f5a623] transition-all duration-500 ease-out"
          style={{
            transform: `translate(${spark.dx}px, ${spark.dy}px) scale(0)`,
            opacity: 0,
          }}
        />
      ))}

      ALLY
    </div>
  );
}

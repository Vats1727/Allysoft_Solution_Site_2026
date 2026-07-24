import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGsap, isTouch, prefersReducedMotion } from "../lib/engine";
import { scrollTo } from "../lib/lenis";

initGsap();

/**
 * ZScrollStack — renders `items` inside a pinned viewport.
 * As the user scrolls through the section, GSAP pins the container in place
 * until every single card has been scrolled through in sequence. The section
 * will NOT unpin or move to the next section until all items have finished.
 */
export default function ZScrollStack({
  items,
  renderItem,
  vhPerItem = 85,
  leadInVh = 15,
  className = "",
  showRail = true,
}) {
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = prefersReducedMotion;

  useLayoutEffect(() => {
    if (!trackRef.current || !stickyRef.current || reduced) return;
    const n = items.length;

    // Set initial card states
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === 0) {
        gsap.set(el, { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" });
      } else {
        gsap.set(el, { opacity: 0, scale: 0.92, y: 60, pointerEvents: "none" });
      }
    });

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: trackRef.current,
        pin: stickyRef.current,
        start: "top top",
        end: () => `+=${n * window.innerHeight * (vhPerItem / 100)}`,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate(self) {
          const p = gsap.utils.clamp(0, 1, self.progress);

          // Calculate current item index in focus (0 to n-1)
          const rawIndex = p * n;
          const currentFocused = Math.min(Math.floor(rawIndex), n - 1);
          setActiveIndex(currentFocused);

          for (let i = 0; i < n; i++) {
            const el = cardRefs.current[i];
            if (!el) continue;

            // Distance in item units from current scroll progress
            let d = p * n - i;

            // Clamp last item so it stays 100% visible until section completes
            if (i === n - 1 && d > 0) {
              d = 0;
            }

            if (d < -1) {
              // Waiting in queue below
              gsap.set(el, { opacity: 0, scale: 0.92, y: 60, pointerEvents: "none" });
            } else if (d >= -1 && d < 0) {
              // Coming into focus from below
              const norm = 1 + d; // 0 to 1
              gsap.set(el, {
                opacity: gsap.utils.clamp(0, 1, norm * 1.5),
                scale: 0.92 + norm * 0.08,
                y: (1 - norm) * 50,
                pointerEvents: norm > 0.4 ? "auto" : "none",
              });
            } else if (d >= 0 && d <= 0.7) {
              // In active focus
              gsap.set(el, {
                opacity: 1,
                scale: 1,
                y: 0,
                pointerEvents: "auto",
              });
            } else if (d > 0.7 && d <= 1.2) {
              // Transitioning out upward as next item enters
              const norm = (d - 0.7) / 0.5; // 0 to 1
              gsap.set(el, {
                opacity: gsap.utils.clamp(0, 1, 1 - norm * 1.2),
                scale: 1 + norm * 0.05,
                y: -norm * 40,
                pointerEvents: norm < 0.5 ? "auto" : "none",
              });
            } else {
              // Already passed upward
              gsap.set(el, { opacity: 0, scale: 1.05, y: -40, pointerEvents: "none" });
            }
          }
        },
      });

      // Refresh ScrollTrigger to calculate accurate coordinates
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => st.kill();
    }, trackRef);

    return () => ctx.revert();
  }, [items.length, reduced, vhPerItem]);

  const goToItem = (index) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const startY = rect.top + scrollTop;
    const totalScrollableHeight = items.length * window.innerHeight * (vhPerItem / 100);
    const targetY = startY + (index / items.length) * totalScrollableHeight + 20;
    scrollTo(targetY);
  };

  // Fallback for touch devices / reduced motion: simple stacked list
  if (reduced || isTouch) {
    return (
      <div className={className}>
        <div className="space-y-10">
          {items.map((item, i) => (
            <SimpleReveal key={i} index={i}>
              {renderItem(item, i, { active: true, progress: 0 })}
            </SimpleReveal>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className={`relative ${className}`}>
      <div
        ref={stickyRef}
        className="h-screen w-full overflow-hidden flex items-center justify-center pt-12 pb-6"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative w-full max-w-5xl px-4 min-h-[460px] sm:min-h-[420px] flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {renderItem(item, i, { active: i === activeIndex, progress: 0 })}
            </div>
          ))}
        </div>

        {showRail && (
          <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToItem(i)}
                aria-label={`Jump to item ${i + 1}`}
                className="group p-1 flex items-center justify-center transition-transform duration-300 focus:outline-none"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-3 h-3 bg-gold shadow-[0_0_12px_rgba(245,166,35,0.8)] scale-125"
                      : "w-2 h-2 bg-line hover:bg-gold/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleReveal({ children, index }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const tween = gsap.fromTo(
      ref.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.03,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
      }
    );
    return () => tween?.scrollTrigger?.kill();
  }, [index]);
  return <div ref={ref}>{children}</div>;
}


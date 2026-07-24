import { useLayoutEffect, useRef } from "react";
import { ArrowRight, MousePointerClick } from "lucide-react";
import { gsap } from "gsap";
import { initGsap, reveal, depthScrub } from "../lib/engine";
import OrbitScene from "./OrbitScene";
import ParallaxLayer from "./ParallaxLayer";

initGsap();

export default function Hero() {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const sceneWrapRef = useRef(null);
  const cueRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(headRef.current, { y: 50, duration: 1, start: "top 100%" });
      reveal(subRef.current, { y: 30, duration: 0.9, delay: 0.15, start: "top 100%" });
      reveal(ctaRef.current, { y: 20, duration: 0.8, delay: 0.3, start: "top 100%" });
      reveal(sceneWrapRef.current, { x: 60, z: 120, duration: 1.1, delay: 0.2, start: "top 100%" });
      reveal(cueRef.current, { y: 10, duration: 0.8, delay: 0.6, start: "top 100%" });
      // Gentle continuous z-drift as the hero scrolls out of view — no pin,
      // so it can never detach the section's own layout the way the old
      // zoomPin effect did.
      depthScrub(sceneWrapRef.current, { fromZ: 0, toZ: -140, trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  function onMouseMove(e) {
    const r = rootRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    headRef.current.style.transform = `translate3d(${px * -10}px, ${py * -6}px, 0)`;
  }

  return (
    <section
      id="home"
      ref={rootRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden backdrop-blur-[2px]"
      style={{ perspective: "1400px" }}
    >
      {/* ambient depth layers */}
      <ParallaxLayer depth={0.15} className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <ParallaxLayer depth={0.35} className="pointer-events-none absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-gold/5 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center w-full">
        <div className="bg-panel border border-line rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
            Backend-first partners for startups
          </p>
          <h1
            ref={headRef}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight will-change-transform"
          >
            Build fast. <span className="gold-text">Scale smart.</span>
            <br />
            Sleep easy.
          </h1>
          <p ref={subRef} className="mt-6 text-slate-100 text-base sm:text-lg max-w-md leading-relaxed">
            We ship clean products that do the heavy lifting, without the heavy
            drama — mobile apps, web backends, and MVPs built to hold up under
            real traffic.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-amber text-ink font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Start Your Build <ArrowRight size={18} />
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2 border border-line hover:border-gold/60 text-white/90 font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              See Our Work
            </a>
          </div>
        </div>

        <div ref={sceneWrapRef} className="will-change-transform">
          <ParallaxLayer depth={0.5}>
            <OrbitScene />
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}

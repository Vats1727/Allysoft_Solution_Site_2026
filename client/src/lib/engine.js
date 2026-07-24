import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function initGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export const isTouch =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: coarse)").matches || "ontouchstart" in window);

export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Global cursor store — normalized -1..1 pointer position + velocity  */
/* ------------------------------------------------------------------ */
export const cursor = {
  x: 0,
  y: 0,
  px: 0, // raw pixel
  py: 0,
  vx: 0,
  vy: 0,
  down: false,
  listeners: new Set(),
  clickListeners: new Set(),
};

if (typeof window !== "undefined") {
  let lastX = 0,
    lastY = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      lastX = cursor.px;
      lastY = cursor.py;
      cursor.px = e.clientX;
      cursor.py = e.clientY;
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.y = (e.clientY / window.innerHeight) * 2 - 1;
      cursor.vx = cursor.px - lastX;
      cursor.vy = cursor.py - lastY;
      cursor.listeners.forEach((fn) => fn(cursor));
    },
    { passive: true }
  );
  window.addEventListener("pointerdown", (e) => {
    cursor.down = true;
    cursor.clickListeners.forEach((fn) => fn(e));
  });
  window.addEventListener("pointerup", () => (cursor.down = false));
}

export function onCursorClick(fn) {
  cursor.clickListeners.add(fn);
  return () => cursor.clickListeners.delete(fn);
}

/* ------------------------------------------------------------------ */
/* Global scroll progress store (0..1 across full document)           */
/* ------------------------------------------------------------------ */
export const scrollState = { progress: 0, eased: 0, velocity: 0, listeners: new Set() };

if (typeof window !== "undefined") {
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const next = h > 0 ? window.scrollY / h : 0;
    scrollState.velocity = next - scrollState.progress;
    scrollState.progress = next;
    scrollState.listeners.forEach((fn) => fn(scrollState));
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

export function useScrollProgress() {
  const [p, setP] = useState(scrollState.progress);
  useEffect(() => {
    const fn = (s) => setP(s.progress);
    scrollState.listeners.add(fn);
    return () => scrollState.listeners.delete(fn);
  }, []);
  return p;
}

/* ------------------------------------------------------------------ */
/* reveal(): entrance animation, safe for first-in-viewport elements   */
/* ------------------------------------------------------------------ */
export function reveal(target, opts = {}) {
  if (!target) return null;
  const {
    x = 0,
    y = 60,
    z = 0,
    rotateX = 0,
    rotateY = 0,
    duration = 1,
    delay = 0,
    ease = "power3.out",
    start = "top 85%",
    stagger = 0,
    scrub = false,
  } = opts;

  const scaleFrom = z ? 1 - Math.min(Math.abs(z), 400) / 1000 : 1;

  return gsap.fromTo(
    target,
    { x, y, rotateX, rotateY, scale: scaleFrom, opacity: 0 },
    {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease,
      stagger,
      scrollTrigger: {
        trigger: target,
        start,
        toggleActions: "play none none reverse",
        scrub: scrub ? 1 : false,
      },
      clearProps: scrub ? "" : "transform",
    }
  );
}

/** Simple mouse-position parallax translate (x/y/z) — no pin, no layout risk. */
export function parallax(target, { yPercent = -20, xPercent = 0, trigger } = {}) {
  if (!target) return null;
  return gsap.to(target, {
    yPercent,
    xPercent,
    ease: "none",
    scrollTrigger: {
      trigger: trigger || target,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

/**
 * depthScrub(): as a section travels through the viewport, drive it gently
 * backward/forward in Z (scale + slight blur) tied directly to scroll —
 * no pin, so it can never detach layout the way a pinned tween can.
 */
export function depthScrub(target, { fromZ = -60, toZ = 40, trigger } = {}) {
  if (!target) return null;
  const fromScale = 1 - Math.abs(fromZ) / 1400;
  const toScale = 1 - Math.abs(toZ) / 1400;
  return gsap.fromTo(
    target,
    { scale: fromScale, z: fromZ },
    {
      scale: toScale,
      z: toZ,
      ease: "none",
      scrollTrigger: {
        trigger: trigger || target,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.1,
      },
    }
  );
}

/** Hook: element-local mouse-tilt (rotateX/rotateY) — disabled on touch. */
export function useTilt(strength = 12) {
  const ref = useRef(null);
  useEffect(() => {
    if (isTouch || prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    let raf;
    function onMove(e) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateY(${px * strength}deg) rotateX(${
          -py * strength
        }deg) translateZ(10px)`;
      });
    }
    function onLeave() {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref;
}

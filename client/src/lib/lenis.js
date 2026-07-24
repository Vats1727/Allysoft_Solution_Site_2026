import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGsap } from "./engine";

let lenisInstance = null;
let rafId = null;

export function initLenis() {
  if (typeof window === "undefined") return null;
  if (lenisInstance) return lenisInstance;

  initGsap();

  lenisInstance = new Lenis({
    duration: 0.9,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    infinite: false,
  });

  // Keep GSAP ScrollTrigger synchronized with Lenis
  lenisInstance.on("scroll", () => {
    ScrollTrigger.update();
  });

  // Synchronize Lenis updates with GSAP's ticker to prevent drift
  // and run rendering/animations in the exact same frame step.
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function stopLenis() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function startLenis() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: 0,
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

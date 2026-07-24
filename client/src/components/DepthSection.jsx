import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { depthScrub, isTouch, prefersReducedMotion } from "../lib/engine";

/**
 * Wraps a <section> so the whole thing gently drifts in Z as it travels
 * through the viewport — creating a camera moving through 3D space effect.
 */
export default function DepthSection({ children, fromZ = -90, toZ = 60, className = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (isTouch || prefersReducedMotion || !ref.current) return;
    const ctx = gsap.context(() => {
      depthScrub(ref.current, { fromZ, toZ });
    });
    return () => ctx.revert();
  }, [fromZ, toZ]);

  return (
    <div className={className} style={{ perspective: "1200px" }}>
      <div ref={ref} className="will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}

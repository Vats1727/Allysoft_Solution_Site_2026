import { useEffect, useRef } from "react";

export default function ParallaxLayer({ children, depth = 0.3, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    function onMove(e) {
      const el = ref.current;
      if (!el) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) * depth * 0.05;
      const dy = (e.clientY - cy) * depth * 0.05;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [depth]);

  return (
    <div ref={ref} className={`will-change-transform transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
}

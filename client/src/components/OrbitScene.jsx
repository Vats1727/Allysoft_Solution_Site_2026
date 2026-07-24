import { useLayoutEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { Code2, Smartphone, Cloud, Database, Cpu, Server } from "lucide-react";

const NODES = [
  { Icon: Code2, x: 14, y: 18, delay: 0, zBase: 75 },
  { Icon: Smartphone, x: 86, y: 22, delay: 0.6, zBase: 35 },
  { Icon: Cloud, x: 90, y: 74, delay: 1.2, zBase: 95 },
  { Icon: Database, x: 12, y: 78, delay: 1.8, zBase: 45 },
  { Icon: Cpu, x: 50, y: 6, delay: 0.3, zBase: 85 },
  { Icon: Server, x: 50, y: 94, delay: 0.9, zBase: 55 },
];

export default function OrbitScene() {
  const sceneRef = useRef(null);
  const groupRef = useRef(null);

  const paths = useMemo(
    () =>
      NODES.map((n) => {
        const dx = n.x - 50;
        const dy = n.y - 50;
        const len = Math.sqrt(dx * dx + dy * dy);
        return { ...n, len };
      }),
    []
  );

  // Hardware-accelerated 3D Z-direction entrance animation
  useLayoutEffect(() => {
    if (!groupRef.current) return;
    gsap.fromTo(
      groupRef.current,
      { opacity: 0, z: 320, scale: 1.35, rotateX: 22 },
      { opacity: 1, z: 0, scale: 1, rotateX: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  // 3D Parallax Perspective Mouse Tilt
  function onMove(e) {
    const el = sceneRef.current;
    const group = groupRef.current;
    if (!el || !group) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(group, {
      rotateY: px * 26,
      rotateX: -py * 22,
      rotateZ: px * py * 10,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  function onLeave() {
    if (groupRef.current) {
      gsap.to(groupRef.current, {
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }

  return (
    <div
      ref={sceneRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="scene relative w-full aspect-square max-w-md mx-auto"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={groupRef}
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Concentric 3D Z-Depth Portal Rings */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full border border-gold/20 shadow-[0_0_50px_rgba(245,166,35,0.15)]"
          style={{ transform: "translateZ(-60px) rotateX(65deg)", animation: "zringpulse 7s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute inset-4 rounded-full border border-gold/30 shadow-[0_0_60px_rgba(245,166,35,0.25)]"
          style={{ transform: "translateZ(20px) rotateX(65deg)", animation: "zringpulse 7s ease-in-out infinite 1.5s" }}
        />
        <div
          className="pointer-events-none absolute inset-12 rounded-full border border-gold/40 shadow-[0_0_70px_rgba(245,166,35,0.35)]"
          style={{ transform: "translateZ(90px) rotateX(65deg)", animation: "zringpulse 7s ease-in-out infinite 3s" }}
        />

        {/* Dynamic laser connecting lines */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" style={{ transform: "translateZ(20px)" }}>
          <defs>
            <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5a623" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffcf5c" stopOpacity="1" />
              <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
            </linearGradient>
          </defs>
          {paths.map((n, i) => (
            <line
              key={`base-${i}`}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="#f5a623"
              strokeOpacity="0.25"
              strokeWidth="0.7"
            />
          ))}
          {paths.map((n, i) => (
            <line
              key={`pulse-${i}`}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="url(#pulseGrad)"
              strokeWidth="1.4"
              strokeDasharray={`${Math.max(n.len * 0.35, 6)} ${n.len * 3}`}
              style={{
                animation: `dataflow 7.5s linear infinite`,
                animationDelay: `${n.delay}s`,
              }}
            />
          ))}
        </svg>

        {/* Satellite nodes with 3D Z-Depth Layering */}
        {NODES.map(({ Icon, x, y, delay, zBase }, i) => (
          <div
            key={i}
            className="absolute w-12 h-12 rounded-2xl bg-panel/90 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_35px_rgba(245,166,35,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-gold hover:shadow-[0_0_50px_rgba(245,166,35,0.7)]"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              transform: `translate(-50%, -50%) translateZ(${zBase}px)`,
              animation: `znodefloat 5s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              "--z-base": `${zBase}px`,
            }}
          >
            <Icon size={20} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes dataflow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -120; }
        }
        @keyframes znodefloat {
          0%, 100% { transform: translate(-50%, -50%) translateZ(var(--z-base)) scale(1); }
          50% { transform: translate(-50%, -50%) translateZ(calc(var(--z-base) + 30px)) scale(1.12); }
        }
        @keyframes zringpulse {
          0%, 100% { opacity: 0.3; transform: translateZ(-60px) rotateX(65deg) scale(1); }
          50% { opacity: 0.8; transform: translateZ(90px) rotateX(65deg) scale(1.15); }
        }
      `}</style>
    </div>
  );
}

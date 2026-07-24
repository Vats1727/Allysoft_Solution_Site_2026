import { useEffect, useRef, useState } from "react";
import { stopLenis, startLenis } from "../lib/lenis";

/**
 * 3D Perspective Tunnel Canvas — renders a 3D wireframe tunnel with speed lines
 * and glowing Z-depth rings that fly past the viewer during initial page load.
 */
function TunnelCanvas({ progress, isDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate tunnel speed particles
    const particles = Array.from({ length: 140 }).map(() => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random() * 1000 + 1,
      speed: Math.random() * 3 + 3,
    }));

    // Tunnel ring frames
    const numRings = 16;

    const render = () => {
      time += 0.01; // Slower, majestic time step
      const speedMultiplier = 1 + (progress / 100) * 1.8 + (isDone ? 10 : 0);

      ctx.fillStyle = "rgba(10, 12, 16, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 420;

      // 1. Draw 3D Tunnel Wireframe Rings
      for (let i = 0; i < numRings; i++) {
        let z = ((i * 80 - time * 80 * speedMultiplier) % 1200) + 1200;
        if (z < 20) z += 1200;

        const scale = fov / z;
        const radius = 380 * scale;
        const opacity = Math.min(1, (1200 - z) / 400) * 0.45;

        ctx.save();
        ctx.beginPath();

        // 8-sided 3D Tunnel Octagon Frame
        const sides = 8;
        for (let s = 0; s <= sides; s++) {
          const angle = (s / sides) * Math.PI * 2 + time * 0.08;
          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = `rgba(245, 166, 35, ${opacity})`;
        ctx.lineWidth = Math.max(1, 2.5 * scale);
        ctx.shadowColor = "#f5a623";
        ctx.shadowBlur = 10 * scale;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw 3D Warp Speed Particles flying towards viewer
      particles.forEach((p) => {
        p.z -= p.speed * speedMultiplier;
        if (p.z <= 1) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * 2;
          p.y = (Math.random() - 0.5) * 2;
        }

        const k = fov / p.z;
        const px = p.x * k * 300 + cx;
        const py = p.y * k * 300 + cy;

        // Prev position for streak effect
        const prevK = fov / (p.z + p.speed * speedMultiplier * 1.5);
        const prevPx = p.x * prevK * 300 + cx;
        const prevPy = p.y * prevK * 300 + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const alpha = Math.min(1, (1000 - p.z) / 300) * 0.6;
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(255, 207, 92, ${alpha})`;
          ctx.lineWidth = Math.max(1, 2 * k);
          ctx.stroke();
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [progress, isDone]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function PageLoader({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Lock scroll during loading
    stopLenis();
    document.body.style.overflow = "hidden";

    let progressTimer;
    let startTime = Date.now();
    const minLoadingTime = 2400; // Slower, majestic min loading time for tunnel flight

    progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 92) {
          const diff = Math.random() * 8 + 3;
          return Math.min(92, Math.floor(prev + diff));
        }
        return prev;
      });
    }, 160);

    function finishLoading() {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        clearInterval(progressTimer);
        setProgress(100);
        setTimeout(() => {
          setIsDone(true);
          startLenis();
          document.body.style.overflow = "";
          if (onLoadingComplete) onLoadingComplete();

          setTimeout(() => {
            setIsMounted(false);
          }, 900);
        }, 400);
      }, remainingTime);
    }

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading);
    }

    return () => {
      clearInterval(progressTimer);
      window.removeEventListener("load", finishLoading);
      document.body.style.overflow = "";
    };
  }, [onLoadingComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/95 backdrop-blur-2xl transition-all duration-1000 ease-in ${
        isDone ? "opacity-0 pointer-events-none scale-[3.5] blur-sm" : "opacity-100 scale-100"
      }`}
    >
      {/* 3D Perspective Tunnel Canvas */}
      <TunnelCanvas progress={progress} isDone={isDone} />

      {/* Ambient glowing background orb */}
      <div className="absolute w-80 h-80 rounded-full bg-gold/15 blur-3xl animate-pulse pointer-events-none" />

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Animated Brand Logo */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-gold/20 to-amber/30 blur-2xl animate-pulse" />
          <img 
            src="/logo-white.png" 
            alt="Ally Soft Solutions Logo" 
            className="h-16 sm:h-20 w-auto object-contain relative z-10" 
          />
        </div>

        {/* Circular Progress Ring Indicator */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="4"
              className="text-line/40"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="url(#goldGradient)"
              strokeWidth="4"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
              fill="transparent"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5a623" />
                <stop offset="100%" stopColor="#ffcf5c" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute font-display text-xs font-semibold text-white/90">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

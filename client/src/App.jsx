import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { initLenis, getLenis } from "./lib/lenis";
import { gsap } from "gsap";
import { initGsap } from "./lib/engine";
import PageLoader from "./components/PageLoader";
import Scene3D from "./components/Scene3D";
import FloatingAllyBall from "./components/FloatingAllyBall";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Work from "./components/Work";
import Stack from "./components/Stack";
import WhyAllySoft from "./components/WhyAllySoft";
import HowWeWork from "./components/HowWeWork";
import WhyChooseUs from "./components/WhyChooseUs";
import About from "./components/About";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import DepthSection from "./components/DepthSection";
import ProductDetails from "./components/ProductDetails";
import { PROJECTS } from "./data/projects";

const sections = [
  { id: "home", component: <Hero /> },
  { id: "services", component: <DepthSection fromZ={-100} toZ={70}><Services /></DepthSection> },
  { id: "work", component: <DepthSection fromZ={-80} toZ={60}><Work /></DepthSection> },
  { id: "stack", component: <DepthSection fromZ={-90} toZ={70}><Stack /></DepthSection> },
  { id: "why-ally", component: <DepthSection fromZ={70} toZ={-70}><WhyAllySoft /></DepthSection> },
  { id: "process", component: <DepthSection fromZ={-90} toZ={70}><HowWeWork /></DepthSection> },
  { id: "why-choose-us", component: <DepthSection fromZ={70} toZ={-70}><WhyChooseUs /></DepthSection> },
  { id: "about", component: <DepthSection fromZ={-90} toZ={70}><About /></DepthSection> },
  { id: "team", component: <DepthSection fromZ={-80} toZ={60}><Team /></DepthSection> },
];

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const activeIndexRef = useRef(0);
  const isAnimating = useRef(false);

  const isProductPage = currentHash.startsWith("#product/");
  const activeProductSlug = isProductPage ? currentHash.replace("#product/", "") : null;
  const activeProduct = activeProductSlug ? PROJECTS.find((p) => p.slug === activeProductSlug) : null;

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    initLenis();

    const checkIsDesktop = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isSmall = window.innerWidth < 1024;
      setIsDesktop(!isCoarse && !isSmall);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useLayoutEffect(() => {
    if (!isDesktop) return;

    initGsap();

    const panels = gsap.utils.toArray(".scrolly-section");
    if (!panels.length) return;

    // Set initial states for all panels: offset yPercent, zIndex stack, opaque base
    panels.forEach((panel, idx) => {
      gsap.set(panel, { 
        yPercent: 100, 
        autoAlpha: 0, 
        opacity: 1, 
        scale: 1, 
        y: 0,
        zIndex: idx,
        transformStyle: "preserve-3d"
      });
      panel.style.pointerEvents = idx === 0 ? "auto" : "none";
    });
    // First panel is active initially
    gsap.set(panels[0], { yPercent: 0, autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (sections.length - 1)}`,
        pin: containerRef.current,
        scrub: 0.1,
        onUpdate: (self) => {
          const idx = Math.min(
            sections.length - 1,
            Math.max(0, Math.round(self.progress * (sections.length - 1)))
          );
          activeIndexRef.current = idx;
          panels.forEach((p, pIdx) => {
            p.style.pointerEvents = pIdx === idx ? "auto" : "none";
          });
        },
      },
    });

    // Create shutter slide-over transitions between consecutive panels
    panels.forEach((panel, i) => {
      if (i === 0) return;

      // Previous panel slides up slightly (parallax) and hides
      tl.fromTo(panels[i - 1], 
        {
          yPercent: 0,
          autoAlpha: 1,
        },
        {
          yPercent: -15,
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
        }, 
        i - 1
      )
      // Current panel slides up from bottom like a shutter covering it
      .fromTo(panel, 
        {
          yPercent: 100,
          autoAlpha: 1,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power2.inOut",
        }, 
        i - 1
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isDesktop, isProductPage]);

  // One-Section-At-A-Time scroll hijacking for pinned deck to prevent skipping
  useEffect(() => {
    if (!isDesktop) return;

    const handleWheel = (e) => {
      // Allow native scrolling when at the last section and scrolling down (exiting to Contact/Footer)
      if (activeIndexRef.current === sections.length - 1 && e.deltaY > 0) {
        return;
      }

      // Allow native scrolling when at the first section and scrolling up (back to top)
      if (activeIndexRef.current === 0 && e.deltaY < 0) {
        return;
      }

      // Block normal free scrolling in the pinned zone
      e.preventDefault();

      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 20) return;

      let nextIndex = activeIndexRef.current;
      if (e.deltaY > 0) {
        nextIndex = Math.min(sections.length - 1, activeIndexRef.current + 1);
      } else {
        nextIndex = Math.max(0, activeIndexRef.current - 1);
      }

      if (nextIndex !== activeIndexRef.current) {
        isAnimating.current = true;
        const targetY = nextIndex * window.innerHeight;

        // Defensive unlock fallback
        const fallback = setTimeout(() => {
          isAnimating.current = false;
        }, 1200);

        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(targetY, {
            immediate: false,
            duration: 0.95,
            onComplete: () => {
              clearTimeout(fallback);
              isAnimating.current = false;
            },
          });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
          setTimeout(() => {
            clearTimeout(fallback);
            isAnimating.current = false;
          }, 800);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isDesktop, isProductPage]);

  // Scroll to hash target (e.g. #work) when returning from product details page
  useEffect(() => {
    if (!isProductPage && currentHash) {
      const timer = setTimeout(() => {
        const targetEl = document.querySelector(currentHash);
        if (targetEl) {
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset;
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(targetY, { immediate: true });
          } else {
            window.scrollTo(0, targetY);
          }
        }
      }, 50); // small delay to let DOM elements mount
      return () => clearTimeout(timer);
    }
  }, [isProductPage, currentHash]);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {/* Full Screen Hardware-Accelerated Glassmorphism Blur Loader */}
      {!isLoaded && <PageLoader onLoadingComplete={handleLoadingComplete} />}

      {/* 3D Background Canvas Layer */}
      <div style={{ display: isProductPage ? "none" : "block" }}>
        <Scene3D isLoaded={isLoaded} />
      </div>

      {isProductPage && activeProduct ? (
        <ProductDetails project={activeProduct} />
      ) : (
        /* Main Website Content */
        <div className="relative text-white font-body min-h-screen overflow-x-hidden">
          {/* Site-wide Floating Ally Ping-Pong Ball rendered behind z-10 section content */}
          <FloatingAllyBall />

          <div className="relative z-10">
            <Navbar />

            {isDesktop ? (
              <div ref={triggerRef} className="relative">
                {/* Absolute scroll markers to generate scroll space and enable native browser anchor hash routing */}
                <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: `${sections.length * 100}vh` }}>
                  {sections.map((sec) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      className="w-full h-screen"
                    />
                  ))}
                </div>

                {/* Pinned section viewport container */}
                <div 
                  ref={containerRef} 
                  className="w-full h-screen overflow-hidden relative"
                  style={{ clipPath: "inset(80px 0px 0px 0px)", transformStyle: "preserve-3d" }}
                >
                  {sections.map((sec) => (
                    <div key={sec.id} className="scrolly-section">
                      {sec.component}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Mobile vertical scrolling fallback
              <>
                <Hero />
                <DepthSection fromZ={-100} toZ={70}>
                  <Services />
                </DepthSection>
                <DepthSection fromZ={-80} toZ={60}>
                  <Work />
                </DepthSection>
                <DepthSection fromZ={-90} toZ={70}>
                  <Stack />
                </DepthSection>
                <DepthSection fromZ={70} toZ={-70}>
                  <WhyAllySoft />
                </DepthSection>
                <DepthSection fromZ={-90} toZ={70}>
                  <HowWeWork />
                </DepthSection>
                <DepthSection fromZ={70} toZ={-70}>
                  <WhyChooseUs />
                </DepthSection>
                <DepthSection fromZ={-90} toZ={70}>
                  <About />
                </DepthSection>
                <DepthSection fromZ={-80} toZ={60}>
                  <Team />
                </DepthSection>
              </>
            )}

            {/* Contact and Footer rendered in normal document flow below the pinned container on desktop */}
            <Contact />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

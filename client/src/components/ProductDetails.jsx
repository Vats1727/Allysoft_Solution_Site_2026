import { useEffect } from "react";
import { ArrowLeft, Check, ExternalLink, ShieldCheck, Zap, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { startLenis, getLenis } from "../lib/lenis";
import { getImageUrl } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

export default function ProductDetails({ project }) {
  // Ensure page starts at the top and start Lenis for details page smooth scroll
  useEffect(() => {
    startLenis();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [project?.id, project?.slug]);

  const handleBack = (e) => {
    e.preventDefault();
    window.location.hash = "work";
  };

  const handleRedirect = () => {
    if (!project.link) return;
    if (project.link.startsWith("http")) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    } else {
      window.location.hash = project.link;
    }
  };

  if (!project) return null;

  const tags = Array.isArray(project.tags) 
    ? project.tags 
    : (typeof project.tags === "string" ? JSON.parse(project.tags) : []);

  const features = Array.isArray(project.features) 
    ? project.features 
    : (typeof project.features === "string" ? JSON.parse(project.features) : []);

  const pricing = Array.isArray(project.pricing) 
    ? project.pricing 
    : (typeof project.pricing === "string" ? JSON.parse(project.pricing) : []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30 text-left">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050505]/80 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <a
            href="#work"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-mist hover:text-gold transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </a>
          <img src={getImageUrl("/logo-white.png")} alt="Ally Soft Solutions" className="h-10 w-auto object-contain" />
        </div>
      </header>

      {/* Main Details Wrapper */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        
        {/* Intro Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-mono">
              <ShieldCheck size={14} /> {project.category}
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight relative group">
              <VisualEditorTrigger sectionPath="/admin/projects" />
              {project.title}
            </h1>
            <p className="text-mist leading-relaxed text-base sm:text-lg font-light">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-void border border-line text-slate-200 font-mono">
                  {t}
                </span>
              ))}
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleRedirect}
                className="inline-flex items-center gap-3 bg-gold hover:bg-amber text-ink font-semibold px-8 py-4 rounded-full text-base transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(245,166,35,0.3)] cursor-pointer"
              >
                {(project.link || "").startsWith("http") ? "Go to Product Website" : "Start Your Custom Build"} <ExternalLink size={18} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-line overflow-hidden bg-void shadow-2xl p-2 bg-panel">
              <div className="aspect-[1024/489] overflow-hidden rounded-2xl">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section (Conditional) */}
        {features.length > 0 && (
          <section className="mb-24">
            <div className="text-center max-w-xl mx-auto mb-16 relative group">
              <VisualEditorTrigger sectionPath="/admin/projects" />
              <h2 className="font-display text-3xl font-bold mb-4">Everything you need to run your business</h2>
              <div className="h-1 w-20 bg-gold mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border border-line bg-panel/30 hover:border-gold/30 hover:bg-panel/50 transition-all duration-300 group"
                >
                  <div className="mb-5 p-3 rounded-lg bg-gold/10 w-fit group-hover:scale-110 transition-transform">
                    {(() => {
                      const IconComponent = LucideIcons[f.icon] || LucideIcons.Zap;
                      return <IconComponent className="text-gold" size={24} />;
                    })()}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-3">{f.title}</h3>
                  <p className="text-mist text-sm leading-relaxed font-light">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Table Section (Conditional) */}
        {pricing.length > 0 && (
          <section className="mb-24">
            <div className="text-center max-w-xl mx-auto mb-16 relative group">
              <VisualEditorTrigger sectionPath="/admin/projects" />
              <h2 className="font-display text-3xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-mist text-sm">Flexible tiers to support small setups and growing enterprises alike.</p>
            </div>
            <div className={`grid gap-6 items-stretch mx-auto ${
              pricing.length === 5
                ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-[90rem]"
                : pricing.length === 3
                ? "sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
                : pricing.length === 2
                ? "sm:grid-cols-2 max-w-3xl"
                : "sm:grid-cols-2 lg:grid-cols-4 max-w-7xl"
            }`}>
              {pricing.map((p, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    p.highlight
                      ? "bg-[#0f0e1c] border-gold/40 shadow-[0_0_35px_rgba(245,166,35,0.15)] scale-[1.03]"
                      : "bg-panel/30 border-line hover:border-gold/20"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-display text-lg font-bold">{p.name}</span>
                      {p.highlight && (
                        <span className="text-[10px] uppercase font-bold text-gold tracking-wider bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline mb-2">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold">{p.price}</span>
                      {p.period && <span className="text-mist text-xs ml-1 font-mono">{p.period}</span>}
                    </div>
                    <p className="text-mist text-xs leading-relaxed mb-6 h-8">{p.desc}</p>
                    
                    <hr className="border-line mb-6" />

                    <ul className="space-y-3.5 mb-8">
                      {p.features && p.features.map((f, idx) => {
                        const isObj = typeof f === "object" && f !== null;
                        const text = isObj ? f.text : f;
                        const isDisabled = isObj ? f.disabled : false;
                        return (
                          <li key={idx} className={`flex items-start gap-2.5 text-xs ${isDisabled ? "text-slate-500 line-through" : "text-slate-200"}`}>
                            {isDisabled ? (
                              <X size={14} className="text-red-500/80 shrink-0 mt-0.5" />
                            ) : (
                              <Check size={14} className="text-gold shrink-0 mt-0.5" />
                            )}
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <button
                    onClick={handleRedirect}
                    className={`w-full py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      p.highlight
                        ? "bg-gold hover:bg-amber text-ink shadow-[0_0_20px_rgba(245,166,35,0.4)]"
                        : "bg-panel hover:bg-void text-white border border-line hover:border-gold/30"
                    }`}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing Action */}
        <section className="p-8 sm:p-12 md:p-16 rounded-3xl border border-line bg-panel/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.06),transparent_60%)] pointer-events-none" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-4">Ready to start?</h2>
          <p className="text-mist text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Experience premium engineering that scales with your growth. Start your build with us today.
          </p>
          <button
            onClick={handleRedirect}
            className="inline-flex items-center gap-3 bg-gold hover:bg-amber text-ink font-semibold px-8 py-4 rounded-full text-base transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(245,166,35,0.4)] cursor-pointer"
          >
            {(project.link || "").startsWith("http") ? "Launch Live Platform" : "Get In Touch"} <ExternalLink size={18} />
          </button>
        </section>

      </main>
    </div>
  );
}

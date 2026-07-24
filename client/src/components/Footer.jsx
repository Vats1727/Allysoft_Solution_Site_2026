import { Mail, Phone } from "lucide-react";

const SOCIALS = [
  { label: "Facebook", href: "#", path: "M13 3h4V0h-4a5 5 0 00-5 5v3H5v4h3v9h4v-9h3.5l.5-4H12V5a1 1 0 011-1z" },
  { label: "Instagram", href: "https://www.instagram.com/allysoftsolutions/", path: "M8 0h8a8 8 0 018 8v8a8 8 0 01-8 8H8a8 8 0 01-8-8V8a8 8 0 018-8zm4 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 2.5a4 4 0 110 8 4 4 0 010-8zm6.75-3.9a1.15 1.15 0 100 2.3 1.15 1.15 0 000-2.3z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ally-soft-solutions/", path: "M4.98 3.5a2 2 0 11-4-.02 2 2 0 014 .02zM.5 8h4v15h-4V8zm7 0h3.85v2.05h.05c.54-1 1.85-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.14V23h-4v-7.5c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.9 1.95-2.9 3.97V23h-4V8z" },
];


export default function Footer() {
  return (
    <footer className="bg-void/40 border-t border-line pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-xl font-bold gold-text mb-3">ALLY SOFT</p>
          <p className="text-mist text-sm leading-relaxed">
            Ally Soft Solutions builds distinctive software that empowers businesses with
            efficiency, security, and scalability.
          </p>
          <div className="flex gap-3 mt-5">
            {SOCIALS.map(({ label, href, path }) => (
              <a 
                key={label} 
                href={href} 
                target={href !== "#" ? "_blank" : undefined}
                rel={href !== "#" ? "noopener noreferrer" : undefined}
                aria-label={label} 
                className="w-9 h-9 rounded-full bg-panel border border-line flex items-center justify-center text-mist hover:text-gold hover:border-gold/40 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display font-semibold text-sm mb-4">Quick Links</p>
          <ul className="space-y-2.5 text-sm text-mist">
            {["Home", "About", "Services", "Portfolio", "Team", "Contact"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-gold transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display font-semibold text-sm mb-4">Services</p>
          <ul className="space-y-2.5 text-sm text-mist">
            {["Custom Builds", "Easy Integrations", "Web Backends", "Mobile Apps"].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display font-semibold text-sm mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-mist">
            <li className="flex items-center gap-2"><Mail size={14} className="text-gold" /> hr@allysoftsolutions.com</li>
            <li className="flex items-start gap-2">
              <Phone size={14} className="text-gold shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span>+91 7574865414</span>
                <span>+91 9023960106</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 pt-6 border-t border-line text-center text-xs text-mist">
        © {new Date().getFullYear()} Ally Soft Solutions. All rights reserved.
      </div>
    </footer>
  );
}

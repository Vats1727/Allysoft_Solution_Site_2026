import { Mail, Phone } from "lucide-react";
import { useLandingData } from "../context/LandingDataContext";
import { getImageUrl } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

export default function Footer() {
  const { data } = useLandingData();
  const footerData = data?.footer_section?.[0] || {
    brand_name: "ALLY SOFT",
    brand_tagline: "Ally Soft Solutions builds distinctive software that empowers businesses with efficiency, security, and scalability.",
    copyright: "Ally Soft Solutions. All rights reserved.",
    links_text: "Quick Links",
    facebook_url: "#",
    instagram_url: "https://www.instagram.com/allysoftsolutions/",
    linkedin_url: "https://www.linkedin.com/company/ally-soft-solutions/"
  };

  const contactData = data?.contact_section?.[0] || {
    email: "hr@allysoftsolutions.com",
    phone1: "+91 7574865414",
    phone2: "+91 9023960106"
  };

  const SOCIALS = [
    { label: "Facebook", href: footerData.facebook_url || "#", path: "M13 3h4V0h-4a5 5 0 00-5 5v3H5v4h3v9h4v-9h3.5l.5-4H12V5a1 1 0 011-1z" },
    { label: "Instagram", href: footerData.instagram_url || "#", path: "M8 0h8a8 8 0 018 8v8a8 8 0 01-8 8H8a8 8 0 01-8-8V8a8 8 0 018-8zm4 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 2.5a4 4 0 110 8 4 4 0 010-8zm6.75-3.9a1.15 1.15 0 100 2.3 1.15 1.15 0 000-2.3z" },
    { label: "LinkedIn", href: footerData.linkedin_url || "#", path: "M4.98 3.5a2 2 0 11-4-.02 2 2 0 014 .02zM.5 8h4v15h-4V8zm7 0h3.85v2.05h.05c.54-1 1.85-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.14V23h-4v-7.5c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.9 1.95-2.9 3.97V23h-4V8z" },
  ].filter(s => s.href !== "#" && s.href !== "");

  const phoneValues = [contactData.phone1, contactData.phone2].filter(Boolean);

  return (
    <footer className="bg-void/40 border-t border-line pt-16 pb-8 relative text-left">
      <VisualEditorTrigger sectionPath="/admin/footer_section" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          {footerData.brand_name && (footerData.brand_name.includes('.') || footerData.brand_name.startsWith('upload/') || footerData.brand_name.startsWith('data:')) ? (
            <img 
              src={getImageUrl(footerData.brand_name)} 
              alt="Allysoft Solutions Footer Logo" 
              className="h-10 w-auto object-contain mb-3" 
            />
          ) : (
            <p className="font-display text-xl font-bold gold-text mb-3">
              {footerData.brand_name}
            </p>
          )}
          <p className="text-mist text-sm leading-relaxed font-light">
            {footerData.brand_tagline}
          </p>
          {SOCIALS.length > 0 && (
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(({ label, href, path }) => (
                <a 
                  key={label} 
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label} 
                  className="w-9 h-9 rounded-full bg-panel border border-line flex items-center justify-center text-mist hover:text-gold hover:border-gold/40 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-display font-semibold text-sm mb-4 text-white">
            {footerData.links_text}
          </p>
          <ul className="space-y-2.5 text-sm text-mist">
            {["Home", "About", "Services", "Portfolio", "Team", "Contact"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-gold transition-colors font-light">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display font-semibold text-sm mb-4 text-white">Services</p>
          <ul className="space-y-2.5 text-sm text-mist font-light">
            {data?.services && data.services.length > 0 ? (
              data.services.slice(0, 4).map((s) => (
                <li key={s.id}>{s.title}</li>
              ))
            ) : (
              ["Custom Builds", "Easy Integrations", "Web Backends", "Mobile Apps"].map((l) => (
                <li key={l}>{l}</li>
              ))
            )}
          </ul>
        </div>

        <div>
          <p className="font-display font-semibold text-sm mb-4 text-white">Contact</p>
          <ul className="space-y-3 text-sm text-mist font-light">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold" /> {contactData.email}
            </li>
            {phoneValues.length > 0 && (
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-gold shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  {phoneValues.map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 pt-6 border-t border-line text-center text-xs text-mist">
        © {new Date().getFullYear()} {footerData.copyright}
      </div>
    </footer>
  );
}

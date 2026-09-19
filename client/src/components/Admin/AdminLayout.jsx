import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import GenericManager from "./GenericManager";
import SubmissionsManager from "./SubmissionsManager";

// Schemas matching the SQLite dynamic database tables and website sections
const schemas = {
  navbar_section: {
    title: "Navbar Logo & CTA Customizer",
    isSingleRow: true,
    fields: [
      { name: "logo", label: "Brand Logo Image", type: "image" },
      { name: "btn_text", label: "CTA Button Label", type: "text" },
      { name: "btn_href", label: "CTA Button Anchor Link (e.g. #contact)", type: "text" }
    ]
  },
  hero_section: {
    title: "Hero Branding Section Customizer",
    isSingleRow: true,
    fields: [
      { name: "tag", label: "Upper Tagline Badge Text", type: "text" },
      { name: "title_line1", label: "Title Line 1", type: "text" },
      { name: "title_line2", label: "Title Line 2 (Highlighted)", type: "text" },
      { name: "title_line3", label: "Title Line 3", type: "text" },
      { name: "description", label: "Description Paragraph", type: "textarea" },
      { name: "btn1_text", label: "Primary Button Text", type: "text" },
      { name: "btn1_href", label: "Primary Button Link", type: "text" },
      { name: "btn2_text", label: "Secondary Button Text", type: "text" },
      { name: "btn2_href", label: "Secondary Button Link", type: "text" }
    ]
  },
  services_settings: {
    title: "Services Main Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Services Section Badge", type: "text" },
      { name: "title", label: "Services Section Header", type: "text" }
    ]
  },
  services: {
    title: "Services List Manager",
    isSingleRow: false,
    fields: [
      { name: "icon", label: "Lucide Icon Name", type: "icon" },
      { name: "title", label: "Service Title", type: "text" },
      { name: "desc", label: "Service Description", type: "textarea" }
    ]
  },
  work_settings: {
    title: "Projects Main Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Projects Section Badge", type: "text" },
      { name: "title", label: "Projects Section Header", type: "text" },
      { name: "description", label: "Projects Description subtext", type: "textarea" }
    ]
  },
  projects: {
    title: "Projects Portfolio Manager",
    isSingleRow: false,
    fields: [
      { name: "slug", label: "Unique URL Slug (e.g. wa-mitra)", type: "text" },
      { name: "title", label: "Project Title", type: "text" },
      { name: "category", label: "Project Category Label", type: "text" },
      { name: "image", label: "mockup Image File", type: "image" },
      { name: "description", label: "Overview Description", type: "textarea" },
      { name: "tags", label: "Tech Stack Tags (Comma separated)", type: "tags" },
      { name: "link", label: "External Product URL Link", type: "text" },
      { name: "features", label: "Core Features List", type: "features_list" },
      { name: "pricing", label: "Pricing Plans List", type: "pricing_list" }
    ]
  },
  stack_settings: {
    title: "Technology Stack Main Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Stack Section Badge", type: "text" },
      { name: "title", label: "Stack Section Header", type: "text" }
    ]
  },
  stack: {
    title: "Tech Stack Category Manager",
    isSingleRow: false,
    fields: [
      { name: "icon", label: "Stack Group Icon", type: "icon" },
      { name: "title", label: "Stack Group Title (e.g. Frontend)", type: "text" },
      { name: "items", label: "Tools List (Comma separated, e.g. React, Next.js)", type: "text" }
    ]
  },
  why_ally_section: {
    title: "Why Ally Soft Main Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Why Ally Section Badge", type: "text" },
      { name: "title", label: "Why Ally Section Header", type: "text" },
      { name: "image", label: "Why Ally Showcase Image file", type: "image" }
    ]
  },
  why_ally_points: {
    title: "Why Ally Advantages List",
    isSingleRow: false,
    fields: [
      { name: "title", label: "Advantage Point Title", type: "text" },
      { name: "desc", label: "Advantage Description Details", type: "textarea" }
    ]
  },
  how_we_work_settings: {
    title: "Our Process Main Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Process Section Badge", type: "text" },
      { name: "title", label: "Process Section Header", type: "text" }
    ]
  },
  how_we_work_steps: {
    title: "Our Process Steps Manager",
    isSingleRow: false,
    fields: [
      { name: "n", label: "Step Number Badge (e.g. 01)", type: "text" },
      { name: "title", label: "Step Heading Title", type: "text" },
      { name: "desc", label: "Step detailed description text", type: "textarea" },
      { name: "milestones", label: "Process Milestones (Comma separated)", type: "tags" }
    ]
  },
  why_choose_us_settings: {
    title: "Our Commitment Main Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Commitment Section Badge", type: "text" },
      { name: "title", label: "Commitment Section Header", type: "text" }
    ]
  },
  why_choose_us: {
    title: "Our Commitment Points Manager",
    isSingleRow: false,
    fields: [
      { name: "icon", label: "Commitment Icon", type: "icon" },
      { name: "title", label: "Commitment Heading Title", type: "text" },
      { name: "desc", label: "Commitment description", type: "textarea" }
    ]
  },
  about_section: {
    title: "About Us branding details",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "About Section Badge", type: "text" },
      { name: "title", label: "About Section Header", type: "text" },
      { name: "desc1", label: "Branding Biography Paragraph 1", type: "textarea" },
      { name: "desc2", label: "Branding Biography Paragraph 2", type: "textarea" },
      { name: "experience_num", label: "Experience Years Value (e.g. 10+)", type: "text" },
      { name: "experience_label", label: "Experience Badge Label", type: "text" },
      { name: "image", label: "Branding Logo Image asset", type: "image" }
    ]
  },
  about_bullets: {
    title: "About bullets highlights",
    isSingleRow: false,
    fields: [
      { name: "icon", label: "Bullet Icon", type: "icon" },
      { name: "title", label: "Bullet Title", type: "text" }
    ]
  },
  team_settings: {
    title: "Team Section Settings",
    isSingleRow: true,
    fields: [
      { name: "badge", label: "Team Section Badge", type: "text" },
      { name: "title", label: "Team Section Header", type: "text" }
    ]
  },
  team: {
    title: "Team roster manager",
    isSingleRow: false,
    fields: [
      { name: "name", label: "Member full name", type: "text" },
      { name: "role", label: "Member corporate role", type: "text" },
      { name: "bio", label: "Member biography description", type: "textarea" },
      { name: "tag", label: "Member label tag (e.g. CEO)", type: "text" },
      { name: "image", label: "Member portrait photo", type: "image" },
      { name: "object_position", label: "Image CSS Alignment Position", type: "text", defaultValue: "center" },
      { name: "scale", label: "Image CSS Scale modifier", type: "number", defaultValue: 1.0 },
      { name: "transform_origin", label: "Image CSS Transform Origin", type: "text", defaultValue: "center" }
    ]
  },
  contact_section: {
    title: "Contact Section Header Settings",
    isSingleRow: true,
    fields: [
      { name: "title", label: "Contact Header Title", type: "text" },
      { name: "desc", label: "Contact Description text", type: "textarea" },
      { name: "owner_email", label: "Lead Notifications Recipient Admin Email", type: "text" }
    ]
  },
  contact_info: {
    title: "Contact Info Channels Manager",
    isSingleRow: false,
    fields: [
      { name: "icon", label: "Channel Icon", type: "icon" },
      { name: "label", label: "Channel Label (e.g. OUR LOCATION)", type: "text" },
      { name: "value", label: "Channel Detail Values (newline separated)", type: "textarea" }
    ]
  },
  footer_section: {
    title: "Footer brand links & social URLs Settings",
    isSingleRow: true,
    fields: [
      { name: "brand_name", label: "Footer Logo Image", type: "image" },
      { name: "brand_tagline", label: "Footer Brand Tagline slogan", type: "textarea" },
      { name: "copyright", label: "Copyright Paragraph Notice", type: "text" },
      { name: "links_text", label: "Sitemaps header text", type: "text" },
      { name: "facebook_url", label: "Facebook Social URL Link", type: "text" },
      { name: "instagram_url", label: "Instagram Social URL Link", type: "text" },
      { name: "linkedin_url", label: "LinkedIn Social URL Link", type: "text" }
    ]
  },
  users: {
    title: "Administrators Manager",
    isSingleRow: false,
    fields: [
      { name: "name", label: "Admin Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "text", required: true },
      { name: "password", label: "New Password (leave blank to keep current)", type: "password" },
      { name: "role", label: "Access Level Role", type: "text", defaultValue: "admin", required: true }
    ]
  }
};

const navigationTabs = [
  { id: "navbar_section", label: "Navbar", icon: "Layout" },
  { id: "hero_section", label: "Hero", icon: "Sparkles" },
  { id: "services", label: "Services", icon: "Grid" },
  { id: "projects", label: "Portfolio", icon: "FolderOpen" },
  { id: "stack", label: "Tech Stack", icon: "Layers" },
  { id: "why_ally", label: "Why Ally", icon: "Zap" },
  { id: "process", label: "Process", icon: "Workflow" },
  { id: "commitment", label: "Commitment", icon: "Award" },
  { id: "about", label: "About Us", icon: "Info" },
  { id: "team", label: "Team", icon: "Users" },
  { id: "contact_section", label: "Contact", icon: "MapPin" },
  { id: "footer_section", label: "Footer", icon: "LayoutTemplate" },
  { id: "submissions", label: "Enquiries", icon: "MailOpen" },
  { id: "users", label: "Manage Admins", icon: "Lock" }
];

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("navbar_section");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  
  const iframeRef = useRef(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Redirect if session token is missing
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle postMessage communication from visual customizer clicks inside the iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === "OPEN_SECTION" && e.data.section) {
        const cleanTab = e.data.section.replace("/admin/", "");
        if (cleanTab) {
          let targetTab = cleanTab;
          if (cleanTab === "services_settings") targetTab = "services";
          if (cleanTab === "work_settings") targetTab = "projects";
          if (cleanTab === "stack_settings") targetTab = "stack";
          if (cleanTab === "why_ally_section" || cleanTab === "why_ally_points") targetTab = "why_ally";
          if (cleanTab === "how_we_work_settings" || cleanTab === "how_we_work_steps") targetTab = "process";
          if (cleanTab === "why_choose_us_settings" || cleanTab === "why_choose_us") targetTab = "commitment";
          if (cleanTab === "about_section" || cleanTab === "about_bullets") targetTab = "about";
          if (cleanTab === "team_settings") targetTab = "team";
          if (cleanTab === "contact_info") targetTab = "contact_section";

          setActiveTab(targetTab);
          
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("open-admin-accordion", {
              detail: { section: cleanTab }
            }));
          }, 100);
          
          const tabBtn = document.getElementById(`tab-btn-${targetTab}`);
          if (tabBtn) {
            tabBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  const getDynamicPublicUrl = () => {
    const path = window.location.pathname;
    const adminIdx = path.toLowerCase().indexOf('/admin');
    if (adminIdx !== -1) {
      return path.substring(0, adminIdx) + '/?admin_preview=true';
    }
    return '/?admin_preview=true';
  };

  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleLiveUpdate = (tbl, updatedRow) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "LIVE_DATA_UPDATE",
        section: tbl,
        data: updatedRow
      }, "*");
    }
  };

  const handleSaveSuccess = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "LIVE_DATA_REFRESH" }, "*");
    }
  };

  const routeAnchorMap = {
    navbar_section: "#",
    hero_section: "#",
    services: "#services",
    projects: "#work",
    stack: "#stack",
    why_ally: "#why-ally",
    process: "#process-section",
    commitment: "#why-choose-us",
    about: "#about",
    team: "#team",
    contact_section: "#contact",
    footer_section: "#",
  };

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const anchor = routeAnchorMap[activeTab] || "";
      try {
        if (anchor) {
          iframeRef.current.contentWindow.location.hash = anchor;
        } else {
          iframeRef.current.contentWindow.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {}
    }
  }, [activeTab]);

  // Handle wheel horizontal scroll mechanics for the carousel menu
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const isWideApp = activeTab === "submissions";

  return (
    <div className="admin-container mode-customizer">
      {/* Sidebar Layout */}
      <aside className={`admin-sidebar editing-active ${!isSidebarOpen ? "collapsed-active" : ""}`}>
        <div className="modern-sidebar-header">
          <div className="admin-logo-box">
            <div className="logo-icon">
              <LucideIcons.ShieldCheck size={20} color="var(--color-accent)" />
            </div>
            <span>ALLY CUSTOMIZER</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={{
              background: "var(--bg-inset)", border: "1px solid var(--border-color)", color: "var(--color-accent)",
              width: "32px", height: "32px", borderRadius: "6px", display: "flex",
              alignItems: "center", justifyContent: "center", cursor: "pointer",
              transition: "all 0.2s"
            }}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <LucideIcons.PanelLeftClose size={16} /> : <LucideIcons.PanelLeftOpen size={16} />}
          </button>
        </div>

        {/* Section Card Carousel inside Sidebar */}
        <div className="sections-horizontal-carousel" ref={carouselRef}>
          {navigationTabs.map((item) => {
            const Icon = LucideIcons[item.icon] || LucideIcons.Circle;
            const isActive = activeTab === item.id;

            return (
              <button 
                key={item.id} 
                id={`tab-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`carousel-card ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <div className="card-icon-container">
                  <Icon size={18} />
                </div>
                <span className="card-label">{item.label}</span>
                {isActive && <span className="active-dot-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Dynamic Nested Form Editor inside Sidebar */}
        <div className="sidebar-native-outlet-wrapper">
          {!isWideApp ? (
            <>
              {activeTab === "navbar_section" && (
                <GenericManager
                  section="navbar_section"
                  schema={schemas.navbar_section}
                  onSaveSuccess={handleSaveSuccess}
                  onLiveUpdate={handleLiveUpdate}
                />
              )}
              {activeTab === "hero_section" && (
                <GenericManager
                  section="hero_section"
                  schema={schemas.hero_section}
                  onSaveSuccess={handleSaveSuccess}
                  onLiveUpdate={handleLiveUpdate}
                />
              )}
              {activeTab === "services" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="services_settings"
                    schema={schemas.services_settings}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="services"
                    schema={schemas.services}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "projects" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="work_settings"
                    schema={schemas.work_settings}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="projects"
                    schema={schemas.projects}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "stack" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="stack_settings"
                    schema={schemas.stack_settings}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="stack"
                    schema={schemas.stack}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "why_ally" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="why_ally_section"
                    schema={schemas.why_ally_section}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="why_ally_points"
                    schema={schemas.why_ally_points}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "process" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="how_we_work_settings"
                    schema={schemas.how_we_work_settings}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="how_we_work_steps"
                    schema={schemas.how_we_work_steps}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "commitment" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="why_choose_us_settings"
                    schema={schemas.why_choose_us_settings}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="why_choose_us"
                    schema={schemas.why_choose_us}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "about" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="about_section"
                    schema={schemas.about_section}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="about_bullets"
                    schema={schemas.about_bullets}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "team" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="team_settings"
                    schema={schemas.team_settings}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="team"
                    schema={schemas.team}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "contact_section" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <GenericManager
                    section="contact_section"
                    schema={schemas.contact_section}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                  <hr style={styles.hr} />
                  <GenericManager
                    section="contact_info"
                    schema={schemas.contact_info}
                    onSaveSuccess={handleSaveSuccess}
                    onLiveUpdate={handleLiveUpdate}
                  />
                </div>
              )}
              {activeTab === "footer_section" && (
                <GenericManager
                  section="footer_section"
                  schema={schemas.footer_section}
                  onSaveSuccess={handleSaveSuccess}
                  onLiveUpdate={handleLiveUpdate}
                />
              )}
              {activeTab === "users" && (
                <GenericManager
                  section="users"
                  schema={schemas.users}
                  onSaveSuccess={handleSaveSuccess}
                  onLiveUpdate={handleLiveUpdate}
                />
              )}
            </>
          ) : (
            <div style={{ 
              padding: "40px 20px", textAlign: "center", height: "100%", 
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
              background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px",
              boxSizing: "border-box"
            }}>
              <div style={{ background: "rgba(245, 166, 35, 0.1)", color: "var(--color-accent)", padding: "16px", borderRadius: "50%", marginBottom: "20px", display: "flex", border: "1px solid var(--border-color)" }}>
                <LucideIcons.Inbox size={32} />
              </div>
              <h3 style={{ fontSize: "14px", color: "var(--text-primary)", margin: "0 0 8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Enquiry Leads Database
              </h3>
              <p style={{ fontSize: "12px", lineHeight: "1.6", color: "var(--text-muted)", margin: "0" }}>
                This table of real-time client consultations is displayed in full-width desktop view on the right panel to present detailed inquiry records comfortably!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Footer actions */}
        <div className="modern-sidebar-footer">
          <a 
            href={getDynamicPublicUrl().replace("?admin_preview=true", "")} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-action-link" 
            title="View Live Public Site"
          >
            <LucideIcons.Globe size={16} />
            <span className="footer-label">Live Public Site</span>
          </a>
          <button className="footer-action-btn" onClick={logout} title="Log Out">
            <LucideIcons.LogOut size={16} />
            <span className="footer-label">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Right Canvas Interactive Viewport Simulator */}
      <main className="admin-main">
        {isWideApp ? (
          <div 
            className="admin-wide-container"
            style={{ 
              position: "fixed",
              top: "0px",
              bottom: "0px",
              right: "0px",
              left: isSidebarOpen ? "380px" : "80px",
              width: isSidebarOpen ? "calc(100vw - 380px)" : "calc(100vw - 80px)",
              height: "100vh",
              zIndex: "10",
              background: "var(--bg-page)",
              overflowY: "auto",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: "24px",
              boxSizing: "border-box"
            }}
          >
            <SubmissionsManager />
          </div>
        ) : (
          <section className="admin-content-container">
            <div 
              className="admin-preview-panel absolute-canvas"
              style={{ 
                position: "fixed",
                top: "0px",
                bottom: "0px",
                right: "0px",
                left: isSidebarOpen ? "380px" : "80px",
                width: isSidebarOpen ? "calc(100vw - 380px)" : "calc(100vw - 80px)",
                height: "100vh",
                margin: "0px",
                padding: "0px",
                zIndex: "10",
                background: "var(--bg-inset)",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "stretch",
                boxSizing: "border-box",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <div 
                className={`browser-simulator-card mode-${previewMode}`}
                style={{ 
                  width: previewMode === "desktop" ? "100%" : previewMode === "mobile" ? "390px" : "768px",
                  maxWidth: "100%",
                  height: previewMode === "desktop" ? "100%" : previewMode === "mobile" ? "85%" : "95%",
                  maxHeight: "100%",
                  position: "absolute",
                  top: previewMode === "desktop" ? "0px" : "50%",
                  left: previewMode === "desktop" ? "0px" : "50%",
                  transform: previewMode === "desktop" ? "none" : "translate(-50%, -50%)",
                  margin: "0px",
                  padding: "0px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: previewMode === "desktop" ? "0px" : "8px",
                  boxShadow: previewMode === "desktop" ? "none" : "0 20px 50px rgba(0,0,0,0.25)",
                  border: previewMode === "desktop" ? "none" : "1px solid var(--border-color)",
                  borderLeft: "1px solid var(--border-color)",
                  overflow: "hidden",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {/* Simulated URL Status Bar controls */}
                <div className="preview-header">
                  <div className="preview-status">
                    <span className="status-dot pulsing"></span> 
                    <span>Live Interactive Simulator</span>
                  </div>

                  <div className="preview-device-controls">
                    <div className="device-btn-group">
                      <button 
                        className={`device-toggle-btn ${previewMode === "mobile" ? "active" : ""}`} 
                        onClick={() => setPreviewMode("mobile")}
                        title="Mobile Preview (390px)"
                      >
                        <LucideIcons.Smartphone size={14} />
                      </button>
                      <button 
                        className={`device-toggle-btn ${previewMode === "desktop" ? "active" : ""}`} 
                        onClick={() => setPreviewMode("desktop")}
                        title="Full Desktop Preview"
                      >
                        <LucideIcons.Monitor size={14} />
                      </button>
                    </div>
                  </div>

                  <button className="refresh-preview-btn" onClick={refreshPreview} title="Reload Public Iframe Preview">
                    <LucideIcons.RotateCw size={14} />
                  </button>
                </div>
                
                <iframe 
                  key={iframeKey}
                  src={getDynamicPublicUrl()} 
                  className="admin-preview-iframe"
                  ref={iframeRef}
                  title="Ally Live Preview"
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Localized Space Dark variables isolation stylesheet */}
      <style>{`
        .admin-container.mode-customizer {
          --bg-page: #060810;
          --bg-surface: #0c0e18;
          --bg-inset: #090a14;
          --text-primary: #e2e8f5;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --color-brand: #0a0e1a;
          --color-accent: #f5a623;
          --color-accent-hover: #d48a10;
          --border-color: rgba(245, 166, 35, 0.12);

          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 99999 !important;
          overflow: hidden !important;
          background: var(--bg-page) !important;
          display: flex !important;
          font-family: 'Space Grotesk', sans-serif !important;
        }

        .admin-sidebar.editing-active {
          flex: 0 0 380px !important;
          width: 380px !important;
          min-width: 380px !important;
          max-width: 380px !important;
          background: var(--bg-surface) !important;
          border-right: 1px solid var(--border-color) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: flex !important;
          flex-direction: column !important;
          height: 100vh !important;
          overflow: hidden !important;
          box-shadow: 4px 0 24px rgba(6, 8, 16, 0.4) !important;
          box-sizing: border-box !important;
        }

        .admin-sidebar.editing-active.collapsed-active {
          flex: 0 0 80px !important;
          width: 80px !important;
          min-width: 80px !important;
          max-width: 80px !important;
        }

        .admin-sidebar.editing-active.collapsed-active .modern-sidebar-header {
          padding: 14px 0 !important;
          justify-content: center !important;
          flex-direction: column !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .admin-logo-box span {
          display: none !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .sidebar-native-outlet-wrapper {
          display: none !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .sections-horizontal-carousel {
          flex-direction: column !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          padding: 16px 0 !important;
          gap: 16px !important;
          align-items: center !important;
          background: var(--bg-inset) !important;
          border-bottom: none !important;
          height: 100% !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .carousel-card {
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          flex-shrink: 0 !important;
          padding: 0 !important;
          justify-content: center !important;
          border-radius: 8px !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .card-label,
        .admin-sidebar.editing-active.collapsed-active .active-dot-indicator {
          display: none !important;
        }

        .modern-sidebar-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 14px 20px !important;
          border-bottom: 1px solid var(--border-color) !important;
          background: var(--bg-surface) !important;
          flex-shrink: 0 !important;
        }
        
        .modern-sidebar-header .admin-logo-box {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        .modern-sidebar-header .admin-logo-box span {
          font-weight: 800;
          font-size: 13px;
          color: var(--text-primary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .modern-sidebar-footer {
          margin-top: auto !important;
          border-top: 1px solid var(--border-color) !important;
          padding: 16px 20px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          background: var(--bg-surface) !important;
          flex-shrink: 0 !important;
        }
        
        .footer-action-btn, .footer-action-link {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          background: transparent !important;
          border: none !important;
          color: var(--text-muted) !important;
          cursor: pointer !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-decoration: none !important;
          transition: all 0.2s !important;
          width: 100% !important;
          box-sizing: border-box !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .footer-action-link:hover {
          background: var(--bg-inset) !important;
          color: var(--color-accent) !important;
        }
        
        .footer-action-btn:hover {
          background: rgba(239, 68, 68, 0.08) !important;
          color: #ef4444 !important;
        }

        .admin-sidebar.editing-active.collapsed-active .modern-sidebar-footer {
          padding: 16px 0 !important;
          align-items: center !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .footer-label {
          display: none !important;
        }
        
        .admin-sidebar.editing-active.collapsed-active .footer-action-btn,
        .admin-sidebar.editing-active.collapsed-active .footer-action-link {
          justify-content: center !important;
          padding: 10px !important;
          width: 44px !important;
          height: 44px !important;
          gap: 0 !important;
        }

        .sections-horizontal-carousel {
          display: flex !important;
          overflow-x: auto !important;
          gap: 10px !important;
          padding: 14px 20px !important;
          background: var(--bg-inset) !important;
          border-bottom: 1px solid var(--border-color) !important;
          flex-shrink: 0 !important;
          scrollbar-width: thin !important;
          scrollbar-color: var(--color-accent) var(--bg-inset) !important;
        }

        .sections-horizontal-carousel::-webkit-scrollbar {
          height: 6px !important;
          display: block !important;
        }
        .sections-horizontal-carousel::-webkit-scrollbar-track {
          background: var(--bg-inset) !important;
        }
        .sections-horizontal-carousel::-webkit-scrollbar-thumb {
          background: var(--color-accent) !important;
          border-radius: 3px !important;
        }

        .carousel-card {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 4px !important;
          text-decoration: none !important;
          color: var(--text-muted) !important;
          flex-shrink: 0 !important;
          width: 58px !important;
          transition: all 0.2s ease-in-out !important;
          position: relative !important;
          background: none !important;
          border: none !important;
          padding: 0 !important;
          cursor: pointer !important;
        }
        
        .card-icon-container {
          width: 38px !important;
          height: 38px !important;
          border-radius: 8px !important;
          background: var(--bg-surface) !important;
          border: 1px solid var(--border-color) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          color: var(--text-muted) !important;
        }
        
        .carousel-card.active .card-icon-container {
          border-color: var(--color-accent) !important;
          color: var(--color-accent) !important;
          background: rgba(245, 166, 35, 0.08) !important;
        }
        
        .carousel-card.active .card-label {
          color: var(--color-accent) !important;
          font-weight: 800 !important;
        }

        .card-label {
          font-size: 9px !important;
          font-weight: 700 !important;
          text-align: center !important;
          max-width: 100% !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        
        .active-dot-indicator {
          position: absolute !important;
          bottom: -4px !important;
          width: 4px !important;
          height: 4px !important;
          border-radius: 50% !important;
          background: var(--color-accent) !important;
        }

        .sidebar-native-outlet-wrapper {
          flex: 1 !important;
          min-height: 0 !important;
          max-height: calc(100vh - 250px) !important;
          overflow-y: auto !important;
          padding: 20px !important;
          display: block !important;
          box-sizing: border-box !important;
        }

        .sidebar-native-outlet-wrapper::-webkit-scrollbar {
          width: 6px !important;
          display: block !important;
        }
        .sidebar-native-outlet-wrapper::-webkit-scrollbar-track {
          background: var(--bg-surface) !important;
        }
        .sidebar-native-outlet-wrapper::-webkit-scrollbar-thumb {
          background: var(--color-accent) !important;
          border-radius: 3px !important;
        }

        .admin-main {
          flex: 1 !important;
          height: 100vh !important;
          background: var(--bg-inset) !important;
          position: relative !important;
          box-sizing: border-box !important;
        }

        .admin-content-container {
          width: 100% !important;
          height: 100% !important;
          position: relative !important;
        }

        .preview-header {
          height: 38px !important;
          background: #090a14 !important;
          border-bottom: 1px solid var(--border-color) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0 16px !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
        }
        
        .preview-status {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: var(--text-secondary) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        
        .status-dot {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          background: #2ECC71 !important;
        }
        
        .status-dot.pulsing {
          box-shadow: 0 0 8px #2ECC71 !important;
          animation: dotPulse 2s infinite !important;
        }
        
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .preview-device-controls {
          display: flex !important;
          align-items: center !important;
        }
        
        .device-btn-group {
          display: flex !important;
          background: var(--bg-surface) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 6px !important;
          padding: 2px !important;
        }
        
        .device-toggle-btn {
          background: none !important;
          border: none !important;
          color: var(--text-muted) !important;
          width: 28px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          border-radius: 4px !important;
          transition: all 0.2s !important;
        }
        
        .device-toggle-btn:hover {
          color: var(--text-primary) !important;
        }
        
        .device-toggle-btn.active {
          background: var(--bg-inset) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(245, 166, 35, 0.1) !important;
        }

        .refresh-preview-btn {
          background: none !important;
          border: none !important;
          color: var(--text-muted) !important;
          cursor: pointer !important;
          width: 28px !important;
          height: 28px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 6px !important;
          transition: all 0.2s !important;
        }
        
        .refresh-preview-btn:hover {
          color: var(--color-accent) !important;
          background: var(--bg-surface) !important;
        }

        .admin-preview-iframe {
          border: none !important;
          width: 100% !important;
          flex: 1 !important;
          background: #ffffff !important;
        }

        @media (max-width: 768px) {
          .admin-sidebar.editing-active {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            min-width: 100vw !important;
            max-width: 100vw !important;
            z-index: 999999 !important;
            height: 100vh !important;
            transform: translateX(0) !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          .admin-sidebar.editing-active.collapsed-active {
            transform: translateX(-100%) !important;
            pointer-events: none !important;
          }
          
          .admin-main {
            width: 100vw !important;
            left: 0 !important;
          }

          .admin-preview-panel.absolute-canvas {
            left: 0 !important;
            width: 100vw !important;
          }

          .admin-wide-container {
            left: 0 !important;
            width: 100vw !important;
            padding: 12px !important;
          }

          .preview-device-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  hr: {
    border: "none",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    margin: "10px 0"
  }
};

export default AdminLayout;

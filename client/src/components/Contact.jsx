import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import Reveal from "./Reveal";
import { useLandingData } from "../context/LandingDataContext";
import { DynamicIcon, getApiEndpoint } from "../utils/helpers";
import VisualEditorTrigger from "./Admin/VisualEditorTrigger";

export default function Contact() {
  const { data } = useLandingData();
  const contactData = data?.contact_section?.[0] || {
    title: "Get In Touch",
    desc: "Have a project in mind? Let's discuss how we can help bring your ideas to life.",
    address: "606, 6th Floor, Shashwat World Commercial Complex, Nr. Kotharia main road, Rajkot 360022",
    address_icon: "MapPin",
    phone1: "+91 7574865414",
    phone2: "+91 9023960106",
    phone_icon: "Phone",
    email: "hr@allysoftsolutions.com",
    email_icon: "Mail",
    hours: "Mon – Sat: 9:00 AM – 6:00 PM",
    hours_icon: "Clock"
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setSent(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(getApiEndpoint("submissions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      const result = await res.json();
      if (result.success) {
        setSent(true);
      } else {
        setError(result.error || "Submission failed. Please check inputs and try again.");
      }
    } catch (err) {
      console.error("Contact Form submission error:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoList = data?.contact_info && data.contact_info.length > 0 ? data.contact_info : [
    { id: 1, label: "OUR LOCATION", value: "606, 6th Floor, Shashwat World Commercial Complex, Nr. Kotharia main road, Rajkot 360022", icon: "MapPin" },
    { id: 2, label: "PHONE NUMBER", value: "+91 7574865414\n+91 9023960106", icon: "Phone" },
    { id: 3, label: "EMAIL ADDRESS", value: "hr@allysoftsolutions.com", icon: "Mail" },
    { id: 4, label: "WORKING HOURS", value: "Mon – Sat: 9:00 AM – 6:00 PM", icon: "Clock" }
  ];

  return (
    <section id="contact" className="py-36 md:py-44 overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal y={30} className="text-center max-w-xl mx-auto mb-16 relative">
          <VisualEditorTrigger sectionPath="/admin/contact_section" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {contactData.title}
          </h2>
          <p className="text-mist mt-4">
            {contactData.desc}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-5 gap-6">
          <Reveal x={-40} className="md:col-span-2 bg-void border border-line rounded-3xl p-8 relative text-left">
            <VisualEditorTrigger sectionPath="/admin/contact_info" />
            <h3 className="font-display font-semibold text-lg mb-6 text-white">Contact Information</h3>
            <div className="space-y-6">
              {infoList.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <span className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <DynamicIcon name={item.icon || "MapPin"} size={17} />
                  </span>
                  <div>
                    <p className="text-xs text-mist uppercase tracking-wide">{item.label}</p>
                    {(item.value || "").split("\n").map((line, idx) => (
                      <p key={idx} className="text-sm mt-1 font-light text-slate-200">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal x={40} className="md:col-span-3 bg-void border border-line rounded-3xl p-8 relative">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center mb-4">
                  <Send size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white">Message sent</h3>
                <p className="text-mist text-sm mt-2">We'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-3 mb-2">
                    {error}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-mist uppercase tracking-wide">Your Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold text-slate-200" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-mist uppercase tracking-wide">Your Email</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="john@example.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold text-slate-200" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-mist uppercase tracking-wide">Subject</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="How can we help?" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold text-slate-200" 
                  />
                </div>
                <div>
                  <label className="text-xs text-mist uppercase tracking-wide">Message</label>
                  <textarea 
                    required 
                    rows={5} 
                    placeholder="Tell us about your project" 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none text-slate-200" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gold hover:bg-amber text-ink font-semibold px-7 py-3.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"} <Send size={16} />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

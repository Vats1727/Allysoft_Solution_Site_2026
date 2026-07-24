import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Reveal from "./Reveal";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="py-36 md:py-44 overflow-hidden backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal y={30} className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Get In Touch</h2>
          <p className="text-mist mt-4">Have a project in mind? Let's discuss how we can help bring your ideas to life.</p>
        </Reveal>

        <div className="grid md:grid-cols-5 gap-6">
          <Reveal x={-40} className="md:col-span-2 bg-void border border-line rounded-3xl p-8">
            <h3 className="font-display font-semibold text-lg mb-6">Contact Information</h3>
            <div className="space-y-6">
              {[
                { Icon: MapPin, label: "Our Location", value: "606, 6th Floor, Shashwat World Commercial Complex, Nr. Kotharia main road, Rajkot 360022" },
                { Icon: Phone, label: "Phone Number", value: ["+91 7574865414", "+91 9023960106"] },
                { Icon: Mail, label: "Email Address", value: "hr@allysoftsolutions.com" },
                { Icon: Clock, label: "Working Hours", value: "Mon – Sat: 9:00 AM – 6:00 PM" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <span className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="text-xs text-mist uppercase tracking-wide">{label}</p>
                    {Array.isArray(value) ? (
                      value.map((v) => (
                        <p key={v} className="text-sm mt-1">{v}</p>
                      ))
                    ) : (
                      <p className="text-sm mt-1">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal x={40} className="md:col-span-3 bg-void border border-line rounded-3xl p-8">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center mb-4">
                  <Send size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg">Message sent</h3>
                <p className="text-mist text-sm mt-2">We'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-mist uppercase tracking-wide">Your Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="text-xs text-mist uppercase tracking-wide">Your Email</label>
                    <input required type="email" placeholder="john@example.com" className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-mist uppercase tracking-wide">Subject</label>
                  <input required type="text" placeholder="How can we help?" className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-xs text-mist uppercase tracking-wide">Message</label>
                  <textarea required rows={5} placeholder="Tell us about your project" className="w-full mt-2 bg-panel border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 bg-gold hover:bg-amber text-ink font-semibold px-7 py-3.5 rounded-full transition-colors">
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Radio, Terminal, Building2, User, HelpCircle } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  const validate = () => {
    const newErrors: Partial<FormState> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.organization.trim()) newErrors.organization = 'Organization or research institution is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulated Transmission Dispatch Flow
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTicketId(`ASTRA-MSG-${Date.now().toString(36).toUpperCase()}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 text-[#F8FAFC]">
      {/* Header */}
      <section className="relative py-16 tech-grid border-b border-[#1E2D44]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/30 inline-block">
            Inquiry & Collaboration
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            Let's Explore the Future of Space Safety.
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Connect with ASTRA-SENTINEL AI to discuss our research, prototype platform, and vision for intelligent space safety.
          </p>
        </div>
      </section>

      {/* Main Form & Info Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <div className="space-card rounded-2xl p-6 sm:p-8 border border-[#58C7FF]/30 relative">
              <h2 className="text-xl font-bold font-display text-[#F8FAFC] mb-2">Send an Inquiry</h2>
              <p className="text-xs text-[#94A3B8] mb-6">
                Fill in the details below. Our technical research team will review your message.
              </p>

              {isSuccess ? (
                <div className="p-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#F8FAFC]">Transmission Logged Successfully</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#F8FAFC]">{formData.name}</strong>. Your message has been ingested by our demonstration inbox dispatch system.
                  </p>
                  <div className="p-3 rounded-lg bg-[#05070D] border border-[#1E2D44] font-mono text-xs text-[#58C7FF] inline-block">
                    TICKET REF: {ticketId}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: '', email: '', organization: '', subject: '', message: '' });
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-mono bg-[#1E2D44] hover:bg-[#2A3F5F] text-[#F8FAFC] transition-colors"
                    >
                      Send Another Transmission
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  {/* Name */}
                  <div>
                    <label className="block text-[#94A3B8] mb-1">YOUR FULL NAME *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Alex Vance"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#05070D] border ${
                        errors.name ? 'border-[#EF4444]' : 'border-[#1E2D44]'
                      } text-[#F8FAFC] focus:outline-none focus:border-[#58C7FF]`}
                    />
                    {errors.name && <span className="text-[#EF4444] text-[10px] mt-1 block">{errors.name}</span>}
                  </div>

                  {/* Email & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#94A3B8] mb-1">WORK EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@aerospace-lab.org"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#05070D] border ${
                          errors.email ? 'border-[#EF4444]' : 'border-[#1E2D44]'
                        } text-[#F8FAFC] focus:outline-none focus:border-[#58C7FF]`}
                      />
                      {errors.email && <span className="text-[#EF4444] text-[10px] mt-1 block">{errors.email}</span>}
                    </div>

                    <div>
                      <label className="block text-[#94A3B8] mb-1">ORGANIZATION / UNIVERSITY *</label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Aerospace Institute / Lab"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#05070D] border ${
                          errors.organization ? 'border-[#EF4444]' : 'border-[#1E2D44]'
                        } text-[#F8FAFC] focus:outline-none focus:border-[#58C7FF]`}
                      />
                      {errors.organization && <span className="text-[#EF4444] text-[10px] mt-1 block">{errors.organization}</span>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[#94A3B8] mb-1">INQUIRY SUBJECT *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Research Collaboration / Prototype Evaluation"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#05070D] border ${
                        errors.subject ? 'border-[#EF4444]' : 'border-[#1E2D44]'
                      } text-[#F8FAFC] focus:outline-none focus:border-[#58C7FF]`}
                    />
                    {errors.subject && <span className="text-[#EF4444] text-[10px] mt-1 block">{errors.subject}</span>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[#94A3B8] mb-1">MESSAGE CONTENT *</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your research inquiry, dataset questions, or collaboration vision..."
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#05070D] border ${
                        errors.message ? 'border-[#EF4444]' : 'border-[#1E2D44]'
                      } text-[#F8FAFC] focus:outline-none focus:border-[#58C7FF]`}
                    />
                    {errors.message && <span className="text-[#EF4444] text-[10px] mt-1 block">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-[#58C7FF] to-[#3B82F6] text-[#05070D] hover:opacity-95 shadow-[0_0_20px_rgba(88,199,255,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Radio className="w-4 h-4 animate-spin" />
                          <span>DISPATCHING TRANSMISSION...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>TRANSMIT INQUIRY</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Technical Notes & Collaboration FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-card rounded-2xl p-6 border border-[#1E2D44]">
              <h3 className="text-base font-bold font-display text-[#F8FAFC] mb-3">
                Research Collaboration Areas
              </h3>
              <ul className="space-y-3 text-xs text-[#94A3B8]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58C7FF] mt-1.5 shrink-0" />
                  <span>Space Biology & Human Physiology datasets (NASA OSDR / ISS telemetry correlation).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1.5 shrink-0" />
                  <span>Microgravity combustion physics and smoldering aerosol sensor validation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                  <span>Real-time edge inference for autonomous deep space flight software.</span>
                </li>
              </ul>
            </div>

            <div className="space-card rounded-2xl p-6 border border-[#1E2D44]">
              <h3 className="text-base font-bold font-display text-[#F8FAFC] mb-2">
                Demonstration Email Service Notice
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                This inquiry portal operates in prototype demonstration mode with client-side validation and simulated dispatch.
                In production, inquiries can be linked to any enterprise SMTP, Resend, or SendGrid webhook via the FastAPI backend environment variables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44] text-xs font-mono text-[#64748B]">
              <div>TRANSMISSION_PROTOCOL: TLS 1.3 / E2EE READY</div>
              <div className="mt-1">DISPATCH_LOCATION: ORBITAL PROTOTYPE REPO</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Send } from 'lucide-react';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import { useToast } from '@/hooks/use-toast';
import { contactInfo, opportunityGroups, socialLinks } from '@/data/constants';

const CONTACT_SHAPES = [
  { label: '$', style: { fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', top: '16%', left: '5%', color: 'rgba(139,92,246,0.08)' }, floatY: [-6, 6, -6], dur: 9 },
  { label: '%', style: { fontSize: 'clamp(1.25rem, 2.5vw, 2.25rem)', top: '22%', right: '7%', color: 'rgba(76,29,149,0.07)' }, floatY: [4, -4, 4], dur: 11 },
  { label: 'Δ', style: { fontSize: 'clamp(1.5rem, 3vw, 2.75rem)', bottom: '24%', left: '6%', color: 'rgba(139,92,246,0.07)' }, floatY: [-5, 5, -5], dur: 13 },
  { label: 'σ', style: { fontSize: 'clamp(1rem, 2vw, 1.75rem)', bottom: '28%', right: '5%', color: 'rgba(34,211,238,0.07)' }, floatY: [5, -5, 5], dur: 10 },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Error', description: 'Please fill in all fields.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to send message');
      }
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2500);
      toast({
        title: 'Message Sent!',
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Compact hero ─────────────────────────────────────────────── */}
      <section
        className="relative text-center px-6 overflow-hidden pt-32 pb-10"
        aria-label="Contact hero"
      >
        {CONTACT_SHAPES.map((shape, i) => (
          <motion.span
            key={i}
            className="font-mono absolute select-none pointer-events-none"
            style={shape.style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: shape.floatY }}
            transition={{
              opacity: { delay: 1 + i * 0.2, duration: 1 },
              y: { duration: shape.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 },
            }}
            aria-hidden="true"
          >
            {shape.label}
          </motion.span>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-accent mb-4 relative z-10"
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 0px rgba(139,92,246,0)',
                '0 0 16px rgba(139,92,246,0.65)',
                '0 0 0px rgba(139,92,246,0)',
              ],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            style={{ display: 'inline' }}
          >
            Let&apos;s Talk
          </motion.span>
        </motion.p>

        <h1 className="font-serif font-bold text-display text-foreground text-balance will-change-transform relative z-10">
          <TextReveal splitBy="word" delay={0.4} staggerDelay={0.1}>
            Get in Touch
          </TextReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-4 relative z-10"
        >
          Available May 2026 &nbsp;&middot;&nbsp; {contactInfo.email}
        </motion.p>
      </section>

      {/* ── Contact info + Form ───────────────────────────────────────── */}
      <section
        className="px-6 lg:px-16 pt-12 pb-16 relative overflow-hidden"
        aria-label="Contact details and form"
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: '20%', right: '-10%',
            width: '40vw', height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          {/* Left — contact info only */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted mb-10">
              Contact
            </p>
            <div className="flex flex-col gap-8">
              {[
                { Icon: Mail, label: 'Email', content: contactInfo.email, href: `mailto:${contactInfo.email}` },
                { Icon: Phone, label: 'Phone', content: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/[^+\d]/g, '')}` },
                { Icon: MapPin, label: 'Location', content: contactInfo.location, sub: contactInfo.locationNote },
              ].map(({ Icon, label, content, href, sub }) => (
                <motion.div
                  key={label}
                  className="flex items-start gap-4"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <motion.div
                    animate={{ filter: ['drop-shadow(0 0 0px rgba(139,92,246,0))', 'drop-shadow(0 0 6px rgba(139,92,246,0.7))', 'drop-shadow(0 0 0px rgba(139,92,246,0))'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: label === 'Email' ? 0 : label === 'Phone' ? 1.3 : 2.6 }}
                  >
                    <Icon className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-foreground hover:text-accent transition-colors text-sm" data-cursor="expand">
                        {content}
                      </a>
                    ) : (
                      <>
                        <p className="text-foreground text-sm">{content}</p>
                        {sub && <p className="text-muted text-xs font-mono">{sub}</p>}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="md:sticky md:top-28"
          >
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted mb-10">
              Send a Message
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
              {[
                { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={handleChange}
                    required
                    className="input-line"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about the opportunity, role, or collaboration you have in mind..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="textarea-line"
                />
              </div>

              <div className="relative">
                <AnimatePresence>
                  {sendSuccess && (
                    <motion.div
                      className="absolute inset-0 rounded pointer-events-none"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1.1 }}
                      exit={{ opacity: 0, scale: 1.3 }}
                      transition={{ duration: 0.5 }}
                      style={{ boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(76,29,149,0.2)' }}
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>
                <MagneticButton type="submit" disabled={isSubmitting} size="lg" data-cursor="expand">
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Open To — full-width centered ────────────────────────────── */}
      <section
        className="px-6 lg:px-16 pt-8 pb-20 border-t border-border"
        aria-label="Open to opportunities"
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-[0.35em] text-muted text-center mb-12"
          >
            Open To
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {opportunityGroups.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <motion.p
                  className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
                >
                  {group.category}
                </motion.p>
                <div className="flex flex-col gap-2">
                  {group.roles.map((role, j) => (
                    <span key={j} className="font-mono text-xs uppercase tracking-widest text-muted">
                      {role}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* LinkedIn centered */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <motion.a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors"
              whileHover={{ y: -2 }}
              data-cursor="expand"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

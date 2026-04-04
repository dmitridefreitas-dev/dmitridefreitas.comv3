'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Linkedin, Send, Radio, ChevronRight } from 'lucide-react';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import { useToast } from '@/hooks/use-toast';
import { contactInfo, opportunityGroups, socialLinks } from '@/data/constants';

/* ── decorative floating symbols ──────────────────────────────────────────── */
const CONTACT_SHAPES = [
  { label: '>', style: { fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', top: '18%', left: '5%', color: 'rgba(139,92,246,0.06)' }, floatY: [-6, 6, -6], dur: 9 },
  { label: '//', style: { fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', top: '25%', right: '7%', color: 'rgba(0,212,255,0.05)' }, floatY: [4, -4, 4], dur: 11 },
  { label: '::',  style: { fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', bottom: '30%', left: '6%', color: 'rgba(139,92,246,0.05)' }, floatY: [-5, 5, -5], dur: 13 },
  { label: '{}', style: { fontSize: 'clamp(1rem, 2vw, 1.5rem)', bottom: '25%', right: '5%', color: 'rgba(0,229,160,0.05)' }, floatY: [5, -5, 5], dur: 10 },
];

/* ── subject options ──────────────────────────────────────────────────────── */
const SUBJECTS = [
  'General Inquiry',
  'Quantitative Research Role',
  'Data Science Role',
  'Financial Engineering Role',
  'Research Collaboration',
  'Other',
];

/* ── animations ───────────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── typewriter hook ──────────────────────────────────────────────────────── */
function useTypewriter(lines, charSpeed = 45, lineDelay = 300, startDelay = 0, shouldStart = false) {
  const [state, setState] = useState({ lineIdx: -1, charIdx: 0, done: false });

  useEffect(() => {
    if (!shouldStart) return;
    setState({ lineIdx: -1, charIdx: 0, done: false });
    let lineIdx = 0, charIdx = 0;
    let timer;

    const tick = () => {
      if (lineIdx >= lines.length) {
        setState((s) => ({ ...s, done: true }));
        return;
      }
      const line = lines[lineIdx];
      charIdx++;
      setState({ lineIdx, charIdx, done: false });
      if (charIdx >= line.length) {
        lineIdx++;
        charIdx = 0;
        timer = setTimeout(tick, lineDelay);
      } else {
        timer = setTimeout(tick, charSpeed);
      }
    };

    const startTimer = setTimeout(tick, startDelay);
    return () => { clearTimeout(timer); clearTimeout(startTimer); };
  }, [shouldStart]); // eslint-disable-line

  // build displayed lines array
  const displayed = lines.map((line, i) => {
    if (i < state.lineIdx) return line;
    if (i === state.lineIdx) return line.slice(0, state.charIdx);
    return null;
  });

  return { displayed, done: state.done };
}

/* ── terminal opportunity card ───────────────────────────────────────────── */
function TerminalCard({ group, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView]); // eslint-disable-line

  const allLines = [group.category, ...group.roles.map((r) => `> ${r}`)];
  const { displayed } = useTypewriter(allLines, 40, 180, 0, started);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="rounded-sm overflow-hidden border border-[rgba(139,92,246,0.18)]"
      style={{ background: '#050810' }}
    >
      {/* Raw terminal prompt bar */}
      <div
        className="px-4 py-2 border-b font-mono text-[10px] flex items-center gap-2"
        style={{ borderColor: 'rgba(139,92,246,0.14)', background: '#02030A' }}
      >
        <span style={{ color: 'rgba(0,229,160,0.7)' }}>dmitri</span>
        <span style={{ color: 'rgba(139,92,246,0.5)' }}>@</span>
        <span style={{ color: 'rgba(0,212,255,0.6)' }}>portfolio</span>
        <span style={{ color: 'rgba(139,92,246,0.4)' }}>:~$</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>cat opportunities.sys</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 min-h-[140px]">
        {displayed.map((text, i) => {
          if (text === null) return null;
          const isHeader = i === 0;
          const lastVisible = Math.max(...displayed.map((d, idx) => d !== null ? idx : -1));
          return (
            <div key={i} className="font-mono text-[11px] mb-1.5 flex items-start gap-2">
              {isHeader ? (
                <>
                  <span style={{ color: 'rgba(139,92,246,0.5)' }}>#</span>
                  <span style={{ color: 'rgba(0,212,255,0.85)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    {text}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ color: 'rgba(0,229,160,0.5)' }}>–</span>
                  <span style={{ color: 'rgba(200,210,230,0.65)' }}>{text.slice(2)}</span>
                </>
              )}
              {i === lastVisible && (
                <motion.span
                  className="inline-block font-mono"
                  style={{ color: 'rgba(139,92,246,0.8)' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >▋</motion.span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
      toast({ title: 'Error', description: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}${formData.subject ? ` — ${formData.subject}` : ''}`);
      const body = encodeURIComponent(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`);
      window.location.href = `mailto:d.defreitas@wustl.edu?subject=${subject}&body=${body}`;

      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
      toast({
        title: 'Opening email client…',
        description: "Your default mail app will open to send the message.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast({
        title: 'Transmission Failed',
        description: err.message || 'Could not open email client. Please email d.defreitas@wustl.edu directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── system info items ──────────────────────────────────────────────────── */
  const systemInfo = [
    { prefix: 'EMAIL', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { prefix: 'PHONE', value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/[^+\d]/g, '')}` },
    { prefix: 'LOCATION', value: contactInfo.location },
    { prefix: 'STATUS', value: 'Available May 2026' },
    { prefix: 'LINKEDIN', value: 'dmitri-de-freitas', href: socialLinks.linkedin, external: true },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Establish Connection
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative text-center px-6 overflow-hidden pt-32 pb-12"
        aria-label="Contact hero"
      >
        {/* Floating symbols */}
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

        {/* Animated radio icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center justify-center mb-6 relative z-10"
        >
          <motion.div
            className="absolute w-16 h-16 rounded-full"
            style={{ border: '1px solid rgba(139,92,246,0.15)' }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{ border: '1px solid rgba(0,212,255,0.08)' }}
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Radio className="h-5 w-5 text-accent" />
          </div>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-[0.4em] mb-5 relative z-10"
          style={{ color: '#D022FF' }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 10px rgba(208, 34, 255, 0.4)',
                '0 0 25px rgba(208, 34, 255, 0.9)',
                '0 0 10px rgba(208, 34, 255, 0.4)',
              ],
              opacity: [1, 0.8, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            style={{ display: 'inline' }}
          >
            Establish Connection
          </motion.span>
        </motion.p>

        {/* Title */}
        <h1 className="font-serif font-bold text-foreground text-balance will-change-transform relative z-10" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          <TextReveal splitBy="word" delay={0.4} staggerDelay={0.1} center>
            TRANSMIT MESSAGE
          </TextReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-5 relative z-10"
        >
          Available May 2026 &nbsp;&middot;&nbsp; {contactInfo.email}
        </motion.p>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SYSTEM OUTPUT + FORM
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="px-6 lg:px-16 pt-8 pb-16 relative overflow-hidden"
        aria-label="Contact details and form"
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: '15%', right: '-12%',
            width: '45vw', height: '45vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* Shared label row — both labels aligned on same line */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 lg:gap-16 mb-6">
          <div className="md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] inline-block" />
              System Output
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-accent" />
              Compose Transmission
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Left Panel: System Output ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2"
          >

            {/* Terminal-style info block */}
            <div className="rounded-xl overflow-hidden border border-border">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#080E1C] border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/60" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/50 ml-2">
                  contact.sys
                </span>
              </div>

              {/* Terminal body */}
              <div className="bg-[#080E1C]/50 p-5 flex flex-col gap-3">
                {systemInfo.map((item, i) => (
                  <motion.div
                    key={item.prefix}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className="flex items-start gap-3 group"
                  >
                    <span className="font-mono text-[10px] text-accent/50 mt-0.5 select-none flex-shrink-0">&gt;</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00D4FF]/60 w-20 flex-shrink-0 mt-0.5">
                      {item.prefix}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors break-all"
                        data-cursor="expand"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-foreground/80">{item.value}</span>
                    )}
                  </motion.div>
                ))}
                {/* Blinking cursor line */}
                <motion.div
                  className="flex items-center gap-3 mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="font-mono text-[10px] text-accent/50 select-none">&gt;</span>
                  <motion.span
                    className="font-mono text-xs text-accent"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                </motion.div>
              </div>
            </div>

          </motion.div>

          {/* ── Right Panel: Transmission Form ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="md:col-span-3 md:sticky md:top-28"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
                      {label} <span className="text-accent/40">*</span>
                    </label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={placeholder}
                      value={formData[id]}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#080E1C]/50 border border-border rounded-lg px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted/40 outline-none transition-all duration-300 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    />
                  </div>
                ))}
              </div>

              {/* Subject dropdown */}
              <div>
                <label htmlFor="subject" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#080E1C]/50 border border-border rounded-lg px-4 py-3 text-sm font-sans text-foreground outline-none transition-all duration-300 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                >
                  <option value="" className="bg-[#080E1C] text-muted">Select a subject...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-[#080E1C] text-foreground">{s}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
                  Message <span className="text-accent/40">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Describe the opportunity, role, or collaboration..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-[#080E1C]/50 border border-border rounded-lg px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted/40 outline-none resize-none transition-all duration-300 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                />
              </div>

              {/* Submit button */}
              <div className="relative" style={{ perspective: '800px' }}>
                <AnimatePresence>
                  {sendSuccess && (
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none z-20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1.05 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      style={{ boxShadow: '0 0 40px rgba(0,229,160,0.3), 0 0 80px rgba(0,229,160,0.1)' }}
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>

                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  data-cursor="expand"
                  className="shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block"
                      >
                        <Radio className="h-4 w-4" />
                      </motion.span>
                      Transmitting...
                    </span>
                  ) : sendSuccess ? (
                    <span className="flex items-center gap-2 text-[#00E5A0]">
                      Transmission Sent
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      SEND TRANSMISSION
                      <ChevronRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OPEN TO — Opportunity Groups
      ══════════════════════════════════════════════════════════════════════ */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {opportunityGroups.map((group, i) => (
              <TerminalCard key={i} group={group} delay={i * 300} />
            ))}
          </div>

          {/* LinkedIn centered */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-16"
          >
            <motion.a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors"
              whileHover={{ y: -2 }}
              data-cursor="expand"
            >
              <Linkedin className="h-3.5 w-3.5" /> Connect on LinkedIn
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

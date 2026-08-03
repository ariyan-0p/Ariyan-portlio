import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Linkedin, MessageCircle, Phone, Send, Loader2, CheckCircle2, AlertCircle,
  User, AtSign, ArrowLeft, ArrowRight, Wallet, CalendarClock, LayoutGrid
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
//  1) WEB3FORMS  —  sends YOU an instant notification of every lead
//     (already active — messages go to ariyansamal1201@gmail.com)
// ─────────────────────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY = "27fbabea-da5e-4cff-9520-6cf096ef7e24";

// ─────────────────────────────────────────────────────────────
//  2) BREVO  —  runs the automated email sequence to the CLIENT
//     Flip BREVO_ENABLED to true AFTER you create your Brevo form.
//     Paste the form's "serve" URL below (Brevo → Contacts → Forms).
//     Field names (EMAIL, FIRSTNAME, BUDGET, TIMELINE, PROJECT_TYPE,
//     MESSAGE) must match the attribute codes you create in Brevo.
// ─────────────────────────────────────────────────────────────
const BREVO_ENABLED = false;
const BREVO_FORM_URL = ""; // e.g. "https://sibforms.com/serve/MUIFxxxxxxxxxxxx"

// ─────────────────────────────────────────────────────────────
//  Form field options
// ─────────────────────────────────────────────────────────────
const PROJECT_TYPES = ["Web App", "Mobile App", "E-Commerce", "SaaS / Platform", "Other"];
const BUDGETS = ["< ₹25k", "₹25k – ₹75k", "₹75k – ₹2L", "₹2L+", "Not sure yet"];
const TIMELINES = ["ASAP", "Within 1 month", "1 – 3 months", "Flexible"];

const TOTAL_STEPS = 3;

export default function Contact() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", projectType: "", budget: "", timeline: "", message: "",
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  // Per-step validation
  const stepValid = () => {
    if (step === 1) return form.name.trim() && /\S+@\S+\.\S+/.test(form.email);
    if (step === 2) return form.projectType && form.budget && form.timeline;
    if (step === 3) return form.message.trim().length > 0;
    return true;
  };

  const next = () => stepValid() && setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stepValid()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      // (1) Notify YOU via Web3Forms — full lead details, readable response
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New lead: ${form.name} — ${form.projectType}`,
        from_name: "Portfolio Contact Form",
        name: form.name,
        email: form.email,
        project_type: form.projectType,
        budget: form.budget,
        timeline: form.timeline,
        message: form.message,
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Submission failed.");

      // (2) Hand the contact to Brevo to trigger the automated sequence (fire-and-forget)
      if (BREVO_ENABLED && BREVO_FORM_URL) {
        const brevo = new FormData();
        brevo.append("EMAIL", form.email);
        brevo.append("FIRSTNAME", form.name);
        brevo.append("PROJECT_TYPE", form.projectType);
        brevo.append("BUDGET", form.budget);
        brevo.append("TIMELINE", form.timeline);
        brevo.append("MESSAGE", form.message);
        // no-cors: we can't read the response, but the submission still lands
        fetch(BREVO_FORM_URL, { method: "POST", mode: "no-cors", body: brevo }).catch(() => {});
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Network error. Please try again.");
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col justify-between py-24 md:py-32 bg-black relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full flex-grow flex flex-col justify-center relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* LEFT COLUMN: CTA + Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h2 className="text-5xl md:text-8xl font-bold text-white leading-tight">
                Let's build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">something.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-md leading-relaxed">
                Tell me about your project in a few quick steps. I'll review it and get back to you within a day.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-1">Email</h3>
                <a href="mailto:ariyansamal1201@gmail.com" className="inline-flex items-center gap-2 text-xl md:text-2xl font-bold text-white hover:text-purple-400 transition-colors break-words">
                  <Mail size={18} className="text-purple-400" />
                  ariyansamal1201@gmail.com
                </a>
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-1">Phone</h3>
                <a href="tel:+919937643350" className="inline-flex items-center gap-2 text-xl md:text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                  <Phone size={18} className="text-purple-400" />
                  +91 99376 43350
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-500 text-sm font-mono tracking-widest uppercase">Follow Me</h3>
              <div className="flex gap-4">
                <SocialLink icon={<Linkedin size={20} />} href="https://www.linkedin.com/in/ariyan-samal-767614281/" label="LinkedIn" />
                <SocialLink icon={<MessageCircle size={20} />} href="https://wa.me/919937643350" label="WhatsApp" />
                <SocialLink icon={<Mail size={20} />} href="mailto:ariyansamal1201@gmail.com" label="Email" />
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Multi-step Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-transparent rounded-[26px] blur-[2px] pointer-events-none" />

            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[520px] flex flex-col">

              {status === "success" ? (
                <SuccessState name={form.name} />
              ) : (
                <>
                  {/* Progress header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
                        Step {step} of {TOTAL_STEPS}
                      </span>
                      <span className="text-xs font-mono text-purple-400">
                        {Math.round((step / TOTAL_STEPS) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="flex-grow">
                      <AnimatePresence mode="wait">
                        {/* STEP 1 — About you */}
                        {step === 1 && (
                          <StepWrap key="s1">
                            <StepTitle>Let's start with you</StepTitle>
                            <Field label="Name" htmlFor="name">
                              <IconInput icon={<User size={16} />}>
                                <input id="name" type="text" value={form.name}
                                  onChange={(e) => set("name")(e.target.value)}
                                  placeholder="Your name" autoComplete="name"
                                  className={inputCls("pl-11")} />
                              </IconInput>
                            </Field>
                            <Field label="Email" htmlFor="email">
                              <IconInput icon={<AtSign size={16} />}>
                                <input id="email" type="email" value={form.email}
                                  onChange={(e) => set("email")(e.target.value)}
                                  placeholder="you@example.com" autoComplete="email"
                                  className={inputCls("pl-11")} />
                              </IconInput>
                            </Field>
                          </StepWrap>
                        )}

                        {/* STEP 2 — Project details */}
                        {step === 2 && (
                          <StepWrap key="s2">
                            <StepTitle>About your project</StepTitle>
                            <ChipGroup label="Project Type" icon={<LayoutGrid size={13} />}
                              options={PROJECT_TYPES} value={form.projectType} onChange={set("projectType")} />
                            <ChipGroup label="Budget" icon={<Wallet size={13} />}
                              options={BUDGETS} value={form.budget} onChange={set("budget")} />
                            <ChipGroup label="Timeline" icon={<CalendarClock size={13} />}
                              options={TIMELINES} value={form.timeline} onChange={set("timeline")} />
                          </StepWrap>
                        )}

                        {/* STEP 3 — Message */}
                        {step === 3 && (
                          <StepWrap key="s3">
                            <StepTitle>Anything else?</StepTitle>
                            <Field label="Message" htmlFor="message">
                              <textarea id="message" rows={6} value={form.message}
                                onChange={(e) => set("message")(e.target.value)}
                                placeholder="Describe your idea, goals, or any details that help..."
                                className={inputCls("resize-none")} />
                            </Field>
                            <div className="text-xs text-slate-500 font-mono">
                              {form.projectType} · {form.budget} · {form.timeline}
                            </div>
                          </StepWrap>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Nav buttons */}
                    <div className="flex items-center gap-3 mt-6">
                      {step > 1 && (
                        <button type="button" onClick={back}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                          <ArrowLeft size={18} /> Back
                        </button>
                      )}

                      {step < TOTAL_STEPS ? (
                        <button type="button" onClick={next} disabled={!stepValid()}
                          className={btnCls}>
                          Continue <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button type="submit" disabled={status === "loading" || !stepValid()}
                          className={btnCls}>
                          {status === "loading"
                            ? <><Loader2 size={20} className="animate-spin" /> Sending...</>
                            : <>Send Message <Send size={18} /></>}
                        </button>
                      )}
                    </div>

                    {status === "error" && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-3 mt-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" /> {errorMsg}
                      </motion.div>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full text-center py-8 border-t border-white/5 relative z-10 mt-16">
        <p className="text-slate-600 text-sm">
          Made with passion by <span className="text-purple-400">Ariyan Samal</span>. © 2026
        </p>
      </div>
    </section>
  );
}

/* ── Shared styles ── */
const inputCls = (extra = "") =>
  `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all ${extra}`;
const btnCls =
  "flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full text-base hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";

/* ── Small components ── */
function StepWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ children }) {
  return <h3 className="text-xl font-bold text-white mb-1">{children}</h3>;
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-slate-500 text-xs font-mono tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

function IconInput({ icon, children }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</span>
      {children}
    </div>
  );
}

function ChipGroup({ label, icon, options, value, onChange }) {
  return (
    <div className="space-y-2.5">
      <label className="flex items-center gap-1.5 text-slate-500 text-xs font-mono tracking-widest uppercase">
        {icon} {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-3.5 py-2 rounded-full border text-sm transition-all ${
                active
                  ? "border-purple-500/60 bg-purple-500/15 text-white"
                  : "border-white/10 text-slate-400 hover:text-white hover:border-white/25"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SuccessState({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center flex-grow py-10 space-y-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center"
      >
        <CheckCircle2 size={40} className="text-green-400" />
      </motion.div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">Message sent{name ? `, ${name.split(" ")[0]}` : ""}!</h3>
        <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
          Thanks for reaching out. I've got your details and will be in touch shortly — keep an eye on your inbox.
        </p>
      </div>
    </motion.div>
  );
}

function SocialLink({ icon, href, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-purple-500/50 transition-all duration-300">
      {icon}
    </a>
  );
}
